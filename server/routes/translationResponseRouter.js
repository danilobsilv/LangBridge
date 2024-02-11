const router = require("express").Router();
const database = require("../data/databaseCode/dbConnection");
const translationResponseController = require("../rules/controllers/translationResponseController");

router.route("/:requestId")
      .post((req, res, next) => translationResponseController.createTranslationResponse(req, res, next, database))
      .get((req, res, next) => translationResponseController.getTranslationResponseById(req, res, next, database));

router.route("/").get((req, res, next) => translationResponseController.getAllTranslationResponses(req, res, next, database));

module.exports = router;