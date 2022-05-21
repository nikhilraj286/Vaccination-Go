const express = require("express");
const router = express.Router();

const app = require("../app");
const db = require("../models");
const Promise = require("bluebird");

app.post("/addVaccination", async (req, res) => {
  try {
    let vaccine = await db.Vaccination.create(req.body);
    console.log("Divya ", vaccine.vaccinationId);
    let listDisease = req.body.diseases;
    console.log(listDisease);
    Promise.mapSeries(listDisease, (disease) => {
      console.log("disease", disease);
      return db.Vaccination_Diseases.create({
        vaccinationId: vaccine.vaccinationId,
        diseaseId: disease,
      });
    })
      .then((response) => {
        return res.status(200).send(vaccine);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.get("/getAllVaccinations/:user_id", async (req, res) => {
  try {
    let vaccinations = await db.Vaccination.findAll();
    let userVaccinations = await db.UserVaccinations.findAll({
      where: { userId: req.params.user_id },
    });
    let resp = new Map();
    vaccinations.forEach((vaccination) => {
      resp.set(vaccination.vaccinationId, vaccination);
    });

    vaccinations.forEach((vaccination) => {
      userVaccinations.forEach((vacc) => {
        if (
          vacc.vaccinationId === vaccination.vaccinationId &&
          vacc.dosesLeft <= 0
        )
          resp.delete(vaccination.vaccinationId);
      });
    });

    let response = [];
    resp.forEach((key, value) => {
      console.log("here", key);
      response.push(value);
    });

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

app.get("/getVaccinationsDueForUser", async (req, res) => {
  let userMrn = req.query.user_mrn;
  let currentDate = new Date(req.query.currentDate);

  let allVaccinations = await db.Vaccination.findAll({
    where: {},
    include: [{ model: db.Appointment, include: [db.Clinic] }],
  });
  let userVaccinations = await db.UserVaccinations.findAll({
    where: { userId: userMrn },
    attributes: [
      "dosesLeft",
      "vaccinationId",
      "nextAppointmentTime",
      "createdAt",
    ],
    order: [["createdAt", "ASC"]],
  });
  let userVaccinationsMap = new Map();
  userVaccinations.forEach((v) =>
    userVaccinationsMap.set(v.vaccinationId, {
      dosesLeft: v.dosesLeft,
      nextAppointmentTime: v.nextAppointmentTime,
    })
  );

  let remainingVaccinations = [];

  for (let v of allVaccinations) {
    let shotsDue = v.numberOfShots;
    let nextAppointmentTime = null;
    if (userVaccinationsMap.has(v.vaccinationId)) {
      let vacc = userVaccinationsMap.get(v.vaccinationId);
      if (vacc.dosesLeft <= 0) continue;
      shotsDue = vacc.dosesLeft;
      nextAppointmentTime = new Date(vacc.nextAppointmentTime);
    }
    v.shotsDue = shotsDue;
    v.nextAppointmentTime = nextAppointmentTime;
    remainingVaccinations.push(v);
  }

  let result = [];
  remainingVaccinations.forEach((vaccination) => {
    let data = {
      vaccinationId: vaccination.vaccinationId,
      numberOfShotDue: vaccination.shotsDue,
      dueDate: vaccination.nextAppointmentTime,
      vaccinationName: vaccination.vaccinationName,
    };
    let nextBestTimeDifference = 365 * 24 * 60 * 60 * 1000;
    let newAppointment = null;
    vaccination.Appointments.forEach((appointment) => {
      let diff = appointment.appointmentDateTime - currentDate;
      if (
        diff > 0 &&
        diff <= nextBestTimeDifference &&
        appointment.isChecked < 2 &&
        appointment.userMrn === Number(userMrn)
      ) {
        nextBestTimeDifference = diff;
        let newClinic = {
          name: appointment.Clinic.name,
          street: appointment.Clinic.street,
          city: appointment.Clinic.city,
        };
        newAppointment = {
          appointmentId: appointment.id,
          appointmentDateStr: appointment.appointmentDateStr,
          appointmentTimeStr: appointment.appointmentTimeStr,
          appointmentDateTime: appointment.appointmentDateTime,
          isChecked: appointment.isChecked,
          clinic: newClinic,
        };
      }
    });
    if (newAppointment) data.appointment = newAppointment;
    result.push(data);
  });

  if (result.length > 0) return res.status(200).send(result);
  return res.status(400).send("No Vaccinations present in database");
});

app.get("/getTotalVaccinationsinRepo", (req, res) => {
  db.Vaccination.findAll()
    .then(async (vaccinations) => {
      if (vaccinations != null) {
        let result = [];
        let userVaccinations = await db.UserVaccinations.findAll({
          where: { userId: req.query.userMrn },
        });
        for (let vacc of vaccinations) {
          let flag = true;
          for (let userVacc of userVaccinations) {
            if (
              vacc.vaccinationId === userVacc.vaccinationId &&
              userVacc.dosesLeft === 0
            )
              flag = false;
          }
          if (flag) result.push(vacc);
        }
        res.status(200).send(result);
      }
      res.send(400);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

module.exports = router;
