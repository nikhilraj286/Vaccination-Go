const express = require("express");
const cors = require("cors");
const app = express();
// const redisClient=require("./config/redisConfig");

require("./db/SQL");

const url = "http://localhost:3000";
// const url = "http://52.37.170.117:3000";

app.use(cors({ origin: url, credentials: true }));
app.use(express.json({ extended: false }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", url);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

module.exports = app;
