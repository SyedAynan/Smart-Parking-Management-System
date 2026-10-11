"""End-to-end API tests (in-memory SQLite)."""

from fastapi.testclient import TestClient

from parking.main import create_app

client = TestClient(create_app(":memory:"))


def _lot():
    r = client.post("/api/lots", json={"name": "Main", "hourly_rate": 60})
    assert r.status_code == 201, r.text
    return r.json()


def test_full_flow():
    lot = _lot()
    lid = lot["id"]

    r = client.post(f"/api/lots/{lid}/slots", json={"codes": ["A1", "A2"]})
    assert r.status_code == 201, r.text

    r = client.post("/api/entry", json={"lot_id": lid, "plate": "abc123"})
    assert r.status_code == 201, r.text
    assert r.json()["slot_code"] == "A1"

    # duplicate entry rejected
    r = client.post("/api/entry", json={"lot_id": lid, "plate": "ABC123"})
    assert r.status_code == 409

    r = client.post("/api/entry", json={"lot_id": lid, "plate": "XYZ9"})
    assert r.status_code == 201, r.text

    # lot full now
    r = client.post("/api/entry", json={"lot_id": lid, "plate": "FULL1"})
    assert r.status_code == 409

    r = client.get(f"/api/lots/{lid}/report")
    assert r.json()["occupied_slots"] == 2

    r = client.post("/api/exit", json={"lot_id": lid, "plate": "abc123"})
    assert r.status_code == 200, r.text
    assert r.json()["amount"] == 0.0  # within grace period

    r = client.get(f"/api/lots/{lid}/slots")
    codes = {s["code"]: s["is_occupied"] for s in r.json()}
    assert codes == {"A1": 0, "A2": 1}


def test_exit_unknown_vehicle_404():
    lot = _lot()
    r = client.post("/api/exit", json={"lot_id": lot["id"], "plate": "NOPE"})
    assert r.status_code == 404


def test_entry_unknown_lot_404():
    r = client.post("/api/entry", json={"lot_id": 9999, "plate": "X"})
    assert r.status_code == 404


def test_billing_rounds_up():
    from datetime import timedelta

    from parking import service as svc_mod
    from parking.service import compute_amount, now_utc

    assert compute_amount(now_utc() - timedelta(minutes=10), now_utc(), 60) == 0.0
    assert compute_amount(now_utc() - timedelta(minutes=16), now_utc(), 60) == 60
    assert compute_amount(now_utc() - timedelta(minutes=61), now_utc(), 60) == 120

    svc_mod.config.GRACE_MINUTES = 0
    try:
        assert compute_amount(now_utc() - timedelta(minutes=5), now_utc(), 60) == 60
    finally:
        svc_mod.config.GRACE_MINUTES = 15
