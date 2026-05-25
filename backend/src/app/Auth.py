from src.orm.User import User
from tina4_python.auth import Auth
from tina4_python.debug import Log
from src.app.Responses import Responses


class AuthUser:
    @staticmethod
    async def register_user(request, response):
        """
        Register a new user
        :param request:
        :param response:
        :return:
        """
        request.body["email"] = request.body["email"].lower()

        try:
            email_address_users = User().select("SELECT * FROM users WHERE email = ?", [request.body["email"]])

            if email_address_users:
                return Responses.error_message(response, "Email already exists")
        except Exception as e:
            Log.error(f"{type(e).__name__}: {str(e)}")

            return Responses.error_message(response, f"{type(e).__name__}: {str(e)}")

        request.body["password"] = Auth.hash_password(request.body["password"])

        try:
            user = User()
            user.first_name = request.body["first_name"]
            user.last_name = request.body["last_name"]
            user.email = request.body["email"]
            user.password = request.body["password"]
            user.save()
        except Exception as e:
            Log.error(f"{type(e).__name__}: {str(e)}")

            return Responses.error_message(response, f"{type(e).__name__}: {str(e)}")

        user_id = user.id
        accessToken = Auth.get_token({"id": user_id})

        res = {
            "user": {
                "id": user_id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "current_streak": user.current_streak,
                "seven_day_streak": user.seven_day_streak
            },
            "accessToken": accessToken
        }

        return Responses.success_message(response, "User registered successfully", res)