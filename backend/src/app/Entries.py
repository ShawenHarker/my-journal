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
            day = current_date.strftime("%A")

            user_id = 5

            if not request.body.get("mood_id"):
                return Responses.error_message(response, "A mood is required", is_session_valid=True)

            if not request.body.get("title"):
                return Responses.error_message(response, "A title is required", is_session_valid=True)

            if not request.body.get("entry"):
                return Responses.error_message(response, "A journal entry is required", is_session_valid=True)

            entry = Entry()
            # entry.user_id = request.params["user"]["id"]
            entry.user_id = user_id
            entry.mood_id = request.body.get("mood_id")
            entry.title = request.body.get("title")
            entry.entry = request.body.get("entry")
            entry.day = day
            entry.draft = request.body.get("draft", False)
            result = entry.save()
            print("Save result:", result)
            print("Entry id:", entry.id)
            print("Entry data:", vars(entry))

            if request.body.get("tag_ids") and len(list(request.body.get("tag_ids"))) > 0:
                tag = EntryTag()
                for tag_id in request.body.get("tag_ids"):
                    tag.entry_id = entry.id
                    tag.tag_id = tag_id

            res = {
                "is_session_valid": True,
                "title": "",
                "entry": "",
                "mood": 0,
                "tag_ids": [],
            }

            if request.body.get("draft"):
                res = {
                    "is_session_valid": True,
                    "title": entry.title,
                    "entry": entry.entry,
                    "mood": entry.mood_id,
                    "tag_ids": request.body.get("tag_ids"),
                }

            return Responses.success_message(response, "New entry added", res)
        except Exception as e:
            Log.error(f"{type(e).__name__}: {str(e)}")

            return Responses.error_message(response, f"{type(e).__name__}: {str(e)}", is_session_valid=True)