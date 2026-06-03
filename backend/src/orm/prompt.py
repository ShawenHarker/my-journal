from tina4_python.orm import ORM, IntegerField, DateTimeField, StringField

class Prompt(ORM):
    table_name = 'prompts'

    id = IntegerField(primary_key=True, auto_increment=True)
    prompt = StringField(required=True)
    created_at = DateTimeField()