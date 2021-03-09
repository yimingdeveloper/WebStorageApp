var express = require("express");
const MyDB = require("../db/MyDB");
var jwt = require("jsonwebtoken");
var config = require("../config/auth.config")
var path = require("path");
var authJwt = require("../middlewares/authJwt");
var router = express.Router();

router.get("/", [authJwt.verifyToken], function (req, res, next) {
  res.sendFile(path.resolve("public/login.html"));
});

router.get("/home", [authJwt.verifyToken], function (req, res, next) {
  res.sendFile(path.resolve("public/home.html"));
});

router.get("/files",[authJwt.verifyToken],  function (req, res, next) {
  res.sendFile(path.resolve("public/home.html"));
});

router.post("/signup", async function (req, res, next) {
  console.log("signup wzy begin");
  console.log("req.body.email");
  console.log(req.body.email);
  let result = await MyDB.queryUser({ email: req.body.email });
  if (result) {
    res.json({ error: "user already exists." });
  } else {
    result = await MyDB.storeUser({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });
  }
  res.redirect("/");
});

router.post("/login", async function (req, res, next) {
  console.log("start login");
  console.log(req.body.email);
  let result = await MyDB.queryUser({
    email: req.body.email,
    password: req.body.password,
  });
  if (result) {
    console.log("sucesss");
    var token = jwt.sign({ id: req.body.email }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    console.log("token:" + token);
    res.cookie('jwt',token, { httpOnly: true, secure: false, maxAge: 3600000 })
    res.redirect("/home");
  } else {
    res.json({ error: "no such user." });
  }
});

module.exports = router;
