const textServices = require("../services/textServices");

const textController = {
      createText: textServices.createText,
      getAllText: textServices.getAllText,
      getTextById: textServices.getTextById
}

module.exports = textController;