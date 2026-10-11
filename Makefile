.PHONY: dev run test lint clean

dev run:
	uvicorn parking.main:app --reload --port $${PORT:-8000}

test:
	pytest -q

lint:
	ruff check src tests || python -m py_compile $$(find src -name "*.py")

clean:
	rm -rf __pycache__ .pytest_cache .ruff_cache
	find src tests -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
