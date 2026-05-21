import sys
from tina4_python.core import run

print("Running the web server...", sys.argv)

default_port = 8282

if len(sys.argv) > 2:
    default_port = int(sys.argv[2])

run("localhost", default_port)
