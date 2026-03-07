"""
Vercel ASGI entrypoint for Devise Dashboard backend.
Mangum wraps the FastAPI app so Vercel's Lambda runtime can handle HTTP requests.
"""

import sys
import os

# Make the backend package importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from backend.server import app  # noqa: F401
from mangum import Mangum

handler = Mangum(app)
