const translationRequestService = require('../services/translationRequestServices');

const translationRequestController = {
      createTranslationRequest: translationRequestService.createTranslationRequest
}

module.exports = translationRequestController;