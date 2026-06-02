from tina4_python.orm import ORM, IntegerField, StringField, DateTimeField, BoolField

class Entry(ORM):
    table_name = 'entries'

    id = IntegerField(primary_key=True, auto_increment=True)
    user_id = IntegerField(not_null=True)
    mood_id = IntegerField(not_null=True)
    title = StringField(not_null=True)
    entry = StringField(not_null=True)
    day = StringField(not_null=True)
    draft = BoolField(default=False)
    created_at = DateTimeField()
    updated_at = DateTimeField()