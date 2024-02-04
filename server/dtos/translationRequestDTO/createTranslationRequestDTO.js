class CreateTranslationRequestDTO {
      constructor(userId, textId, sourceLanguage, targetLanguage, requestDate, translationTone){
            this.userId = userId;
            this.textId = textId;
            this.sourceLanguage = sourceLanguage
            this.targetLanguage = targetLanguage
            this.requestDate = requestDate
            this.translationTone = translationTone
      }
}

module.exports = CreateTranslationRequestDTO;