from src.app.Auth import AuthUser
from tina4_python.core.router import post, middleware
from src.middleware.ApiKeyMiddleware import ApiKeyMiddleware

@middleware(ApiKeyMiddleware)
@post("/api/auth/register")
async def register_user(request, response):
    """
    Register a new user
    :param request:
    :param response:
    :return:
    """
    return await AuthUser.register_user(request, response)

@post("/api/auth/login")
async def login_user(request, response):
    """
    Login a user
    :param request:
    :param response:
    :return:
    """
    return await AuthUser.login_user(request, response)