from tina4_python.orm import ORM, IntegerField, StringField, DateTimeField

class User(ORM):
    table_name = "users"

    id = IntegerField(primary_key=True, auto_increment=True)
    first_name = StringField()
    last_name = StringField()
    email = StringField()
    password = StringField()
    current_streak = IntegerField(default=0)
    seven_day_streak = IntegerField(default=0)
    created_at = DateTimeField()