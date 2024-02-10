const translationRequestService = require('../services/translationRequestServices');

const translationRequestController = {
      createTranslationRequest: translationRequestService.createTranslationRequest,
      getAllTranslationRequests: translationRequestService.getAllTranslationRequests,
      getTranslationRequestById: translationRequestService.getTranslationRequestById
}

module.exports = translationRequestController;