from tina4_python.orm import ORM, IntegerField, DateTimeField, StringField

class Tag(ORM):
    table_name = 'tags'

    id = IntegerField(primary_key=True, auto_increment=True)
    name = StringField(required=True)
    bg_color = StringField(required=True)
    text_color = StringField(required=True)
    created_at = DateTimeField()