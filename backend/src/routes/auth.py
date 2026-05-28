from src.app.Auth import AuthUser
from src.app.Responses import Responses
from tina4_python.core.router import post, middleware
from src.middleware.ApiKeyMiddleware import ApiKeyMiddleware
from src.middleware.AuthUserMiddleware import AuthUserMiddleware

@middleware(ApiKeyMiddleware)
@post('/api/auth/register')
async def register_user(request, response):
    """
    Register a new user
    :param request:
    :param response:
    :return:
    """
    return await AuthUser.register_user(request, response)

@middleware(ApiKeyMiddleware)
@post('/api/auth/login')
async def login_user(request, response):
    """
    Login a user
    :param request:
    :param response:
    :return:
    """
    return await AuthUser.login_user(request, response)

@middleware(ApiKeyMiddleware)
@post('/api/auth/forget-password')
async def forget_password(request, response):
    """
    Forget password
    :param request:
    :param response:
    :return:
    """
    return await AuthUser.forget_password(request, response)

@middleware(AuthUserMiddleware)
@post('/api/auth/logout')
async def logout(request, response):
    """
    Logout a user
    :param request:
    :param response:
    :return:
    """
    response.cookie("access-token", "", path="/", max_age=0, http_only=True, secure=False, same_site="Lax")
    
    return Responses.success_message(response, "Logged out successfully", {})