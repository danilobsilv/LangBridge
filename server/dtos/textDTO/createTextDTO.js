class CreateTextDTO {
      constructor(translatedText, requestId, userId) {
        this.translatedText = translatedText;
        this.requestId = requestId;
        this.userId = userId;
      }
    }
    
    module.exports = CreateTextDTO;
    