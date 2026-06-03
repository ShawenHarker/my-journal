from tina4_python.orm import ORM, IntegerField, DateTimeField, StringField

class Greeting(ORM):
    table_name = 'greetings'

    id = IntegerField(primary_key=True, auto_increment=True)
    time_of_day = StringField(required=True)
    greeting = StringField(required=True)
    created_at = DateTimeField()



