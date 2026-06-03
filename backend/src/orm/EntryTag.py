from tina4_python.orm import ORM, IntegerField, DateTimeField

class EntryTag(ORM):
    table_name = 'entry_tags'

    id = IntegerField(primary_key=True, auto_increment=True)
    entry_id = IntegerField(required=True)
    tag_id = IntegerField(required=True)
    created_at = DateTimeField()
    updated_at = DateTimeField()