const textServices = require("../services/textServices");

const textController = {
      createText: textServices.createText,
      getAllText: textServices.getAllText
}

module.exports = textController;