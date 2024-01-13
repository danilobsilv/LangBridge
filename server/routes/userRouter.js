const router = require("express").Router();
const db = require("../data/repository/dbConnection");
const userController = require("../rules/controllers/userController");

router.route("/").post((req, res) => userController.createUser(req, res, db));

module.exports = router;