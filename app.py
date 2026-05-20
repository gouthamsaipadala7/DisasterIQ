"""
DisasterIQ — Hugging Face Spaces Entry Point
This file is the entry point when deployed to HF Spaces.
It serves the pre-built React frontend via the FastAPI backend.
"""

import os
import sys

# ─── Start backend ──────────────────────────────────────────────
backend_dir = os.path.join(os.path.dirname(__file__), "backend")
sys.path.insert(0, backend_dir)

from backend.main import app  # noqa: E402

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)

