import React, { Component } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Container } from "@mui/material";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { TablePagination } from "@material-ui/core";
// import { Link } from "react-router-dom";
import { Link, Redirect } from "react-router-dom";
import {
  Col,
  Row,
  // Button
} from "react-bootstrap";
import axios from "axios";
import backendServer from "../../../webConfig";
// import Select from "@material-ui/core/Select";
// import { Checkbox, ListItemText, MenuItem } from "@material-ui/core";
import Navbar from "./../../Navbar/Navbar";
import { getUserProfile, getMimicTime } from "../../Services/ControllerUtils";
import { Trans } from "react-i18next";
import moment from "moment";
import "./VaccinationHistory.css";

class VaccinationHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: "panel1",
      vaccinationData: [],
      page: 0,
      size: 2,
      count: 0,
    };
  }

  componentDidMount() {
    this.getAllVaccinations();
    this.getVaccinationHistory(this.state.page, this.state.size);
  }

  getAllVaccinations() {
    let user_mrn = 0;
    if (getUserProfile()) {
      user_mrn = getUserProfile().mrn;
    }
    axios
      .get(`${backendServer}/getAllVaccinations/${user_mrn}`)
      .then((result) => {
        this.setState({
          vaccinationData: result.data,
          vaccinationError: false,
        });
        console.log(
          "response data from getTotalVaccinationsinRepo",
          this.state.vaccinationData
        );
      })
      .catch((err) => {
        this.setState({ vaccinationData: [], vaccinationError: true });
      });
  }

  getVaccinationHistory(page, size) {
    let user_mrn = "";
    if (getUserProfile()) user_mrn = getUserProfile().mrn;
    axios
      .get(
        `${backendServer}/getCheckedInHistory/?user_mrn=${user_mrn}&isChecked=1&page=${page}&size=${size}`
      )
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          this.setState({
            checkedInAppointments: response.data.rows,
            count: response.data.count,
            vaccinationHistoryError: false,
          });
          console.log(
            "response data from getCheckedInHistory",
            this.state.checkedInAppointments
          );
        }
      })
      .catch((error) => {
        console.log("error:", error);
        this.setState({
          checkedInAppointments: [],
          vaccinationHistoryError: true,
        });
      });
  }

  PageSizeChange = (e) => {
    this.setState({
      size: Number(e.target.value),
      page: 0,
    });
    this.getVaccinationHistory(0, Number(e.target.value));
  };

  PageChange = (e, page) => {
    this.setState({
      page: Number(page),
    });
    this.getVaccinationHistory(Number(page), this.state.size);
  };

  render() {
    let len = this.state.vaccinationData.length;
    let shotCount = new Array(len + 1);
    for (let i = 0; i < shotCount.length; i++) {
      shotCount[i] = 0;
    }

    if (localStorage.getItem("userData") === null) {
      return <Redirect to="/" />;
    }
    let vacciHistory = (<h6>
      <Trans>You have not taken any vaccines yet</Trans>
    </h6>);
    //&&new Date(moment(this.state.checkedInAppointments.appointmentDateTime)) <getMimicTime()
    if (this.state && this.state.checkedInAppointments && this.state.checkedInAppointments.length>0) {
      console.log(this.state.checkedInAppointments);
      vacciHistory = this.state.checkedInAppointments.map((item) => (
        <div
          key={item.appointmentId}
          style={{
            border: "1px solid #bbb",
            borderRadius: "15px",
            padding: "10px 50px",
            margin: "10px",
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
          }}
        >
          <div
            className="clinicDetails"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              class="grid"
              style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}
            >
              <div>
                <strong>
                  <Trans>Clinic Name</Trans>:
                </strong>
              </div>
              <div>{item.Clinic.name}</div>
              <div>
                <strong>
                  <Trans>Clinic Address</Trans>:
                </strong>
              </div>
              <div>
                {item.Clinic.street}, {item.Clinic.city}
              </div>
              <div>
                <strong>
                  <Trans>Appointment Time</Trans>:
                </strong>
              </div>
              <div>
                {item.appointmentDateStr}, {item.appointmentTimeStr}
              </div>
            </div>
          </div>

          <div className="vaccinationDetails">
            <strong style={{ textDecoration: "underline" }}>
              <Trans>Vaccinations taken</Trans>
            </strong>
            <div>
              {item.Vaccinations && item.Vaccinations.length > 0 ? (
                item.Vaccinations.map((elem) => (
                  <div key={elem.vaccinationId}>
                    <div
                      style={{
                        padding: "5px 0 0 25px",
                        margin: "0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <strong style={{ marginRight: "5px" }}>&#8226;</strong>
                      <strong style={{ marginRight: "5px" }}>
                        {elem.vaccinationName}
                      </strong>
                      <div
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        (Total shots: {elem.numberOfShots})
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <small>
                  <Trans>No vaccinations mapped</Trans>
                </small>
              )}
            </div>
          </div>
        </div>
      ));
    } 

    return (
      <React.Fragment>
        <div style={{ maxHeight: "10%", height: "10%" }}>
          {this.state.checkedInAppointments && this.state.checkedInAppointments.length>0 && <div style={{ display: "flex", justifyContent: "left" }}>
            <TablePagination
              count={this.state.count}
              page={this.state.page}
              onChangePage={this.PageChange}
              rowsPerPage={this.state.size}
              onChangeRowsPerPage={this.PageSizeChange}
              variant="outlined"
              color="primary"
              rowsPerPageOptions={[2, 5, 10]}
              style={{ padding: "0", width: "35%", border: "none" }}
            />
          </div>}
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
          {vacciHistory}
        </div>
      </React.Fragment>
    );
  }
}

export default VaccinationHistory;
