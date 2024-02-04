from test.user_test.user_request_test import UserRequestTests
from test.text_test.text_request_test import TextRequestTests

if __name__ == "__main__":
      
      """
      text requests 
      trt = TextRequestTests("http://localhost:3000/api/text/2/20", "http://localhost:3000/api/text", "http://localhost:3000/api/text/11")

      post_text_request = trt.send_post_request(trt.post_endpoint, "server/test/text_test/post_text.json")
      get_text_request = trt.send_get_request(trt.get_endpoint)
      get_text_by_id_request = trt.get_by_id_endpoint(trt.get_by_id_endpoint)
      trt.interpret_response(get_text_by_id_request)
      


      User Requests 
      urt = UserRequestTests("http://localhost:3000/api/user", "http://localhost:3000/api/user", f"http://localhost:3000/api/user/6", f"http://localhost:3000/api/user/15", f"http://localhost:3000/api/user/15")

      post_response = urt.send_post_request(urt.post_endpoint, "server/test/user_test/post_user.json")
      get_user_by_id_request =   urt.send_get_request(urt.get_by_id_endpoint)
      get_request = urt.send_get_request(urt.get_endpoint)
      put_request = urt.send_put_request(urt.put_endpoint, "server/test/user_test/post_user.json")
      delete_request = urt.send_delete_request(urt.delete_endpoint)
      urt.interpret_response(put_request)
      """