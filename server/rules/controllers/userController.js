const userService = require("../services/userServices");

const userController = {
  createUser: userService.createUser,

  getAllUsers: userService.getAllUsers,

  getUserById: userService.getUserById,

  updateUserById: userService.updateUserById,

  deleteUserById: userService.deleteUserById
};

module.exports = userController;