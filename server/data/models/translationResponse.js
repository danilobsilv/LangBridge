export default class TranslationResponse{
      constructor(translated_text, confidence_level, additional_info) {
            this.translated_text = translated_text;
            this.confidence_level = confidence_level;
            this.additional_info = additional_info;
      }
}