const router = require("express").Router();
const database = require("../data/databaseCode/dbConnection");
const translationRequestController = require('../rules/controllers/translationRequestController');

router.route("/:user_id").post((req, res, next) => translationRequestController.createTranslationRequest(req, res, next, database));

router.route("/").get((req, res, next) => translationRequestController.getAllTranslationRequests(req, res, next, database));

router.route("/:requestId").get((req, res, next) => translationRequestController.getTranslationRequestById(req, res, next, database));

module.exports = router;