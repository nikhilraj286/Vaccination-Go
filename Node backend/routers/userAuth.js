const express = require("express");
const db = require("./../models");
const app = require("./../app");
// const redisClient= require("../config/redisConfig");
const router = express.Router();

app.post("/signup", (req, res) => {
  console.log("Sign Up", req.body);
  req.body.mrn = getRandomNumber(100, 99999);
  db.User.create(req.body)
    .then((user) => {
      // redisClient.set(user.email, JSON.stringify(user));
      return res.status(200).send(user);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

app.post("/login", (req, res) => {
  console.log("Login", req.body);
  db.User.findOne({
    where: req.body,
  })
    .then((user) => {
      if (user) return res.status(200).send(user);
      return res.status(400).send("User not found !");
    })
    .catch((error) => {
      return res.status(404).send(error);
    });
});

getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

module.exports = router;
