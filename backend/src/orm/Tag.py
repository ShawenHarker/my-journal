from tina4_python.orm import ORM, IntegerField, DateTimeField, StringField

class Tag(ORM):
    table_name = 'tags'

    id = IntegerField(primary_key=True, auto_increment=True)
    name = StringField(not_null=True)
    bg_color = StringField(not_null=True)
    text_color = StringField(not_null=True)
    created_at = DateTimeField()