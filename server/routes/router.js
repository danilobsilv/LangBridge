const router = require("express").Router();
const userRouter = require("./userRouter");
const textRouter = require("./textRouter");
const translationRequestRouter = require("./translationRequestRouter");
const translationResponseRouter = require("./translationResponseRouter");

// Users Router
router.use("/user", userRouter);

// Text Router
router.use("/text", textRouter);

// Translation Request Router
router.use("/translationrequest", translationRequestRouter);

// Translation Response Router
router.use("/translationresponse", translationResponseRouter);

module.exports = router;