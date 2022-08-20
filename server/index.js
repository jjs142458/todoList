const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();

const { auth } = require("./authMiddleware");
const { json } = require("express");

const port = 8080;
const SECRET_KEY = "MY-SECRET-KEY";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// POST /login 요청 body에 id와 password를 함께 실어서 요청으로 가정 (사실 id와 password는 암호화 되어있음)
app.post("/login", (req, res, next) => {
  const nickName = "jeasung";
  const profile = "imageURL";

  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  token = jwt.sign(
    {
      type: "JWT",
      nickname: nickName,
      profile: profile,
    },
    SECRET_KEY,
    {
      expiresIn: "10m",
      issuer: "토큰 발급자",
    }
  );

  return res
    .status(200)
    .json({ code: 200, message: "토큰이 발급되었습니다", token: token });
});

app.get("/payload", auth, (req, res) => {
  const nickname = req.decoded.nickname;
  const profile = req.decoded.profile;
  return res.status(200).json({
    code: 200,
    message: "토큰이 정상입니다.",
    data: {
      nickname: nickname,
      profile: profile,
    },
  });
});
