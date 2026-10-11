"""FastAPI app factory + routes."""

import os

from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from . import config
from .database import connect
from .schemas import LotCreate, SlotsCreate, VehicleOp
from .service import ParkingService

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")


def create_app(db_path: str | None = None) -> FastAPI:
    app = FastAPI(title="Smart Parking Management System")
    service = ParkingService(connect(db_path or config.DB_PATH))

    def get_service() -> ParkingService:
        return service

    @app.get("/api/lots")
    def list_lots(svc: ParkingService = Depends(get_service)):
        return svc.list_lots()

    @app.post("/api/lots", status_code=201)
    def create_lot(body: LotCreate, svc: ParkingService = Depends(get_service)):
        rate = body.hourly_rate if body.hourly_rate else config.DEFAULT_HOURLY_RATE
        return svc.create_lot(body.name.strip(), rate)

    def _lot_or_404(svc: ParkingService, lot_id: int) -> dict:
        lot = svc.get_lot(lot_id)
        if lot is None:
            raise HTTPException(status_code=404, detail="lot not found")
        return lot

    @app.get("/api/lots/{lot_id}/slots")
    def list_slots(lot_id: int, svc: ParkingService = Depends(get_service)):
        _lot_or_404(svc, lot_id)
        return svc.list_slots(lot_id)

    @app.post("/api/lots/{lot_id}/slots", status_code=201)
    def add_slots(lot_id: int, body: SlotsCreate,
                  svc: ParkingService = Depends(get_service)):
        _lot_or_404(svc, lot_id)
        codes = [c.strip().upper() for c in body.codes if c.strip()]
        if not codes:
            raise HTTPException(status_code=400, detail="no slot codes given")
        return svc.add_slots(lot_id, codes)

    @app.post("/api/entry", status_code=201)
    def enter(body: VehicleOp, svc: ParkingService = Depends(get_service)):
        ticket, err = svc.enter(body.lot_id, body.plate)
        if err:
            status = 404 if err == "lot not found" else 409
            raise HTTPException(status_code=status, detail=err)
        return ticket

    @app.post("/api/exit")
    def exit(body: VehicleOp, svc: ParkingService = Depends(get_service)):
        ticket, err = svc.exit(body.lot_id, body.plate)
        if err:
            raise HTTPException(status_code=404, detail=err)
        return ticket

    @app.get("/api/lots/{lot_id}/active")
    def active(lot_id: int, svc: ParkingService = Depends(get_service)):
        _lot_or_404(svc, lot_id)
        return svc.active_tickets(lot_id)

    @app.get("/api/lots/{lot_id}/report")
    def report(lot_id: int, svc: ParkingService = Depends(get_service)):
        rep = svc.report(lot_id)
        if rep is None:
            raise HTTPException(status_code=404, detail="lot not found")
        return rep

    @app.get("/", include_in_schema=False)
    def index():
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))

    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
    return app


app = create_app()
