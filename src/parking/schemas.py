"""Pydantic request/response models."""

from pydantic import BaseModel, Field


class LotCreate(BaseModel):
    name: str = Field(min_length=1)
    hourly_rate: float = Field(gt=0)


class SlotsCreate(BaseModel):
    codes: list[str] = Field(min_length=1)


class VehicleOp(BaseModel):
    lot_id: int
    plate: str = Field(min_length=1)
