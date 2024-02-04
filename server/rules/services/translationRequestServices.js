const CreateTranslationRequestDTO = require('../../dtos/translationRequestDTO/createTranslationRequestDTO');
const GetTranslationRequestDTO = require('../../dtos/translationRequestDTO/getTranslactionRequestDTO');
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

  getAllTranslationRequests: async (req, res, next, db) =>{
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const offset = (page - 1) * limit;

      const getAllTranslationRequestsQuery = `
            SELECT * FROM TranslationRequest LIMIT ? OFFSET ? 
            `;

      await db.all(getAllTranslationRequestsQuery, [limit, offset], function(error, requests) {
        if (error) {
          console.error('erro no condicional do bd run: ' + error.message);
          next(new CustomError(error.message, 500));
        }
        // console.log("request ao bd: ", requests);
        if (!requests || requests.length === 0) {
          console.error('erro: sem requests disponíveis');
          next(new CustomError('No requests were found.', 404));
        } else {
          return res.status(200).json(requests);
        }
      });
    } catch (error) {
      console.error('Erro no catch -->' + error.message);
      next(error);
    }
  },

  getTranslationRequestById: async (req, res, next, db) => {
    try {
      const requestId = new GetTranslationRequestDTO(req.params.requestId);

      const isValidRequestId = utils.checkId(requestId.requestId);

      const getTranslationRequestByIdQuery = `
            SELECT * FROM TranslationRequest WHERE request_id      = ?
            `;
      if (!isValidRequestId) {
        console.error('erro na validação do request id - request id inválido');
        next(new CustomError('Invalid request Id.', 400));
      }

      await db.get(getTranslationRequestByIdQuery, [requestId.requestId], function(error, request) {
        if (error) {
          console.error('erro no condicional do get --> ' + error.message);
          next(new CustomError(error.message, 400));
        }

        if (!request) {
          console.error('erro no !request. Request não encontrado.');
          next(new CustomError('Request not found.', 404));
        } else {
          return res.status(200).json({request: request});
        }
      });
    } catch (error) {
      console.error('Erro no catch --> ' + error.message);
      next(CustomError(error.message, 500));
    }
  },
};


module.exports = translationRequestService;
