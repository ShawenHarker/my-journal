from tina4_python.orm import ORM, IntegerField, DateTimeField
from src.orm.Entry import Entry
from src.orm.Tag import Tag

class EntryTag(ORM):
    table_name = 'entry_tags'

    id = IntegerField(primary_key=True, autoincrement=True)
    entry_id = IntegerField(to=Entry.id, not_null=True)
    tag_id = IntegerField(to=Tag.id, not_null=True)
    created_at = DateTimeField()
    updated_at = DateTimeField()