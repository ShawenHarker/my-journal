from tina4_python.core.router import post, middleware
from src.middleware.AuthUserMiddleware import AuthUserMiddleware
from src.app.Entries import NewEntries

@middleware(AuthUserMiddleware)
@post('/api/entries/new-entry')
async def new_entry(request, response):
    """
    This function is called when a new entry is created.
    :param request:
    :param response:
    :return:
    """
    return await NewEntries.add_new_entry(request, response)