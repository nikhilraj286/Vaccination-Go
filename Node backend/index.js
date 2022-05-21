const app = require("./app");
const router = require("./routers/router");
const db = require("./models");

app.get("/", (req, res) => {
  res
    .status(200)
    .send("Vaccination Backend API is Alive!, access the routes to get data!");
});

app.use("/router", router);

db.sequelize.sync().then(() => {
  app.listen(3001, console.log("server started on port 3001"));
});
