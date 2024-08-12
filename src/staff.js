const express = require("express");
const conn = require("./db");
const {
  authenticationMiddleware,
  authorizationMiddleware,
} = require("./middlewares");

const router = express.Router();

router.use(authenticationMiddleware);
router.use(authorizationMiddleware);

router.post("/guests", postUser);

async function getUserByEmail(email) {
  const [users] = await conn.query("SELECT id FROM user WHERE email = ?", [
    email,
  ]);
  return users[0];
} // helyette unique?

async function postUser(req, res, next) {
  const { firstName, lastName, email, phoneNumber } = req.body;
  let data;

  if (!firstName || !lastName || !email) {
    return res.status(400).send({ message: "fill the mandatory fields" });
  }

  if ((await getUserByEmail(email)) !== undefined) {
    return res.status(400).send({ message: "e-mail already exists" });
  }

  try {
    await conn.query(
      `
          INSERT INTO user (firstName, lastName, email, phoneNumber)
          VALUES (?, ?, ?, ?)
        `,
      [firstName, lastName, email, phoneNumber]
    );
    data = await getUserByEmail(email);
  } catch (err) {
    return next(err);
  }
  return res.status(200).send(data);
}

router.get("/", function (req, res, next) {
  res.send({ message: "Router Working" });
});

module.exports = router;
