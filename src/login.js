const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const conn = require("./db");

function generateHash(salt, password) {
  const passwordAndSalt = password + salt;
  const hash = crypto
    .createHash("sha256")
    .update(passwordAndSalt)
    .digest("hex");
  return hash;
}

function generateToken(ID, isStaff) {
  const twoWeeksFromNow = 2 * 7 * 24 * 60 * 60;
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + twoWeeksFromNow,
      ID,
      isStaff,
    },
    process.env.JWT_SECRET
  );
  return token;
}

async function checkUser(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  let user;

  try {
    user = await getUser(email);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal server error" });
  }

  if (!user) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  let passwordSalt = user.passwordSalt;
  let passwordHash = user.passwordHash;
  let generatedHash = generateHash(passwordSalt, password);
  if (generatedHash != passwordHash) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  let token = generateToken(user.userID, true);

  res.status(200).send(token);
}

async function getUser(email) {
  const [users] = await conn.query(
    `SELECT userID, passwordSalt, passwordHash FROM password 
    JOIN user ON password.userID = user.id 
    WHERE email = ?`,

    [email]
  );
  return users[0];
}

module.exports = { checkUser };
