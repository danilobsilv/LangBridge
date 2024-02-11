from test.test import Test

class TranslationResponseTest(Test):
      def __init__(self, post_endpoint=None, get_endpoint=None, get_by_id_endpoint=None, put_endpoint=None, delete_endpoint=None):
            super().__init__(post_endpoint, get_endpoint, get_by_id_endpoint, put_endpoint, delete_endpoint)

      @staticmethod
      def send_put_request():
            return
      
      @staticmethod
      def send_delete_request(endpoint):
            return