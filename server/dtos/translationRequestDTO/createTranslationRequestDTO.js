class CreateTranslationRequestDTO {
      constructor(user_id, translation_content, source_language_id, target_language_id, request_date, translation_tone) {
            this.user_id = user_id,
            this.translation_content = translation_content,
            this.source_language_id = source_language_id,
            this.target_language_id = target_language_id,
            this.request_date = request_date,
            this.translation_tone = translation_tone
      }
}

module.exports = CreateTranslationRequestDTO;