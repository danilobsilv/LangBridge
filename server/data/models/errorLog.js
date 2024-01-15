export default class ErrorLog{
      constructor(request_id, error_message, timestamp) {
            this.request_id = request_id;
            this.error_message = error_message;
            this.timestamp = timestamp;
      }
}