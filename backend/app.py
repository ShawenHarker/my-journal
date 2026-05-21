import sys
from tina4_python.core import run
from tina4_python.core.router import _routes

print("Routes before run:", _routes)

default_port = 8282

if len(sys.argv) > 2:
    default_port = int(sys.argv[2])

run("localhost", default_port)

print("Routes after run:", _routes)