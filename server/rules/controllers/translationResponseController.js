const translationResponseService = require("../services/translation/translationResponseServices");

const translationRequestController = {
      createTranslationResponse: translationResponseService.createTranslationResponse,
      getAllTranslationResponses: translationResponseService.getAllTranslationResponses,
      getTranslationResponseById: translationResponseService.getTranslationResponseBy
}

module.exports = translationRequestController;