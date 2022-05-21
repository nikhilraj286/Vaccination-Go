import React, { Component } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Container } from "@mui/material";
import { Link, Redirect } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import backendServer from "../../../webConfig";
import { getUserProfile, getMimicTime } from "../../Services/ControllerUtils";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import moment from "moment";
import NewAppointment from "../NewAppointment/NewAppointment";
import emailjs from "emailjs-com";
import { init } from "emailjs-com";
// import table from "@material-ui/core/table";
// import tbody from "@material-ui/core/tbody";
// import td from "@material-ui/core/td";
// import TableContainer from "@material-ui/core/TableContainer";
// import thead from "@material-ui/core/thead";
// import tr from "@material-ui/core/tr";
// import Paper from "@material-ui/core/Paper";
import swal from "sweetalert";
import { Trans } from "react-i18next";
import "./Appointments.css";

class Appointments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: "panel1",
      allAppointments: [],
      futureAppointments: [],
      pastAppointments: [],
      cancelledAppointments: [],
      navigateToUpdateAppointment: null,
      window: 1,
    };
  }

  handleCancelAppointment = (appointment) => {
    console.log(appointment);
    var data = {
      appointmentId: appointment.appointmentId,
    };
    axios.post(`${backendServer}/cancelAppointment`, data).then((response) => {
      if (response.status === 200) {
        this.getAppointmentsForUser();
        this.sendEmailToClient(appointment);
      }
    });
  };

  sendEmailToClient(appointment) {
    swal(
      "Success",
      "Appointment cancelled successfully. Please check your cancellation email for additional details",
      "success"
    );
    init("user_VU6t0UaXlMzjO5o6MJQjc");
    let vaccinations = [];
    for (let vacc of appointment.Vaccinations) {
      vaccinations.push(vacc.vaccinationName);
    }
    let data = {
      to_name: getUserProfile().firstName + " " + getUserProfile().lastName,
      clinic_name: appointment.clinic.name,
      vaccination_list: vaccinations.toString(),
      appointment_date: appointment.appointmentDateStr,
      start_time: appointment.appointmentTimeStr,
      to_email: getUserProfile().email,
      status: "cancelled",
    };
    console.log(data);
    emailjs
      .send("service_10aywqh", "template_8ht3awb", data)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  sendCheckInEmailToClient(appointment) {
    // swal(
    //   "Success",
    //   "Appointment checked in successfully. Please check your email for additional details",
    //   "success"
    // );
    init("user_VU6t0UaXlMzjO5o6MJQjc");
    let vaccinations = [];
    for (let vacc of appointment.Vaccinations) {
      vaccinations.push(vacc.vaccinationName);
    }
    let data = {
      to_name: getUserProfile().firstName + " " + getUserProfile().lastName,
      clinic_name: appointment.Clinic.name,
      vaccination_list: vaccinations.toString(),
      appointment_date: appointment.appointmentDateStr,
      start_time: appointment.appointmentTimeStr,
      to_email: getUserProfile().email,
      status: "checked in",
    };
    console.log(data);
    emailjs
      .send("service_10aywqh", "template_8ht3awb", data)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleCheckin = (appointment) => {
    console.log(appointment);
    let userData = getUserProfile();
    let noShowStatus = false;
    if (
      moment(appointment.appointmentDateTime).diff(
        new Date(getMimicTime()),
        "seconds"
      ) < 0
    ) {
      noShowStatus = true;
      swal(
        "Error",
        "Checkin time has expired. Please book another appointment",
        "error"
      );
    }
    var data = {
      user_Id: userData.mrn,
      vaccinations: appointment.Vaccinations,
      appointmentId: appointment.appointmentId,
      checkInDate: getMimicTime(),
      noShow: noShowStatus,
    };
    axios.post(`${backendServer}/checkInAppointment`, data).then((response) => {
      if (response.status === 200) {
        this.sendCheckInEmailToClient(appointment);
        this.getAppointmentsForUser();
      }
    });
  };

  getAppointmentsForUser = () => {
    console.log("Here");
    this.setState({ window: 1 });
    let userData = getUserProfile();
    if (userData != null) {
      axios
        .post(`${backendServer}/getAppointmentsForUser`, {
          mrn: userData.mrn,
          time: new Date(moment(getMimicTime())),
        })
        .then((response) => {
          let cancelled = [];
          let future = [];
          let past = [];
          if (response.status === 200) {
            this.setState({ allAppointments: response.data });
            for (let appointment of response.data) {
              // 0-New 1- checkin , 2- no show, 3 cancelled
              if (appointment.isChecked === 3) {
                cancelled.push(appointment);
              } else if (
                (appointment.isChecked == 0 || appointment.isChecked == 1) &&
                new Date(moment(appointment.appointmentDateTime)) >
                  getMimicTime()
              ) {
                future.push(appointment);
              } else {
                past.push(appointment);
              }
            }
            this.setState({
              cancelledAppointments: cancelled,
              pastAppointments: past,
              futureAppointments: future,
            });
          } else {
            this.setState({
              cancelledAppointments: cancelled,
              pastAppointments: past,
              futureAppointments: future,
            });
          }
        });
    }
  };
  getVaccinationsForTable(list) {
    let l = [];
    for (let item of list) {
      l.push(
        <div>
          <strong style={{ marginRight: "5px" }}>&#8226;</strong>
          {item.vaccinationName}
        </div>
      );
    }
    return l;
  }

  componentDidMount = () => {
    // let date = new Date().today;
    this.getAppointmentsForUser();
  };

  render() {
    console.log("window", this.state.window);
    if (localStorage.getItem("userData") === null) {
      return <Redirect to="/" />;
    }

    return (
      <React.Fragment>
        <div style={{ maxHeight: "10%", height: "10%", display: "flex" }}>
          <div
            className="buttons"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div>
              <Button
                variant={this.state.window === 1 ? "dark" : "outline-dark"}
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ window: 1 });
                }}
              >
                <Trans>Future Appointments</Trans>
              </Button>
            </div>
            <div>
              <Button
                variant={this.state.window === 2 ? "dark" : "outline-dark"}
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ window: 2 });
                }}
              >
                <Trans>Cancelled Appointments</Trans>
              </Button>
            </div>
            <div>
              <Button
                variant={this.state.window === 3 ? "dark" : "outline-dark"}
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ window: 3 });
                }}
              >
                <Trans>Past Appointments</Trans>
              </Button>
            </div>
            <div>
              <Button
                variant="success"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ window: 4 });
                }}
              >
                <Trans>New Appointment</Trans>
              </Button>
            </div>
          </div>
        </div>
        <div
          id="scroll"
          style={{
            maxHeight: "90%",
            height: "90%",
            maxWidth: "90%",
            overflow: "scroll",
            paddingBottom: "30px",
          }}
        >
          {this.state.window === 1 ? (
            this.state.futureAppointments.length > 0 ? (
              <table aria-label="simple table">
                <thead>
                  <tr>
                    <td>
                      <Trans>Appointment Date</Trans>
                    </td>
                    <td>
                      <Trans>Appointment Time</Trans>
                    </td>
                    <td>
                      <Trans>Clinic</Trans>
                    </td>
                    <td>
                      <Trans>Address</Trans>
                    </td>
                    <td>
                      <Trans>Vaccinations</Trans>
                    </td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.futureAppointments.map((row) => (
                    <tr key={row.appointmentId}>
                      <td>{row.appointmentDateStr}</td>
                      <td>{row.appointmentTimeStr}</td>
                      <td>{row.Clinic.name}</td>
                      <td>{row.Clinic.street + " " + row.Clinic.city}</td>
                      <td>{this.getVaccinationsForTable(row.Vaccinations)}</td>
                      <td>
                        {!row.isChecked ? (
                          <>
                            <div>
                              <Button
                                variant="outline-success"
                                onClick={(e) => this.handleCheckin(row)}
                                disabled={
                                  moment(row.appointmentDateTime).diff(
                                    new Date(getMimicTime()),
                                    "seconds"
                                  ) > 86400
                                }
                              >
                                <Trans>Check In</Trans>
                              </Button>
                            </div>
                            <div style={{ marginTop: "10px" }}>
                              <Button
                                style={{ marginLeft: "10px" }}
                                variant="outline-danger"
                                onClick={(e) =>
                                  this.handleCancelAppointment(row)
                                }
                              >
                                <i class="fa fa-window-close"></i>
                              </Button>
                              <Button
                                style={{ margin: "0 10px" }}
                                variant="outline-danger"
                                onClick={(e) =>
                                  this.setState({
                                    navigateToUpdateAppointment: row,
                                    window: 4,
                                  })
                                }
                              >
                                <i class="fa fa-edit"></i>
                              </Button>
                            </div>
                          </>
                        ) : (
                          <Button variant="primary" disabled>
                            <Trans>Checked In</Trans>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  fontSize: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Trans>No Active Future Appointments</Trans>
              </div>
            )
          ) : (
            ""
          )}
          {this.state.window === 2 ? (
            this.state.cancelledAppointments.length > 0 ? (
              <table aria-label="simple table">
                <thead>
                  <tr>
                    <td>
                      <Trans>Appointment Date</Trans>
                    </td>
                    <td>
                      <Trans>Appointment Time</Trans>
                    </td>
                    <td>
                      <Trans>Clinic</Trans>
                    </td>
                    <td>
                      <Trans>Address</Trans>
                    </td>
                    <td>
                      <Trans>Vaccinations</Trans>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.cancelledAppointments.map((row) => (
                    <tr key={row.appointmentId}>
                      <td>{row.appointmentDateStr}</td>
                      <td>{row.appointmentTimeStr}</td>
                      <td>{row.Clinic.name}</td>
                      <td>{row.Clinic.street + " " + row.Clinic.city}</td>
                      <td>{this.getVaccinationsForTable(row.Vaccinations)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  fontSize: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Trans>No Active Cancelled Appointments</Trans>
              </div>
            )
          ) : (
            ""
          )}
          {this.state.window === 3 ? (
            this.state.pastAppointments.length > 0 ? (
              <table aria-label="simple table">
                <thead>
                  <tr>
                    <td>
                      <Trans>Appointment Date</Trans>
                    </td>
                    <td>
                      <Trans>Appointment Time</Trans>
                    </td>
                    <td>
                      <Trans>Clinic</Trans>
                    </td>
                    <td>
                      <Trans>Address</Trans>
                    </td>
                    <td>
                      <Trans>Vaccinations</Trans>
                    </td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.pastAppointments.map((row) => (
                    <tr key={row.appointmentId}>
                      <td>{row.appointmentDateStr}</td>
                      <td>{row.appointmentTimeStr}</td>
                      <td>{row.Clinic.name}</td>
                      <td>{row.Clinic.street + " " + row.Clinic.city}</td>
                      <td>{this.getVaccinationsForTable(row.Vaccinations)}</td>
                      <td>
                        {row.isChecked === 1 ? (
                          <Button disabled variant="outline-success">
                            <Trans>Completed</Trans>
                          </Button>
                        ) : (
                          <Button disabled variant="outline-warning">
                            <Trans>No Show</Trans>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  fontSize: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Trans>No Active Past Appointments</Trans>
              </div>
            )
          ) : (
            ""
          )}
          {this.state.window === 4 ? (
            <NewAppointment
              data={this.state.navigateToUpdateAppointment}
              getAppointmentsForUser={this.getAppointmentsForUser}
            />
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default Appointments;

{
  /* <div>
<Accordion
            square
            expanded={this.state.expanded === "panel1"}
            onChange={(e) => {
              this.setState({ expanded: "panel1" });
            }}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography>
                <Trans>Future Appointments</Trans>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {this.state.futureAppointments.length > 0 ? (
                
                  <table aria-label="simple table">
                    <thead>
                      <tr>
                        <td>
                          <Trans>Appointment Date</Trans>
                        </td>
                        <td>
                          <Trans>Appointment Time</Trans>
                        </td>
                        <td>
                          <Trans>Clinic</Trans>
                        </td>
                        <td>
                          <Trans>Address</Trans>
                        </td>
                        <td>
                          <Trans>Vaccinations</Trans>
                        </td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.futureAppointments.map((row) => (
                        <tr key={row.appointmentId}>
                          <td>{row.appointmentDateStr}</td>
                          <td>{row.appointmentTimeStr}</td>
                          <td>{row.Clinic.name}</td>
                          <td>
                            {row.Clinic.street + " " + row.Clinic.city}
                          </td>
                          <td>
                            {this.getVaccinationsForTable(row.Vaccinations)}
                          </td>
                          <td>
                            {!row.isChecked ? (
                              <>
                                <Button
                                  variant="outline-success"
                                  onClick={(e) => this.handleCheckin(row)}
                                  disabled={
                                    moment(row.appointmentDateTime).diff(
                                      new Date(getMimicTime()),
                                      "seconds"
                                    ) > 86400
                                  }
                                >
                                  <Trans>Check In</Trans>
                                </Button>
                                <Button
                                  style={{ marginLeft: "10px" }}
                                  variant="outline-danger"
                                  onClick={(e) =>
                                    this.handleCancelAppointment(row)
                                  }
                                >
                                  <i class="fa fa-window-close"></i>
                                </Button>
                                <Button
                                  style={{ margin: "0 10px" }}
                                  variant="outline-danger"
                                  onClick={(e) =>
                                    this.setState({
                                      navigateToUpdateAppointment: row,
                                    })
                                  }
                                >
                                  <i class="fa fa-edit"></i>
                                </Button>
                              </>
                            ) : (
                              <Button variant="primary" disabled>
                                <Trans>Checked In</Trans>
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                
              ) : (
                "No Active Future Appointments"
              )}
            </AccordionDetails>
</Accordion>
<Accordion
  square
  expanded={this.state.expanded === "panel2"}
  onChange={(e) => {
    this.setState({ expanded: "panel2" });
  }}
>
  <AccordionSummary
    aria-controls="panel2d-content"
    id="panel2d-header"
  >
    <Typography>
      <Trans>Cancelled Appointments</Trans>
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    {this.state.cancelledAppointments.length > 0 ? (
      
        <table aria-label="simple table">
          <thead>
            <tr>
              <td>
                <Trans>Appointment Date</Trans>
              </td>
              <td>
                <Trans>Appointment Time</Trans>
              </td>
              <td>
                <Trans>Clinic</Trans>
              </td>
              <td>
                <Trans>Address</Trans>
              </td>
              <td>
                <Trans>Vaccinations</Trans>
              </td>
            </tr>
          </thead>
          <tbody>
            {this.state.cancelledAppointments.map((row) => (
              <tr key={row.appointmentId}>
                <td>{row.appointmentDateStr}</td>
                <td>{row.appointmentTimeStr}</td>
                <td>{row.Clinic.name}</td>
                <td>
                  {row.Clinic.street + " " + row.Clinic.city}
                </td>
                <td>
                  {this.getVaccinationsForTable(row.Vaccinations)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      
    ) : (
      <Trans>No Active Cancelled Appointments</Trans>
    )}
  </AccordionDetails>
</Accordion>
<Accordion
  square
  expanded={this.state.expanded === "panel3"}
  onChange={(e) => {
    this.setState({ expanded: "panel3" });
  }}
>
  <AccordionSummary
    aria-controls="panel3d-content"
    id="panel3d-header"
  >
    <Typography>
      <Trans>Past Appointments</Trans>
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    {this.state.pastAppointments.length > 0 ? (
      
        <table aria-label="simple table">
          <thead>
            <tr>
              <td>
                <Trans>Appointment Date</Trans>
              </td>
              <td>
                <Trans>Appointment Time</Trans>
              </td>
              <td>
                <Trans>Clinic</Trans>
              </td>
              <td>
                <Trans>Address</Trans>
              </td>
              <td>
                <Trans>Vaccinations</Trans>
              </td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {this.state.pastAppointments.map((row) => (
              <tr key={row.appointmentId}>
                <td>{row.appointmentDateStr}</td>
                <td>{row.appointmentTimeStr}</td>
                <td>{row.Clinic.name}</td>
                <td>
                  {row.Clinic.street + " " + row.Clinic.city}
                </td>
                <td>
                  {this.getVaccinationsForTable(row.Vaccinations)}
                </td>
                <td>
                  {row.isChecked === 1 ? (
                    <Button disabled variant="outline-success">
                      <Trans>Completed</Trans>
                    </Button>
                  ) : (
                    <Button disabled variant="outline-warning">
                      <Trans>No Show</Trans>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      
    ) : (
      "No Active Future Appointments"
    )}
  </AccordionDetails>
</Accordion>
</div> */
}
