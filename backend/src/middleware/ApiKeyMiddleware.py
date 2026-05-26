from tina4_python.debug import Log
from src.app.Responses import Responses
from tina4_python.dotenv import get_env
from tina4_python.core.middleware import Middleware

class ApiKeyMiddleware(Middleware):
    """
    This middleware checks if the API key is valid.
    """
    def process(self, request, response, next):
        try:
            api_key = request.headers.get("X-API-Key") or request.headers.get("x-api-key")

            if api_key != get_env("TINA4_API_KEY"):
                return Responses.unauthorized_message(response)

            return next(request, response)
        except Exception as e:
            Log.error(f"{type(e).__name__}: {str(e)}")

            return Responses.error_message(response, f"{type(e).__name__}: {str(e)}")