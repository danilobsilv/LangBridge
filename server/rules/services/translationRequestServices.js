const CreateTranslationRequestDTO = require('../../dtos/translationRequestDTO/createTranslationRequestDTO');
const utils = require('../utils/utils');
const {CustomError} = require('../../middleware/errorHandler');

const validateParams = (params) => {
  const requiredFields = ['userId', 'textId', 'sourceLanguage', 'targetLanguage', 'requestDate', 'translationTone'];

  return requiredFields.every((field) => params[field] !== undefined && params[field] !== '');
};


const translationRequestService = {
  createTranslationRequest: async (req, res, next, db)=>{
    try {
      const requestDTO = new CreateTranslationRequestDTO(
          req.params.userId,
          req.params.textId,
          req.body.sourceLanguage,
          req.body.targetLanguage,
          req.body.requestDate,
          req.body.translationTone,
      );

      const isValidParams = validateParams(requestDTO);
      const isValidUserId = utils.checkId(requestDTO.userId);
      const isValidTextId = utils.checkId(requestDTO.textId);

      if (!isValidParams) {
        console.error('erro no isValidParams');
        throw new CustomError('Missing required params.', 400);
      }

      if (!isValidUserId) {
        console.error('erro no isValidUserId');
        throw new CustomError('Invalid user ID', 400);
      }

      if (!isValidTextId) {
        console.error('erro no isValidTextId');
        throw new CustomError('Invalid text ID', 400);
      }

      const createTranslationRequestQuery = `
                        INSERT INTO TranslationRequest (user_id, text_id, source_language_id, target_language_id, request_date, translation_tone) 
                        VALUES (?, ?, ?, ?, ?, ?)
                  `;

      const params = [
        requestDTO.userId,
        requestDTO.textId,
        requestDTO.sourceLanguage,
        requestDTO.targetLanguage,
        requestDTO.requestDate,
        requestDTO.translationTone,
      ];


      await db.run(createTranslationRequestQuery, params, function(error) {
        if (error) {
          console.error('Error no condicional do db run --> ' + error.message);
          throw new CustomError(error.message, 500);
        }

        return res.status(200).json({});
      });
    } catch (error) {
      console.error('Erro no catch --> ' + error.message);
      next(error);
    }
  },
};


module.exports = translationRequestService;
