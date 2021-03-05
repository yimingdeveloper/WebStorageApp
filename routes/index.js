var express = require("express");
const MyDB = require("../db/MyDB");
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get("/login", async function (req, res, next) {
  console.log("aaa");
  console.log(MyDB);
  res.json({ error: "ddd" });
});

router.get("/home", function(req, res, next) {
  res.sendFile(path.resolve("public/home.html"))
});

router.post("/signup", async function (req, res, next) {
  console.log("signup wzy begin");
  console.log("req.body.email");
  console.log(req.body.email);
  let result = await MyDB.queryUser({ email: req.body.email });
  if (result) {
    res.json({error: "user already exists."});
  } else {
    result = await MyDB.storeUser({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    })
  }
  res.redirect('/home');
});

router.post("/login", async function (req, res, next) {
  console.log("login wzy")
  console.log(req.body.email);
  let result = await MyDB.queryUser({ email: req.body.email, password: req.body.password });
  if (result) {
    res.redirect('/home');
  } else {
    res.json({error: "no such user."});
    result = await MyDB.storeUser({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    })
  }
});

module.exports = router;
