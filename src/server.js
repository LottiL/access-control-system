const express = require("express");
const dotenv = require("dotenv");

const staffRouter = require("./staff");
const login = require("./login");

const app = express();
const port = 5500;

dotenv.config();

app.use(express.json());
app.use("/staff", staffRouter);

app.get("/status", (req, res) => {
  res.send();
});

app.post("/login", login.checkUser);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Not found" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
