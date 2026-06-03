from tina4_python.orm import ORM, IntegerField, StringField, DateTimeField, BoolField

class Entry(ORM):
    table_name = 'entries'

    id = IntegerField(primary_key=True, auto_increment=True)
    user_id = IntegerField(required=True)
    mood_id = IntegerField(required=True)
    title = StringField(required=True)
    entry = StringField(required=True)
    day = StringField(required=True)
    draft = BoolField(default=False)
    created_at = DateTimeField()
    updated_at = DateTimeField()