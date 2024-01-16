const router = require("express").Router();
const database = require("../data/databaseCode/dbConnection");
const userController = require("../rules/controllers/userController");

router.route("/")
      .post((req, res) => userController.createUser(req, res, database))
      .get((req, res) => userController.getAllUsers(req, res, database));


router.route("/:userId")
      .get((req, res) => userController.getUserById(req, res, database))
      .put((req, res) => userController.updateUserById(req, res, database))
      .delete((req, res) => userController.deleteUserById(req, res, database));

module.exports = router;