from tina4_python.orm import ORM, IntegerField, StringField, DateTimeField

class User(ORM):
    table_name = "users"

    id = IntegerField(primary_key=True, auto_increment=True)
    first_name = StringField(required=True)
    last_name = StringField(required=True)
    email = StringField(required=True)
    mobile = IntegerField(default=None)
    password = StringField(required=True)
    current_streak = IntegerField(default=0)
    created_at = DateTimeField()
    updated_at = DateTimeField()