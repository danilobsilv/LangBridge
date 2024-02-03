const CreateTextDTO = require('../../dtos/textDTO/createTextDTO');
const getTextDTO = require('../../dtos/textDTO/getTextDTO');
const utils = require('../utils/utils');
const {CustomError} = require('../../middleware/errorHandler');

const validateParams = (params) => {
  const requiredFields = ['userId', 'translationRequestId', 'content'];
  return requiredFields.every((field) => params[field] !== undefined && params[field] !== '');
};


const textServices = {
  createText: async (req, res, db, next) => {
    try {
      const userId = req.params.userId;
      const translationRequestId = req.params.translationRequestId;
      const content = req.body.content;
      const maxTextLength = 600;

      const textDTO = new CreateTextDTO(userId, translationRequestId, content);

      const isValidParams = validateParams(textDTO);
      const isValidUserId = utils.checkId(userId);

      if (!isValidParams) {
        throw new CustomError('Missing required parameters', 400);
      }

      if (!isValidUserId) {
        throw new CustomError('Invalid UserId', 400);
      }

      if ((textDTO.content).length > maxTextLength) {
        throw new CustomError('Too many characters', 400);
      }
      console.log((textDTO.content).length);
      const insertQuery = `
                INSERT INTO Text (user_id, translationRequest_id, content) VALUES (?, ?, ?)
              `;

      const params = [
        textDTO.userId,
        textDTO.translationRequestId,
        textDTO.content,
      ];

      await db.run(insertQuery, params, function(error) {
        if (error) {
          throw new CustomError('Error saving text content', 500);
        }

        return res.status(201).json({});
      });
    } catch (error) {
      next(error);
    }
  },

  getAllText: async (req, res, db, next) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const offset = (page - 1) * limit;

      const getAllTextQuery = `
      SELECT * FROM Text LIMIT ? OFFSET ?
      `;

      await db.all(getAllTextQuery, [limit, offset], function(error, texts) {
        if (error) {
          console.error('erro no condicional do db all ' + error.message);
          throw new CustomError(error.message, 500);
        }
        if (!texts || texts.length === 0) {
          console.error('erro: sem textos disponíveis');
          throw new CustomError('No texts found.', 200, []);
        }

        return res.status(200).json(texts);
      },


      );
    } catch (error) {
      console.error('erro catch : ' + error.message);
      next(error);
    }
  },

  getTextById: async (req, res, db, next) => {
    try {
      const textId = new getTextDTO(req.params.textId);

      const getTextByIdQuery = `
      SELECT * FROM Text WHERE text_id = ?
      `;
      const isValidTextId = utils.checkId(textId.textId); 
      if (!isValidTextId) {
        console.error('verificação do isValidText --> Id texto inválida.');
        throw new CustomError('Invalid text id', 400);
      }

      await db.get(getTextByIdQuery, [textId.textId], function(error, text) {
        if (error) {
          console.error('Erro no db get: ' + error.message);
          throw new CustomError(error.message, 400);
        }

        if (!text) {
          console.error('erro no !text: ' + error.message);
          throw new CustomError('Text not found.', 404);
        }

        return res.status(200).json({text: text});
      });
    } catch (error) {
      console.error('Error no catch: ' + error.message);
      next(error);
    }
  },

};

module.exports = textServices;
