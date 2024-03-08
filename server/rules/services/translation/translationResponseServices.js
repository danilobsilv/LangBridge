const CreateTranslationResponseDTO = require("../../../dtos/translationResponseDTO/createTranslationResponseDTO");
const GetTranslationResponseDTO = require("../../../dtos/translationResponseDTO/getTranslationResponseDTO");
const utils = require("../../utils/utils");
const {CustomError} = require("../../../middleware/errorHandler");

const validateParams = (params) => {
      const requiredFields = ["requestId","translatedText", "confidenceLevel", "addInfo"];
      
      return requiredFields.every((field) => params[field] !== undefined && params[field] !== '');
};

const translationResponseServices = {
      createTranslationResponse: async(req, res, next, db)=>{
            try {
                  const responseDTO = new CreateTranslationResponseDTO(
                        req.params.requestId,
                        req.body.translatedText,
                        req.body.confidenceLevel,
                        req.body.addInfo
                  )
                  
                  const createTranslationRequestQuery = `
                  INSERT INTO TranslationResponse (request_id, translated_text, confidence_level, additional_info)
                  VALUES (?, ?, ?, ?)
                  `
                  const isValidParams = validateParams(responseDTO);
                  const isValidRequestId = utils.checkId(responseDTO.requestId);

                  if (!isValidParams){
                        console.error("erro no is valid params");
                        next(new CustomError("Missing required parameters", 400));
                        return;
                  }

                  if (!isValidRequestId){
                        console.error("erro no is valid request id");
                        next(new CustomError("Invalid request id: " + responseDTO.requestId, 400));
                        return;
                  }

                  const params = [
                        responseDTO.requestId,
                        responseDTO.translatedText,
                        responseDTO.confidenceLevel,
                        responseDTO.addInfo
                  ];

                  await db.run(createTranslationRequestQuery, params, function(error){
                        if (error){
                              console.error("erro no condicional do db run");
                              next(new CustomError(error.message, 500));
                              return;
                        }
                        else{
                              return res.status(201).json({});    
                        }
                  })


            } catch (error) {
                  console.error("erro no catch --> " + error.message);
                  next(new CustomError(error.message, 500));
            }
      },
      getAllTranslationResponses: async(req, res, next, db) =>{
            try {
                  const page = req.query.page || 1;
                  const limit = req.query.limit || 10;
                  const offset = (page - 1) * limit;

                  const getAllTranslationResponsesQuery = `
                        SELECT * FROM TranslationResponse LIMIT ? OFFSET ?
                  `

                  await db.all(getAllTranslationResponsesQuery, [limit, offset], function(error, responses) {
                        if (error){
                              console.error("erro no condicional do db all --> " + error.message);
                              next(new CustomError(error.message, 400));
                        }

                        if (!responses || responses.length === 0){
                              console.error("sem respostas disponíveis");
                              next(new CustomError("No responses were found.", 404));
                        }
                        else{
                              res.status(200).json(responses);
                        }
                  })
            } 
            catch (error) {
                  console.error('Erro no catch -->' + error.message);
                  next(error);
            }
      },
      getTranslationResponseBy: async(req, res, next, db) =>{
            try {
                  const getTranslationResponseDTO = new GetTranslationResponseDTO(req.params.requestId);
                  
                  const isValidRequestId = utils.checkId(getTranslationResponseDTO.requestId);
                  if (!isValidRequestId){
                        console.error("erro no isValidRequestId");
                        next(new CustomError("Invalid request Id", 400));
                  }

                  const getTranslationResponseByIdQuery = `
                        SELECT * FROM TranslationResponse WHERE request_id = ?
                  `;
                  
                  await db.get(getTranslationResponseByIdQuery, [getTranslationResponseDTO.requestId], function(error, response) {
                        if (error){
                              console.error("erro no condicional do db get --> " + error.message);
                              next(new CustomError(error.message, 400));
                        }

                        if (!response){
                              console.error("erro no !response. Response não encontrado");
                              next(new CustomError("Response not found.", 404));
                        }
                        else{
                              res.status(200).json({response: response});
                        }
                  })

            } catch (error) {
                  console.error("erro no catch --> " + error.message);
                  next(new CustomError(error.message, 500));
            }
      }

}

module.exports = translationResponseServices;