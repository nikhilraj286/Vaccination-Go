const express = require("express");
const db = require("./../models");
const app = require("./../app");
const Promise = require("bluebird");

const router = express.Router();

app.get("/getVaccineDueDates", (req, res) => {
  db.UserVaccinations.findAll({ where: { userId: req.query.user_mrn } })
    .then((response) => {
      return res.status(200).send(response);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

app.post("/checkInAppointment", async (req, res) => {
  if (req.body.noShow) {
    db.Appointment.update(
      { isChecked: 2 },
      { where: { appointmentId: req.body.appointmentId } }
    )
      .then((response) => {
        return res.status(200);
      })
      .catch((error) => {
        return res.status(400);
      });
  }

  Promise.mapSeries(req.body.vaccinations, async (vaccination) => {
    return db.UserVaccinations.findOne({
      where: {
        vaccinationId: vaccination.vaccinationId,
        userId: req.body.user_Id,
      },
    }).then(async (previousDose) => {
      if (previousDose) {
        let dosesLeft = previousDose.dosesLeft - 1;
        if (dosesLeft < 0) dosesLeft = 0;

        let setNewDate = addDays(
          req.body.checkInDate,
          vaccination.shotInternalVal
        );
        let newDose = { ...previousDose };
        newDose.dosesLeft = dosesLeft;
        delete newDose.id;
        newDose.nextAppointmentTime = setNewDate;
        await db.UserVaccinations.update(newDose, {
          where: { id: previousDose.id },
        });
      } else {
        let vacc = await db.Vaccination.findOne({
          where: { vaccinationId: vaccination.vaccinationId },
        });
        let newDose = {
          dosesLeft: vacc.numberOfShots - 1,
          nextAppointmentTime: addDays(
            req.body.checkInDate,
            vacc.shotInternalVal
          ),
          userId: req.body.user_Id,
          vaccinationId: vacc.vaccinationId,
        };
        await db.UserVaccinations.create(newDose);
      }
    });
  });
  await db.Appointment.update(
    { isChecked: 1 },
    { where: { appointmentId: req.body.appointmentId } }
  );
  return res.status(200).send("success");
});

// app.post("/checkInAppointmeccnt", async (req, res) => {
//   let vaccinationList = req.body.vaccinations;
//   let userVaccinations = [];
//   let currentVaccines = await db.UserVaccinations.findAll({
//     where: { userId: req.body.user_Id },
//   });

//   if (req.body.noShow) {
//     await db.Appointment.update(
//       { isChecked: 3 },
//       { where: { appointmentId: req.body.appointmentId } }
//     );
//   }

//   let vaccinationListCloned = [...vaccinationList];
//   if (currentVaccines.length > 0) {
//     Promise.mapSeries(vaccinationList, (vaccination) => {
//       Promise.mapSeries(currentVaccines, (current) => {
//         if (current.vaccinationId === vaccination.vaccinationId) {
//           let date = req.body.checkInDate;
//           let setDosesLeft, setNewDate;

//           if (current.dosesLeft - 1 >= 0) setDosesLeft = current.dosesLeft - 1;
//           else setDosesLeft = 0;

//           if (current.dosesLeft <= 0)
//             setNewDate = addDays(date, vaccination.duration);
//           else setNewDate = addDays(date, vaccination.shotInternalVal);

//           vaccinationListCloned = vaccinationListCloned.filter(
//             (item) => item !== vaccination
//           );
//           return db.UserVaccinations.update(
//             { dosesLeft: setDosesLeft, nextAppointmentTime: setNewDate },
//             { where: { id: current.id } }
//           );
//         }
//       });
//     });
//   }

//   vaccinationListCloned.forEach(async (vacc) => {
//     let noOfShot = vacc.numberOfShots;
//     let date = req.body.checkInDate;
//     let setNewDate;

//     if (vacc.numberOfShots - 1 === 0) setNewDate = addDays(date, vacc.duration);
//     else setNewDate = addDays(date, vacc.shotInternalVal);

//     if (noOfShot - 1 >= 0) noOfShot--;
//     else noOfShot = 0;

//     let res = await db.UserVaccinations.create({
//       dosesLeft: noOfShot,
//       nextAppointmentTime: setNewDate,
//       userId: req.body.user_Id,
//       vaccinationId: vacc.vaccinationId,
//     });
//     userVaccinations.push(res);
//   });

//   await db.Appointment.update(
//     { isChecked: 1 },
//     { where: { appointmentId: req.body.appointmentId } }
//   );

//   return res.status(200).send(userVaccinations);
// });

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toDateString();
}

module.exports = router;
