from test.user_test.user_request_test import UserRequestTests
from test.text_test.text_request_test import TextRequestTests
from test.translation_request_test.translation_request_test import TranslationRequestTest
from test.translation_response_test.translation_response_test import TranslationResponseTest

from random import randint

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
      

      Translation Requests
      
      userId = randint(1,100)
      textId = randint(1,100)

      post_translation_request_endpoint = f"http://localhost:3000/api/translationrequest/{userId}/{textId}"

      get_all_translation_request_endpoint = "http://localhost:3000/api/translationrequest"

      get_translation_request_by_id_endpoint = f"http://localhost:3000/api/translationrequest/{textId}"

      trrt = TranslationRequestTest(post_translation_request_endpoint, get_all_translation_request_endpoint, get_translation_request_by_id_endpoint)

      post_response = trrt.send_post_request(trrt.post_endpoint, "server/test/translation_request_test/post_translation_request.json")
      get_all_response = trrt.send_get_request(trrt.get_endpoint)
      get_request_by_id = trrt.send_get_request(trrt.get_by_id_endpoint)

      trrt.interpret_response(get_request_by_id) 
      
      
      # Translation Responses

      requestId = randint(0,100)
      
      post_translation_response_endpoint = f"http://localhost:3000/api/translationresponse/{requestId}"

      get_all_translation_response_endpoint = "http://localhost:3000/api/translationresponse"

      get_translation_response_by_id = f"http://localhost:3000/api/translationresponse/{26}"

      trr = TranslationResponseTest(post_translation_response_endpoint, get_all_translation_response_endpoint, get_translation_response_by_id)

      post_response = trr.send_post_request(trr.post_endpoint, "server/test/translation_response_test/post_translation_response.json")
      get_all_response = trr.send_get_request(trr.get_endpoint)
      get_by_id_response = trr.send_get_request(trr.get_by_id_endpoint)

      trr.interpret_response(get_by_id_response)
      
      """