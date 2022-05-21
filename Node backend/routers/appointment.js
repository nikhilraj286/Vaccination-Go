const express = require("express");
const db = require("./../models");
const app = require("./../app");
const Promise = require("bluebird");
const { Op } = require("sequelize");

const router = express.Router();

app.post("/createAppointment", (req, res) => {
  let vaccinations = req.body.vaccinations;
  delete req.body.vaccinations;
  req.body.isChecked = 0;
  if (req.body.appointmentId != null) {
    let apptId = req.body.appointmentId;
    delete req.body.appointmentId;
    console.log(req.body);
    db.Appointment.update(req.body, {
      where: { appointmentId: apptId },
    }).then((appointment) => {
      Promise.mapSeries(vaccinations, (vaccination) => {
        return db.Appointment_Vaccinations.findOrCreate({
          where: {
            appointmentId: apptId,
            vaccinationId: vaccination,
          },
        });
      })
        .then((response) => {
          db.Appointment_Vaccinations.destroy({
            where: {
              appointmentId: apptId,
              vaccinationId: { [Op.notIn]: vaccinations },
            },
          })
            .then((response) => {
              return res.status(200).send("Success");
            })
            .catch((error) => {
              return res.status(400).send(error);
            });
        })
        .catch((error) => {
          return res.status(400).send(error);
        });
    });
  } else {
    db.Appointment.create(req.body)
      .then((appointment) => {
        Promise.mapSeries(vaccinations, (vaccination) => {
          return db.Appointment_Vaccinations.create({
            appointmentId: appointment.appointmentId,
            vaccinationId: vaccination,
          });
        })
          .then((response) => {
            return res.status(200).send("Success");
          })
          .catch((error) => {
            return res.status(400).send(error);
          });
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  }
});

app.post("/cancelAppointment", (req, res) => {
  db.Appointment.update({ isChecked: 3 }, { where: req.body })
    .then((response) => {
      return res.status(200).send("Success");
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

app.post("/getAppointmentsForUser", async (req, res) => {
  let appointments = await db.Appointment.findAll({
    where: { userMrn: req.body.mrn },
    order: [["appointmentDateTime", "DESC"]],
    include: [db.Clinic, db.Vaccination],
  });
  if (appointments != null) {
    Promise.mapSeries(appointments, (appointment) => {
      let isPastAppointment = isAppointmentDue(
        appointment.appointmentDateTime,
        req.body.time
      );
      if (isPastAppointment && appointment.isChecked != 1) {
        appointment.isChecked = 2;
        return db.Appointment.update(
          { isChecked: 2 },
          { where: { appointmentId: appointment.appointmentId } }
        );
      }
    })
      .then((response) => {
        return res.status(200).send(appointments);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  } else {
    return res.status(400).send("Error");
  }
});

app.post("/getAllAppointmentsOnDate", (req, res) => {
  db.Appointment.findAll({
    where: {
      clinicId: req.body.clinicId,
      appointmentDateStr: req.body.date,
      isChecked: 0,
    },
  })
    .then((appointments) => {
      let response = [];
      appointments.map((appointment) => {
        response.push(appointment.appointmentTimeStr);
      });
      return res.status(200).send(response);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

app.get("/getCheckedInAppointmentsForUser", (req, res) => {
  db.Appointment.findAll({
    where: {
      userMrn: req.query.user_mrn,
      isChecked: req.query.isChecked,
    },
    order: [["appointmentDateTime", "ASC"]],
    include: [db.Clinic, db.Vaccination],
  })
    .then((appointments) => {
      return res.status(200).send(appointments);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

app.get("/getCheckedInHistory", (req, res) => {
  let skip = Number(req.query.page) * Number(req.query.size);

  db.Appointment.findAndCountAll({
    where: {
      userMrn: req.query.user_mrn,
      isChecked: req.query.isChecked,
    },
    order: [["appointmentDateTime", "ASC"]],
    include: [db.Clinic, db.Vaccination],
    offset: Number(skip),
    limit: Number(req.query.size),
  })
    .then((appointments) => {
      return res.status(200).send(appointments);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

isAppointmentDue = (date1, date2) => {
  return new Date(date1) > new Date(date2) ? false : true;
};

app.get("/getPatientReport", (req, res) => {
  // ToDo: Format Date
  // SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
  let start = new Date(req.query.startDate).toISOString().slice(0, 10);
  let end = new Date(req.query.endDate).toISOString().slice(0, 10);
  // Date start=formatter.parse(startDate);
  // Date end=formatter.parse(endDate);
  db.Appointment.findAll({
    where: {
      userMrn: req.query.usermrn,
      appointmentDateTime: { [Op.between]: [start, end] },
    },
  })
    .then((appointments) => {
      return res.status(200).send(appointments);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

app.get("/getPatientReportForAdmin", (req, res) => {
  // ToDo: Format Date
  // SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
  // Date start=formatter.parse(startDate);
  // Date end=formatter.parse(endDate);
  let start = new Date(req.query.startDate).toISOString().slice(0, 10);
  let end = new Date(req.query.endDate).toISOString().slice(0, 10);
  db.Appointment.findAll({
    where: {
      clinicId: req.query.clinicId,
      appointmentDateTime: { [Op.between]: [start, end] },
    },
  })
    .then((appointments) => {
      return res.status(200).send(appointments);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

app.get("/upcomingAppointments", (req, res) => {
  db.Appointment.findAll({
    where: {
      userMrn: req.query.userMrn,
      isChecked: { [Op.in]: [0, 1] },
      appointmentDateTime: { [Op.gt]: new Date(req.query.currentDate) },
    },
  })
    .then((response) => {
      if (response) res.status(200).send(response);
      res.status(400);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

module.exports = router;
