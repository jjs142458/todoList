const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const mysql = require("mysql");
const session = require("express-session");
require("dotenv").config();
const FileStore = require("session-file-store")(session);
const app = express();
const port = 8080;
const db = mysql.createConnection({
  host: process.env.DB_MYSQL_HOST,
  user: process.env.DB_MYSQL_USER,
  password: process.env.DB_MYSQL_PASSWORD,
  database: "user",
});
db.connect();

app.use(
  session({
    secret: "abc",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/user", require("./router/user.js"));
app.use("/api/post", require("./router/post.js"));

app.listen(port, () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_MONGO_ID}:${process.env.DB_MONGO_PASS}@todolist.bih5hu2.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(() => {
      console.log("mongoDB connect...");
      console.log(`Example app listening on port ${port}`);
    })
    .catch((err) => console.log(err));
});

let authData = {
  email: "mnbvc@naver.com",
  password: "33333",
  user_name: "Tlqkf",
};

app.get("/", (req, res) => {
  res.send(`${req.session?.user_name}`);
});

app.get("/loguout", (req, res) => {
  let session = req.session;

  if (session.isLogin) {
    // 로그인되어있으면, session.destroy 한다.
    session.destroy((err) => {
      if (err) {
        res.sendStatus(500);
      } else {
        console.log("로그아웃 성공");
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(200);
  }
});
// 1. 회원가입 페이지 만들기
//  - 유저 id, 유저 pwd, 유저 name, 유저 email, 유저 권한 (ok)
// 2. 유저인증
//  - session

app.post("/userlist", (req, res) => {
  db.query(`SELECT * FROM user`, (err, userList) => {
    if (err) {
      console.log(err);
    }
    console.log(userList);
  });
});

app.post("/submit", (req, res) => {
  db.query(
    `INSERT INTO user (password, user_name, email) VALUES (?,?,?)`,
    [authData.password, authData.user_name, authData.email],
    (err, userList) => {
      if (err) {
        console.log(err);
      }
      console.log(userList);
    }
  );
});

app.get("/login", (req, res) => {
  let userData = {
    user_name: "abcde", // 유저가 전송한 데이터
    password: "22222",
    email: "asdfg@naver.com",
  };

  db.query(
    `SELECT * FROM user WHERE user_name = ?`,
    [userData.user_name],
    (err, userList) => {
      if (err) {
        console.log(err);
      }

      if (req.session.isLogin) {
        res.send(
          `이미 로그인 되어 있습니다. 로그인 된 계정명 : ${req.session.user_name}`
        );
      } else if (
        userList[0].password === userData.password &&
        userList[0].email === userData.email
      ) {
        req.session.isLogin = true;
        req.session.user_name = userData.user_name;
        res.status(200);
        res.send(`로그인 되었습니다 : ${userData.user_name}`);
      } else {
        res.status(400);
      }
    }
  );
});
