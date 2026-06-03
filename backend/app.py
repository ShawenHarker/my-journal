import sys
import os

# Load .env before any tina4 imports
os.environ["TINA4_CORS_ORIGINS"] = "http://localhost:3000"
os.environ["TINA4_CORS_CREDENTIALS"] = "true"
os.environ["TINA4_CORS_METHODS"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
os.environ["TINA4_CORS_HEADERS"] = "Content-Type,Authorization,X-Request-ID"
os.environ["TINA4_CORS_MAX_AGE"] = "86400"

from tina4_python.dotenv import load_env
load_env()

from tina4_python.core import run
from tina4_python.core.router import _routes

print('Routes before run:', _routes)

default_port = 8282

if len(sys.argv) > 2:
    default_port = int(sys.argv[2])

run('localhost', default_port)