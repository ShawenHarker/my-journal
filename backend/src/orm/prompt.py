from tina4_python.orm import ORM, IntegerField, DateTimeField, StringField

class Prompt(ORM):
    table_name = 'prompts'

    id = IntegerField(primary_key=True, autoincrement=True)
    prompt = StringField(not_null=True)
    created_at = DateTimeField()