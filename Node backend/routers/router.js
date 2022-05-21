const express = require("express");
const router = express.Router();

const patientRouter = require("./patient");
const diseaseRouter = require("./disease");
const vaccinationRouter = require("./vaccination");
const clinicRouter = require("./clinic");
const appointmentRouter = require("./appointment");
const userAuthRouter = require("./userAuth");
const userVaccinations = require("./userVaccinations");

router.use(patientRouter);
router.use(diseaseRouter);
router.use(vaccinationRouter);
router.use(appointmentRouter);
router.use(clinicRouter);
router.use(userAuthRouter);
router.use(userVaccinations);

module.exports = router;
