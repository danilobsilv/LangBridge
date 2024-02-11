const translationResponseService = require("../services/translationResponseServices");

const translationRequestController = {
      createTranslationResponse: translationResponseService.createTranslationResponse,
      getAllTranslationResponses: translationResponseService.getAllTranslationResponses,
      getTranslationResponseById: translationResponseService.getTranslationResponseBy
}

module.exports = translationRequestController;