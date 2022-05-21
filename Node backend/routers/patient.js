const express = require("express");
const db = require("./../models");
const app = require("./../app");
// const redisClient= require("../config/redisConfig");
const router = express.Router();

app.get("/allEmails", (req, res) => {
  console.log("All Emails");
  db.User.findAll({ attributes: ["email"] })
    .then((users) => {
      let output = [];
      [...users].forEach((elem) => {
        output.push(elem.dataValues.email);
      });
      return res.status(200).send(output);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

app.get("/getUser/:email", async (req, res) => {
  console.log("Get User", req.params);
  // const val=await redisClient.get(req.params.email);
  // if(val){
  //   return res.status(200).send(val);
  // }else{
      db.User.findOne({ where: { email: req.params.email } })
      .then((user) => {
        return res.status(200).send(user);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  // }
});

app.post("/updateUser/:mrn", (req, res) => {
  console.log("Update user", req.params, req.body);
  db.User.update(req.body, { where: { mrn: req.params.mrn } })
    .then((user) => {
      // redisClient.set(req.body.email, JSON.stringify(req.body));
      return res.status(200).send(user);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

app.post("/updatePassword", (req, res) => {
  console.log("Update Password", req.params);
  db.User.update(
    { password: req.params.password },
    { where: { mrn: req.params.mrn } }
  )
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

module.exports = router;
