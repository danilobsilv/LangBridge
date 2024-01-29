class CreateTextDTO {
      constructor(userId, translationRequestId, content) {
        this.userId = userId;
        this.translationRequestId = translationRequestId;
        this.content = content;
      }
    }
    
    module.exports = CreateTextDTO;
    