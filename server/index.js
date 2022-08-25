const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", require("./router/user.js"));
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
