const express = require("express");
const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("씨발 기본 설정 ㅈ같네 git 연결 왜 안됌?");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
