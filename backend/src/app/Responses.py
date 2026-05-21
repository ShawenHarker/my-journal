from tina4_python.core.response import Response

class Responses:
    @staticmethod
    def error_message(response, notification = ""):
        """
        This response handles the error message to the portal.
        :param notification:
        :param response:
        :return:
        """
        if notification == "":
            notification = "An unexpected error occurred"

        if notification == "":
            notification = notification

        res = {
            'status': 'Error',
            'notification': notification,
            'info': {}
        }

        Response.http_code = 403

        return response(res)

    @staticmethod
    def unauthorized_message(response):
        """
        This response handles the unauthorized message to the portal.
        :return:
        """

        res = {
            'status': 'Unauthorized',
            'notification': 'Unauthorized: You are not unauthorized to perform this action.',
            'info': {}
        }

        Response.http_code = 401

        return response(res)

    @staticmethod
    def success_message(response, notification = "", data = None):
        """
        This message handles successful data retrival.
        :param notification:
        :param data:
        :param response:
        :return:
        """
        if notification == "":
            notification = "Successful"

        if data is None:
            data = {}

        res = {
            'status': 'Successful',
            'notification': notification,
            'info': data
        }

        Response.http_code = 200

        return response(res)
