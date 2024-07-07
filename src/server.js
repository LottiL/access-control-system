const express = require("express");
const mysql = require('mysql2');
const dotenv = require('dotenv');
const crypto = require("crypto");

const app = express();
const port = 5500;

dotenv.config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

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

  const query = `SELECT id FROM user 
  WHERE email = ?`;
  const params = email;
  conn.query(query, params, (err, rows) => {
    const query2 = `SELECT passwordSalt, passwordHash FROM password 
    WHERE userID = ?`;
    const params2 = rows;

    if (rows.length === 0) {
      res.status(401).send("Unauthorized");
      return;
    }
  
    conn.query(query2, params2, (err2, rows2) => {
      let passwordSalt = rows2.passwordSalt;
      let passwordHash = rows2.passwordHash;
      let generatedHash = generateHash(passwordSalt, password);
      if (generatedHash != passwordHash) {
        res.status(401).send("Unauthorized");
        return;
      }
    });

    res.status(200).send("OK")
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
