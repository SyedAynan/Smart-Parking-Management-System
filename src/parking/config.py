"""Runtime configuration from environment, with sane defaults."""

import os


def _get_float(name: str, default: float) -> float:
    try:
        return float(os.getenv(name, default))
    except (TypeError, ValueError):
        return default


def _get_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, default))
    except (TypeError, ValueError):
        return default


DB_PATH = os.getenv("PARKING_DB_PATH", "parking.db")
DEFAULT_HOURLY_RATE = _get_float("PARKING_DEFAULT_HOURLY_RATE", 50.0)
GRACE_MINUTES = _get_int("PARKING_GRACE_MINUTES", 15)
