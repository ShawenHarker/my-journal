from tina4_python.dotenv import load_env, get_env
from tina4_python.database.connection import Database
from tina4_python.migration import Migration

load_env()

db = Database(get_env("TINA4_DATABASE_URL"))

Migration(db).migrate()