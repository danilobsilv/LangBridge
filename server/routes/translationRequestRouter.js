const router = require("express").Router();
const database = require("../data/databaseCode/dbConnection");
const translationRequestController = require('../rules/controllers/translationRequestController');

router.route("/:userId/:textId").post((req, res, next) => translationRequestController.createTranslationRequest(req, res, next, database));

module.exports = router;