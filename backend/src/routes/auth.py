from src.app.Auth import AuthUser
from tina4_python.core.router import post, middleware
from src.middleware.ApiKeyMiddleware import ApiKeyMiddleware

@middleware(ApiKeyMiddleware)
@post('/api/auth/registe')
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