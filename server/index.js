const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "imsosorry",
  database: "todo",
});
db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", require("./router/user.js"));

let todoList = {
  content: "mysql learning",
  isdone: true,
};

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

app.post("/list", (req, res) => {
  db.query(`SELECT * FROM todo`, (err, todoList) => {
    if (err) {
      console.log(err);
    }
    console.log(todoList);
    db.end();
  });
});

app.post("/submit", (req, res) => {
  db.query(
    `INSERT INTO todo (content, createAt, isdone) VALUES (?, NOW(), ?)`,
    [todoList.content, todoList.isdone],
    (err, todoList) => {
      if (err) {
        console.log(err);
      }
      console.log(todoList);
      db.end();
    }
  );
});
