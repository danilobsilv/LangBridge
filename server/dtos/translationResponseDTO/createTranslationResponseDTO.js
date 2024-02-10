class CreateTranslationResponseDTO{
      constructor(requestId, translatedText, confidenceLevel, addInfo){
            this.requestId = requestId;
            this.translatedText = translatedText;
            this.confidenceLevel = confidenceLevel;
            this.addInfo = addInfo;
      }
}

module.exports = CreateTranslationResponseDTO;