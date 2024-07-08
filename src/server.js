const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5500;

dotenv.config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const key = process.env.JWT_SECRET || "secret";

conn.connect((err) => {
  if (err) {
    console.error("Cannot connect to the database", err);
    return;
  }
  console.log("Connection established");
});

function generateHash(salt, password) {
  const passwordAndSalt = password + salt;
  const hash = crypto
    .createHash("sha256")
    .update(passwordAndSalt)
    .digest("hex");
  return hash;
}

function generateToken(ID, isAdmin) {
  const twoWeeksFromNow = 2 * 7 * 24 * 60 * 60;
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + twoWeeksFromNow,
      ID,
      isAdmin,
    },
    key
  );
  return token;
}

app.use(express.json());

app.get("/status", (req, res) => {
  res.send();
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email | !password) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  const query = `SELECT userID, passwordSalt, passwordHash FROM password
    JOIN  user ON password.userID = user.id
    WHERE email = ?`;
  const params = email;
  conn.query(query, params, (err, rows) => {
    if (rows.length === 0) {
      res.status(401).send("Unauthorized");
      return;
    }

    let passwordSalt = rows[0].passwordSalt;
    let passwordHash = rows[0].passwordHash;
    let generatedHash = generateHash(passwordSalt, password);
    if (generatedHash != passwordHash) {
      res.status(401).send("Unauthorized");
      return;
    }
    let token = generateToken(rows[0].userID, 0);

    res.status(200).send(token);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
