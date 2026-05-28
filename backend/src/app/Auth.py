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
        try:
            is_session_valid = False
            request.body["email"] = request.body["email"].lower()
            email_address_users = User().select("SELECT * FROM users WHERE email = ?", [request.body["email"]])

            if email_address_users:
                return Responses.error_message(response, "User already exists")
        except Exception as e:
            Log.error(f"{type(e).__name__}: {str(e)}")

            return Responses.error_message(response, f"{type(e).__name__}: {str(e)}")

        request.body["password"] = Auth.hash_password(request.body["password"])

        try:
            user = User()
            user.first_name = request.body["first_name"]
            user.last_name = request.body["last_name"]
            user.email = request.body["email"]
            user.mobile = request.body["mobile"]
            user.password = request.body["password"]
            user.save()
        except Exception as e:
            Log.error(f"{type(e).__name__}: {str(e)}")

            return Responses.error_message(response, f"{type(e).__name__}: {str(e)}")


        access_token = Auth.get_token({"id": user.id}, 240)
        response.cookie("access-token", access_token, path="/", max_age=3600, http_only=True, secure=False, same_site="Lax")

        is_session_valid = True

        res = {
            "is_session_valid": is_session_valid,
            "user": {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "current_streak": user.current_streak,
                "seven_day_streak": user.seven_day_streak
            },
        }

        return Responses.success_message(response, "User registered successfully", res)

    @staticmethod
    async def login_user(request, response):
        """
        Login a user
        :param request:
        :param response:
        :return:
        """
        try:
            is_session_valid = False
            request.body["email"] = request.body["email"].lower()
            users = User().select("SELECT * FROM users WHERE email = ?", [request.body["email"]])

            if not users:
                return Responses.error_message(response, "User not found")

            user = users[0]

            if not Auth.check_password(request.body["password"], user.password):
                return Responses.error_message(response, "Invalid email or password")

            access_token = Auth.get_token({"id": user.id}, 60)
            response.cookie("access-token", access_token, path="/", max_age=3600, http_only=True, secure=False, same_site="Lax")

            is_session_valid = True

            res = {
                "is_session_valid": is_session_valid,
                "user": {
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "current_streak": user.current_streak,
                    "seven_day_streak": user.seven_day_streak
                },
            }

            return Responses.success_message(response, "User logged in successfully", res)
        except Exception as e:
            Log.error(f"{type(e).__name__}: {str(e)}")

            return Responses.error_message(response, f"{type(e).__name__}: {str(e)}")

    @staticmethod
    async def forget_password(request, response):
        """
        Forget password
        :param request:
        :param response:
        :return:
        """
        try:
            request.body["email"] = request.body["email"].lower()
            users = User().select("SELECT * FROM users WHERE email = ?", [request.body["email"]])

            if not users:
                return Responses.error_message(response, "User not found")

            user = users[0]

            user_password = Auth.hash_password(request.body["password"])

            user.password = user_password
            user.save()

            return Responses.success_message(response, "Password reset successfully")
        except Exception as e:
            Log.error(f"{type(e).__name__}: {str(e)}")

            return Responses.error_message(response, f"{type(e).__name__}: {str(e)}")