const express = require("express");

const app = express();
const port = 5500;

app.get("/status", (req, res) => {
  res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
