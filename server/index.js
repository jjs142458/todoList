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
  console.log(req.session);
  res.send(`${req.session?.user?.user_name}`);
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
    user_name: "sosorry", // 유저가 전송한 데이터
    password: "142458",
    email: "jjs142458@naver.com",
  };

  db.query(
    `SELECT * FROM user WHERE user_name = ?`,
    [userData.user_name],
    (err, userList) => {
      if (err) {
        console.log(err);
      }
      console.log("login", req.session);

      if (req.session.isLogin) {
        res.send(
          `이미 로그인 되어 있습니다. 로그인 된 계정명 : ${req.session.user_name}`
        );
        console.log(req.session);
      } else if (
        userList[0].password === userData.password &&
        userList[0].email === userData.email
      ) {
        req.session.user = {
          isLogin: true,
          user_name: userData.user_name,
        };
        console.log(req.session);
        res.status(200).send(`로그인 되었습니다 : ${userData.user_name}`);
      } else {
        res.send("회원 정보가 없습니다.");
      }
    }
  );
});

app.get("/logout", (req, res) => {
  let session = req.session;

  if (session.user.isLogin === null) {
    res.send("로그인 되어있지 않습니다.");
  } else {
    session.destroy((err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("로그아웃 완료");
      res.status(201);
      res.redirect("/");
    });
  }
});
