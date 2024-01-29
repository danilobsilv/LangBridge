const router = require("express").Router();

// Users Router
const userRouter = require("./userRouter");
router.use("/user", userRouter);

// Translation Requests Router
const textRouter = require("./textRouter");
router.use("/text", textRouter);

module.exports = router;