const router = require("express").Router();

// Users Router
const userRouter = require("./userRouter");
router.use("/user", userRouter);

// Translation Requests Router
const tranlationRequetsRouter = require("./translationRequestRouter");
router.use("/translation-request", tranlationRequetsRouter);

module.exports = router;