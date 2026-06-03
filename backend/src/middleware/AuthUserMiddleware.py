from src.orm.User import User
from tina4_python.auth import Auth
from tina4_python.debug import Log
from src.app.Responses import Responses
from tina4_python.core.middleware import Middleware


class AuthUserMiddleware(Middleware):
    """
    This middleware is used to check if the user is authenticated and return the user object
    """
    @staticmethod
    def before_auth(request, response):
        try:
            access_token = request.cookies.get("access-token")

            if not access_token or not Auth.valid_token(access_token):
                return request, Responses.unauthorized_message(response)

            payload = Auth.get_payload(access_token)

            if not payload or "id" not in payload:
                return request, Responses.unauthorized_message(response)

            users = User().select("SELECT * FROM users WHERE id = ?", [payload["id"]])

            if not users:
                return request, Responses.unauthorized_message(response)

            request.params["user"] = users[0]
            request.params["is_session_valid"] = True

            return request, response
        except Exception as e:
            Log.error(f"{type(e).__name__}: {str(e)}")
            return request, Responses.error_message(response, f"{type(e).__name__}: {str(e)}")