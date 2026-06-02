from datetime import datetime
from src.orm.Entry import Entry
from tina4_python.debug import Log
from src.orm.EntryTag import EntryTag
from src.app.Responses import Responses

class NewEntries:
    @staticmethod
    async def add_new_entry(request, response):
        """
        This function adds a new entry to the database.
        :param request:
        :param response:
        :return:
        """
        try:
            current_date = datetime.now()
            day = current_date.day

            entry = Entry()
            entry.user_id = request.params["user"]["id"]
            entry.mood_id = request.body.get("mood_id")
            entry.title = request.body.get("title")
            entry.entry = request.body.get("entry")
            entry.day = day
            entry.draft = request.body.get("draft")
            entry.save()

            if len(list(request.body.get("tags"))) > 0:
                tag = EntryTag()
                for tag_id in request.body.get("tags"):
                    tag.entry_id = entry.id
                    tag.tag_id = tag_id

            res = {}

            if request.body.get("draft"):
                res = {
                    "title": entry.title,
                    "entry": entry.entry,
                    "mood": entry.mood_id,
                    "tags": request.body.get("tags"),
                }

            return Responses.success_message(response, "New entry added", res)
        except Exception as e:
            Log.error(f"{type(e).__name__}: {str(e)}")

            return Responses.error_message(response, f"{type(e).__name__}: {str(e)}")