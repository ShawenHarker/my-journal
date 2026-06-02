from tina4_python.orm import ORM, IntegerField, DateTimeField, StringField

class Mood(ORM):
    table_name = 'moods'

    id = IntegerField(primary_key=True, autoincrement=True)
    name = StringField(not_null=True)
    emoji = StringField(not_null=True)
    bg_color = StringField(not_null=True)
    text_color = StringField(not_null=True)
    created_at = DateTimeField()