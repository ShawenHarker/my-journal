from tina4_python.debug import Log
from src.app.Responses import Responses
from tina4_python.dotenv import get_env
from tina4_python.core.middleware import Middleware

class ApiKeyMiddleware(Middleware):
    """
    This middleware checks if the API key is valid.
    """
    @staticmethod
    def before_api_key(request, response):
        try:
            api_key = request.headers.get("authorization") or request.headers.get("authorization")

            bearer = f"Bearer {get_env("TINA4_API_KEY")}"

            if api_key != bearer:
                return request, Responses.unauthorized_message(response)

            return request, response
        except Exception as e:
            Log.error(f"{type(e).__name__}: {str(e)}")

            return request, Responses.error_message(response, f"{type(e).__name__}: {str(e)}")