const router = require("express").Router();
const database = require("../data/databaseCode/dbConnection");
const textController = require("../rules/controllers/textController");

router.route("/:userId/:translationRequestId")
      .post((req, res, next) => textController.createText(req, res, database, next));

router.route("/").get((req, res, next) => textController.getAllText(req, res, database, next));

module.exports = router;