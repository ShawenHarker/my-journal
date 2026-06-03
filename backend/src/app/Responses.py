class Responses:
    @staticmethod
    def error_message(response, notification="", is_session_valid=False, http_code=400):
        if notification == "":
            notification = "An unexpected error occurred"
        res = {
            'status': 'Error',
            'notification': notification,
            'info': {
                'is_session_valid': is_session_valid
            }
        }
        return response(res, http_code)

    @staticmethod
    def unauthorized_message(response):
        res = {
            'status': 'Unauthorized',
            'notification': 'Unauthorized: You are not authorized to perform this action.',
            'info': {
                'is_session_valid': False
            }
        }
        return response(res, 401)

    @staticmethod
    def success_message(response, notification="", data=None):
        if notification == "":
            notification = "Successful"
        if data is None:
            data = {}
        res = {
            'status': 'Successful',
            'notification': notification,
            'info': data
        }
        return response(res, 200)