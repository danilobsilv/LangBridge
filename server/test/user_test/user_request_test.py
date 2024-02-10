from test.test import Test

class UserRequestTests(Test):

      def __init__(self, post_endpoint=None, get_endpoint=None, get_by_id_endpoint=None, put_endpoint=None, delete_endpoint=None, param_id=None):
            super().__init__(post_endpoint, get_endpoint, get_by_id_endpoint,put_endpoint, delete_endpoint)
            self.param_id = None