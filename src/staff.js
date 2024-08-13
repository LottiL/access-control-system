const express = require("express");
const conn = require("./db");
const {
  authenticationMiddleware,
  authorizationMiddleware,
} = require("./middlewares");

const router = express.Router();

router.use(authenticationMiddleware);
router.use(authorizationMiddleware);

router.get("/guests/:id/passes", getPass);
router.post("/guests/:id/passes", postPass);
router.post("/guests", postUser);

async function getPassById(id) {
  let passes;
  try {
    [passes] = await conn.query(
      `SELECT * FROM pass  
      WHERE userID = ?
      ORDER BY dateOfBuying DESC`,

      [id]
    );
  } catch (err) {
    return err;
  }
  return passes;
}

async function getExpirationDate(startDate) {
  let expirationDate;

  try {
    expirationDate = await conn.query(
      `
          SELECT DATE_ADD(?, INTERVAL 30 DAY);
        `,
      [startDate]
    );
  } catch (err) {
    return next(err);
  }
  return expirationDate;
}

async function getPass(req, res, next) {
  const ID = parseInt(req.params.id);

  const passes = await getPassById(ID);

  return res.status(200).send(passes);
}

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

async function postPass(req, res, next) {
  const { passTypeId, startDate, passNumber, gymId } = req.body;
  const ID = parseInt(req.params.id);
  let data;

  if (!passTypeId || !startDate || !gymId) {
    return res.status(400).send({ message: "fill the mandatory fields" });
  }

  let prevPassBuy = (await getPassById(ID))[0].dateOfBuying;
  let prevPassStr = prevPassBuy.toISOString().slice(0, 10);
  let prevPassExp = await getExpirationDate(prevPassStr);

  if (Object.values(prevPassExp[0][0])[0] >= startDate) {
    //datumot stingkent osszehasonlitani? Biztos van jobb megoldas
    return res.status(400).send({ message: "time overlap" });
  }

  try {
    data = await conn.query(
      `
          INSERT INTO pass (userID, passTypeID, gymID, passNumber, dateOfBuying)
          VALUES (?, ?, ?, ?, ?)
        `,
      [ID, passTypeId, gymId, passNumber, startDate]
    );
  } catch (err) {
    return next(err);
  }

  let passId = data[0].insertId;
  let expirationDate = await getExpirationDate(startDate);

  return res
    .status(200)
    .send({
      passId: passId,
      expirationDate: Object.values(expirationDate[0][0])[0],
    });
}

router.get("/", function (req, res, next) {
  res.send({ message: "Router Working" });
});

module.exports = router;
