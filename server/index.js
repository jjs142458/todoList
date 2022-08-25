const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const mysql = require("mysql");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const app = express();
const port = 8080;
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mjchoi12##",
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
      "mongodb+srv://sosorry:mjchoi12@todolist.bih5hu2.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("mongoDB connect...");
      console.log(`Example app listening on port ${port}`);
    })
    .catch((err) => console.log(err));
});

let authData = {
  email: "abcde@naver.com",
  password: "11111",
  user_name: "TLqkf",
};

app.get("/", (req, res) => {
  if (req.session.num === undefined) {
    req.session.num = 1;
  } else {
    req.session.num = req.session.num + 1;
  }
  res.send(`${req.session.num}`);
});

// 1. 회원가입 페이지 만들기
//  - 유저 id, 유저 pwd, 유저 name, 유저 email, 유저 권한
// 2. 유저인증
//  - session

app.post("/userlist", (req, res) => {
  db.query(`SELECT * FROM user`, (err, userList) => {
    if (err) {
      console.log(err);
    }
    console.log(userList);
    db.end();
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
