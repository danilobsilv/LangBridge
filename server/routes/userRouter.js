const router = require("express").Router();
const db = require("../data/databaseCode/dbConnection");
const userRepository = require("../rules/repository/userRepository");

router.route("/")
      .post((req, res) => userRepository.createUser(req, res, db))
      .get((req, res) => userRepository.getAllUsers(req, res, db));


router.route("/:userId")
      .get((req, res) => userRepository.getUserById(req, res, db))
      .put((req, res) => userRepository.updateUserById(req, res, db))
      .delete((req, res) => userRepository.deleteUserById(req, res, db));

module.exports = router;