const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const SECRET_KEY = "MY-SECRET-KEY";

const { auth } = require("../authMiddleware.js");

// POST /login 요청 body에 id와 password를 함께 실어서 요청으로 가정 (사실 id와 password는 암호화 되어있음)
router.post("/login", (req, res, next) => {
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

router.get("/payload", auth, (req, res) => {
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

module.exports = router;
