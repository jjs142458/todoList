const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mjchoi12##",
  database: "todo",
});
db.connect();

let todoList = {
  content: "mysql learning",
  isdone: true,
};

router.post("/list", (req, res) => {
  db.query(`SELECT * FROM todo;`, (err, todoList) => {
    if (err) {
      console.log(err);
    }
    console.log(todoList);
    db.end();
  });
});

router.post("/submit", (req, res) => {
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

router.put("/update", (req, res) => {
  let data = {
    id: 3,
    content: "씨발 ",
    isdone: 1,
  };

  db.query(
    `UPDATE todo SET content = ?, isdone = ? WHERE id = ?;`,
    [data.content, data.isdone, data.id],
    (err, todoList) => {
      if (err) {
        console.log(err);
      }
      console.log(todoList);
      db.end();
    }
  );
});

router.delete("/delete", (req, res) => {
  let data = {
    id: 3,
    content: "씨발 ",
    isdone: 1,
  };
  db.query(`DELETE FROM todo WHERE id = ?`, [data.id], (err, todoList) => {
    if (err) {
      console.log(err);
    }
    console.log(todoList);
  });
});

module.exports = router;
