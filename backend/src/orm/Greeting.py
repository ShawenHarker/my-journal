from tina4_python.orm import ORM, IntegerField, DateTimeField, StringField

class Greeting(ORM):
    table_name = 'greetings'

    id = IntegerField(primary_key=True, autoincrement=True)
    time_of_day = StringField(not_null=True)
    greeting = StringField(not_null=True)
    created_at = DateTimeField()



