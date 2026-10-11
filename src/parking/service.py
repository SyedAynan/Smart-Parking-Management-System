"""Domain logic: slots, tickets, billing."""

from datetime import datetime, timezone
from math import ceil
from sqlite3 import Connection, Row

from . import config


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat()


def parse(ts: str) -> datetime:
    return datetime.fromisoformat(ts)


def compute_amount(entry: datetime, exit: datetime, hourly_rate: float) -> float:
    """Hourly billing, rounded up; free inside the grace period."""
    minutes = (exit - entry).total_seconds() / 60
    if minutes <= config.GRACE_MINUTES:
        return 0.0
    return ceil(minutes / 60) * hourly_rate


def row_to_dict(row: Row | None) -> dict | None:
    return dict(row) if row is not None else None


class ParkingService:
    def __init__(self, conn: Connection):
        self.conn = conn

    # -- lots --
    def create_lot(self, name: str, hourly_rate: float) -> dict:
        cur = self.conn.execute(
            "INSERT INTO lots (name, hourly_rate) VALUES (?, ?)", (name, hourly_rate)
        )
        self.conn.commit()
        return self.get_lot(cur.lastrowid)

    def get_lot(self, lot_id: int) -> dict | None:
        row = self.conn.execute("SELECT * FROM lots WHERE id = ?", (lot_id,)).fetchone()
        return row_to_dict(row)

    def list_lots(self) -> list[dict]:
        return [dict(r) for r in self.conn.execute("SELECT * FROM lots ORDER BY id")]

    # -- slots --
    def add_slots(self, lot_id: int, codes: list[str]) -> list[dict]:
        slots = []
        for code in codes:
            try:
                cur = self.conn.execute(
                    "INSERT INTO slots (lot_id, code) VALUES (?, ?)", (lot_id, code)
                )
            except Exception:
                continue  # duplicate code — skip
            slots.append({"id": cur.lastrowid, "lot_id": lot_id, "code": code,
                          "is_occupied": 0})
        self.conn.commit()
        return slots

    def list_slots(self, lot_id: int) -> list[dict]:
        return [
            dict(r)
            for r in self.conn.execute(
                "SELECT * FROM slots WHERE lot_id = ? ORDER BY code", (lot_id,)
            )
        ]

    def free_slot(self, lot_id: int):
        return self.conn.execute(
            "SELECT * FROM slots WHERE lot_id = ? AND is_occupied = 0 "
            "ORDER BY code LIMIT 1",
            (lot_id,),
        ).fetchone()

    # -- tickets --
    def active_ticket(self, lot_id: int, plate: str) -> dict | None:
        row = self.conn.execute(
            "SELECT * FROM tickets WHERE lot_id = ? AND plate = ? "
            "AND exit_time IS NULL",
            (lot_id, plate.upper()),
        ).fetchone()
        return row_to_dict(row)

    def enter(self, lot_id: int, plate: str) -> tuple[dict | None, str | None]:
        plate = plate.strip().upper()
        if not plate:
            return None, "plate is required"
        if self.get_lot(lot_id) is None:
            return None, "lot not found"
        if self.active_ticket(lot_id, plate):
            return None, "vehicle already parked"
        slot = self.free_slot(lot_id)
        if slot is None:
            return None, "lot is full"
        entry = iso(now_utc())
        cur = self.conn.execute(
            "INSERT INTO tickets (lot_id, slot_id, plate, entry_time) "
            "VALUES (?, ?, ?, ?)",
            (lot_id, slot["id"], plate, entry),
        )
        self.conn.execute("UPDATE slots SET is_occupied = 1 WHERE id = ?",
                          (slot["id"],))
        self.conn.commit()
        ticket = row_to_dict(
            self.conn.execute("SELECT * FROM tickets WHERE id = ?",
                              (cur.lastrowid,)).fetchone()
        )
        ticket["slot_code"] = slot["code"]
        return ticket, None

    def exit(self, lot_id: int, plate: str) -> tuple[dict | None, str | None]:
        plate = plate.strip().upper()
        ticket = self.active_ticket(lot_id, plate)
        if ticket is None:
            return None, "no active ticket for this vehicle"
        lot = self.get_lot(lot_id)
        out = now_utc()
        amount = compute_amount(parse(ticket["entry_time"]), out, lot["hourly_rate"])
        exit_ts = iso(out)
        self.conn.execute(
            "UPDATE tickets SET exit_time = ?, amount = ? WHERE id = ?",
            (exit_ts, amount, ticket["id"]),
        )
        self.conn.execute("UPDATE slots SET is_occupied = 0 WHERE id = ?",
                          (ticket["slot_id"],))
        self.conn.commit()
        ticket = row_to_dict(
            self.conn.execute("SELECT * FROM tickets WHERE id = ?",
                              (ticket["id"],)).fetchone()
        )
        slot = self.conn.execute("SELECT * FROM slots WHERE id = ?",
                                 (ticket["slot_id"],)).fetchone()
        ticket["slot_code"] = slot["code"]
        return ticket, None

    def active_tickets(self, lot_id: int) -> list[dict]:
        return [
            dict(r)
            for r in self.conn.execute(
                "SELECT t.*, s.code AS slot_code FROM tickets t "
                "JOIN slots s ON s.id = t.slot_id "
                "WHERE t.lot_id = ? AND t.exit_time IS NULL ORDER BY t.entry_time",
                (lot_id,),
            )
        ]

    def report(self, lot_id: int) -> dict | None:
        lot = self.get_lot(lot_id)
        if lot is None:
            return None
        total = self.conn.execute(
            "SELECT COUNT(*) c FROM slots WHERE lot_id = ?", (lot_id,)
        ).fetchone()["c"]
        occupied = self.conn.execute(
            "SELECT COUNT(*) c FROM slots WHERE lot_id = ? AND is_occupied = 1",
            (lot_id,),
        ).fetchone()["c"]
        revenue = self.conn.execute(
            "SELECT COALESCE(SUM(amount), 0) s FROM tickets WHERE lot_id = ?",
            (lot_id,),
        ).fetchone()["s"]
        return {
            "lot": lot,
            "total_slots": total,
            "occupied_slots": occupied,
            "free_slots": total - occupied,
            "occupancy_pct": round(occupied / total * 100, 1) if total else 0.0,
            "active_vehicles": len(self.active_tickets(lot_id)),
            "total_revenue": revenue,
        }
