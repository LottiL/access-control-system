const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const conn = require("./db");

const app = express();
const port = 5500;

dotenv.config();

const key = process.env.JWT_SECRET || "secret";

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
    key
  );
  return token;
}

app.use(express.json());

app.get("/status", (req, res) => {
  res.send();
});

async function getUser(email) {
  const [users] = await conn.query(
    "SELECT userID, passwordSalt, passwordHash FROM password JOIN  user ON password.userID = user.id WHERE email = ?",
    [email]
  );
  return users[0];
}

app.post("/login", async (req, res) => {
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
  let token = generateToken(user.userID, 0);

  res.status(200).send(token);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
