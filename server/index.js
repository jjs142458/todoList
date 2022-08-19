const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("씨발 기본 설정 ㅈ같네 git 연결 왜 안됌?");
});

app.listen(port, () => {
  mongoose
    .connect(
      "mongodb+srv://sosorry:mjchoi12@todolist.bih5hu2.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("mongoDB connect...");
      console.log(`Example app listening on port ${port}`);
    })
    .catch((err) => console.log(err));
});
