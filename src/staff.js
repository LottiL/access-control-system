const express = require("express");
const {
  authenticationMiddleware,
  authorizationMiddleware,
} = require("./middlewares");

const router = express.Router();

router.use(authenticationMiddleware);
router.use(authorizationMiddleware);

router.get("/", function (req, res, next) {
  res.send({ message: "Router Working" });
});

module.exports = router;
