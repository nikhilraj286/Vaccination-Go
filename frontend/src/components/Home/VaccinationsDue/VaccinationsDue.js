import React, { Component } from "react";
import Navbar from "./../../Navbar/Navbar";
import { Col, Row } from "react-bootstrap";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Container } from "@mui/material";
import axios from "axios";
import backendServer from "../../../webConfig";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import { getUserProfile, getMimicTime } from "../../Services/ControllerUtils";
import { Redirect } from "react-router";
import { Trans } from "react-i18next";
import "./VaccinationDue.css";

class VaccinationsDue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: "panel1",
    };
  }

  componentDidMount = async () => {
    const user_mrn = getUserProfile().mrn;
    const currentDate = getMimicTime();
    const currentDateMoment = moment(getMimicTime());
    const currentDate2 = new Date(getMimicTime());
    console.log("currentDate : " + currentDate);
    console.log("currentDateMoment : " + currentDateMoment);
    console.log("currentDate2 : " + currentDate2);

    //axios.defaults.withCredentials = true;
    axios
      .get(
        `${backendServer}/getVaccinationsDueForUser/?user_mrn=${user_mrn}&currentDate=${currentDateMoment}`
      )
      .then((response) => {
        console.log(
          "response data from getVaccinationsDueForUser",
          response.data
        );
        if (response.status === 200) {
          this.setState({
            vaccinationDue: response.data,
            vaccinationDueError: false,
          });
        } else {
          this.setState({
            vaccinationDue: [],
            vaccinationDueError: "No vaccinations present",
          });
        }
      })
      .catch((error) => {
        console.log("error:", error);
        this.setState({
          vaccinationDue: [],
          vaccinationDueError: "Error",
        });
      });
  };

  render() {
    const suffixes = [
      "",
      "st",
      "nd",
      "rd",
      "th",
      "th",
      "th",
      "th",
      "th",
      "th",
      "th",
      "th",
      "th",
    ];
    if (localStorage.getItem("userData") === null) {
      return <Redirect to="/" />;
    }
    let vacciDue = "";
    if (
      this.state &&
      this.state.vaccinationDue &&
      this.state.vaccinationDue.length > 0
    ) {
      vacciDue = this.state.vaccinationDue.map((item) => (
        <div
          key={item.vaccinationId}
          style={{
            border: "1px solid #bbb",
            borderRadius: "15px",
            padding: "10px 25px",
            margin: "10px",
            width: "300px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <div>
            <VaccinesIcon />{" "}
            <strong style={{ fontSize: "12px" }}>
              <Trans>Vaccination Name</Trans>:
            </strong>{" "}
            {item.vaccinationName}
          </div>
          <div>
            <ConfirmationNumberIcon />{" "}
            <strong style={{ fontSize: "12px" }}>
              <Trans>Number of shots due</Trans>:
            </strong>{" "}
            {item.numberOfShotDue}
          </div>
          <div>
            <span>
              <CalendarTodayIcon />
            </span>{" "}
            <strong style={{ fontSize: "12px" }}>
              <Trans>Due Date</Trans>:
            </strong>{" "}
            {item.dueDate ? new Date(item.dueDate).toDateString() : "N/A"}
          </div>

          <div>
            <strong style={{ fontSize: "12px" }}>
              <ScheduleIcon /> <Trans>Scheduled appointment for vaccine</Trans>:
            </strong>
          </div>

          <div>
            {item.appointment ? (
              <div
                key={item.appointment.appointmentId}
                style={{
                  border:
                    item.appointment.isChecked === 1
                      ? "1px solid #b2f4ca"
                      : "1px solid #ffd9a8",
                  backgroundColor:
                    item.appointment.isChecked === 1 ? " #b2f4ca" : "#ffd9a8",
                  padding: "10px",
                  fontSize: "14px",
                  textAlign: "center",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <strong>
                    {new Date(
                      item.appointment.appointmentDateTime
                    ).toDateString()}
                  </strong>
                  <span> , </span>
                  <strong>{item.appointment.appointmentTimeStr}</strong>
                </div>
                <div>
                  <Trans>at </Trans>
                  <strong>{item.appointment.clinic.name}</strong>
                  <span> clinic, </span>
                  <br />
                  <strong>
                    {item.appointment.clinic.street},{" "}
                    {item.appointment.clinic.city}
                  </strong>
                </div>
                <div>
                  <Trans>Status: </Trans>
                  <strong>
                    <Trans>
                      {item.appointment.isChecked === 0
                        ? "Scheduled"
                        : "Checked-In"}
                    </Trans>
                  </strong>
                </div>
              </div>
            ) : (
              <div
                style={{
                  color: "#800e20",
                  textAlign: "center",
                }}
              >
                {item.numberOfShotDue == 0 ? (
                  <Trans>
                    <strong>Currently vaccinated until due date</strong>
                  </Trans>
                ) : (
                  <Trans>
                    <strong>You have not booked an appointment yet</strong>
                  </Trans>
                )}
              </div>
            )}
          </div>
        </div>
      ));
    } else {
      vacciDue = (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h6>
            <Trans>You have no vaccinations due</Trans>
          </h6>
        </div>
      );
    }
    return (
      <React.Fragment>
        <Container>
          {/* <MedicalServicesIcon fontSize="large" />{" "}
          <strong>
            <Trans>Vaccinations Due</Trans>
          </strong> */}
          <div
            id="scroll"
            style={{
              height: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridAutoRows: "1fr",
              padding: "0",
              width: "90%",
            }}
          >
            {vacciDue}
          </div>
        </Container>
        {/* <pre>{JSON.stringify(this.state, " ", 5)}</pre> */}
      </React.Fragment>
    );
  }
}

export default VaccinationsDue;
