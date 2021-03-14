var express = require("express");
const MyDB = require("../db/MyDB");
var jwt = require("jsonwebtoken");
var config = require("../config/auth.config");
var path = require("path");
var authJwt = require("../middlewares/authJwt");
var fs = require("fs");
var router = express.Router();

router.get("/", [authJwt.verifyToken], function (req, res, next) {
  res.sendFile(path.resolve("public/login.html"));
});

router.get("/files", [authJwt.verifyToken], function (req, res, next) {
  res.sendFile(path.resolve("public/files/files.html"));
});

router.get(
  "/getCurrentUser",
  [authJwt.verifyToken],
  async function (req, res, next) {
    let result = await MyDB.queryUser({ email: req.userId });
    if (result) {
      res.json({ result: result });
    } else {
      res.json({ result: "not exist" });
    }
  }
);

router.post("/logout", [authJwt.verifyToken], async function (req, res, next) {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: false,
    maxAge: 0,
    expires: Date.now(),
  });
  res.json({ result: "success" });
});

router.post("/createFile", [authJwt.verifyToken], async (req, res) => {
  let file;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // dirPath = __dirname + '/../public/files/' + req.userId + '/';
  let dirPath = __dirname + "/../public/files/" + req.userId + "/";
  file = req.files.file;
  uploadPath = dirPath + file.name;

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  try {
    await file.mv(uploadPath);

    const fileObj = {
      name: req.body.name,
      url: "/files/" + req.userId + "/" + file.name,
      userId: req.userId,
    };
    const dbRes = await MyDB.createFile(fileObj);

    res.redirect("/files");
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

router.get("/getFiles", [authJwt.verifyToken], async (req, res) => {
  try {
    const query = { userId: req.userId };
    const files = await MyDB.getFiles(query);
    res.send({ files: files });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

router.post("/deleteFile", [authJwt.verifyToken], async (req, res) => {
  try {
    const file = req.body;
    const dbRes = await MyDB.deleteFile(file);
    res.send({ done: dbRes });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

router.post("/downloadFile", [authJwt.verifyToken], async (req, res) => {
  try {
    const file = req.body;
    res.sendFile(path.resolve("public" + file.url));
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

router.post("/signup", async function (req, res, next) {
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
  let result = await MyDB.queryUser({
    email: req.body.email,
    password: req.body.password,
  });
  if (result) {
    var token = jwt.sign({ id: req.body.email }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });
    res.redirect("/files");
  } else {
    res.json({ error: "no such user." });
  }
});

module.exports = router;
