const router = require("express").Router();
const userRouter = require("./userRouter");
const textRouter = require("./textRouter");
const translationRequestRouter = require("./translationRequestRouter");

// Users Router
router.use("/user", userRouter);

// Text Router
router.use("/text", textRouter);

// Translation Request Router
router.use("/translationrequest", translationRequestRouter);


module.exports = router;