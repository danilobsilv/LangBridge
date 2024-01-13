const router = require("express").Router();

// Users router
const userRouter = require("./userRouter");
router.use("/user", userRouter);

module.exports = router;