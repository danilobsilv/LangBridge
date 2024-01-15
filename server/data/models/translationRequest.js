export default class TranslationRequest{
      constructor(user_id, text_id, source_language_id, target_language_id, request_date) {
            this.user_id = user_id;
            this.text_id = text_id;
            this.source_language_id = source_language_id;
            this.target_language_id = target_language_id;
            this.request_date = request_date;
      }
}