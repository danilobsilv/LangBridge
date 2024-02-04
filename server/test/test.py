import requests
import json

class Test:

      def __init__(self, post_endpoint=None, get_endpoint=None, get_by_id_endpoint=None, put_endpoint=None, delete_endpoint=None):
            self._post_endpoint = post_endpoint
            self._get_endpoint = get_endpoint
            self._get_by_id_endpoint = get_by_id_endpoint
            self._put_endpoint = put_endpoint
            self._delete_endpoint = delete_endpoint

      @property
      def post_endpoint(self):
            return self._post_endpoint

      @post_endpoint.setter
      def post_endpoint(self, value):
            self._post_endpoint = value

      @property
      def get_endpoint(self):
            return self._get_endpoint

      @get_endpoint.setter
      def get_endpoint(self, value):
            self._get_endpoint = value

      @property
      def get_by_id_endpoint(self):
            return self._get_by_id_endpoint
      
      @get_by_id_endpoint.setter
      def get_by_id_endpoint(self, value):
            self._get_by_id_endpoint = value

      @property
      def put_endpoint(self):
            return self._put_endpoint

      @put_endpoint.setter
      def put_endpoint(self, value):
            self._put_endpoint = value

      @property
      def delete_endpoint(self):
            return self._delete_endpoint

      @delete_endpoint.setter
      def delete_endpoint(self, value):
            self._delete_endpoint = value

      @staticmethod
      def send_get_request(endpoint:str):
            url = endpoint
            response = requests.get(url, verify=False)
            return response
      
      @staticmethod
      def send_post_request(endpoint:str, json_file_path:str):
            url = endpoint

            with open(json_file_path, "r") as json_file:
                  json_content = json.load(json_file)

            response = requests.post(url, json=json_content, verify=False)
            return response
      
      @staticmethod
      def send_put_request(endpoint:str, json_file_path:str):
            url = endpoint

            with open(json_file_path, "r") as json_file:
                  json_content = json.load(json_file)

            response = requests.put(url, json=json_content, verify=False)
            return response     
      

      @staticmethod
      def send_delete_request(endpoint):
            url = endpoint
            response = requests.delete(url, verify=False)
            return response
      

      @staticmethod
      def interpret_response(response):
            json_content = response.json()
            formatted_json = json.dumps(json_content, indent=2)
            print(formatted_json)
