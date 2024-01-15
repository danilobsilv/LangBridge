const router = require("express").Router();
const db = require("../data/repository/dbConnection");
const userController = require("../rules/controllers/userController");

router.route("/")
      .post((req, res) => userController.createUser(req, res, db))
      .get((req, res) => userController.getAllUsers(req, res, db));


router.route("/:userId")
      .get((req, res) => userController.getUserById(req, res, db))
      .put((req, res) => userController.updateUserById(req, res, db))
      .delete((req, res) => userController.DeleteUserById(req, res, db));

module.exports = router;