import React, { Component } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import backendServer from "../../../webConfig";
import Select from "@material-ui/core/Select";
import { Trans } from "react-i18next";
import { MenuItem } from "@mui/material";
import "./PatientReport.css";

class PatientReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinic: "",
      startDate: "",
      endDate: "",
      appointments: [],
      clinics: [],
      total: 0,
      noShow: 0,
      ratio: 0,
    };
  }
  componentDidMount = () => {
    if (this.isAdmin()) {
      this.getClinics();
    }
  };

  isAdmin = () => {
    return (
      localStorage.getItem("userData") &&
      JSON.parse(localStorage.getItem("userData")).isAdmin
    );
  };

  getClinics = () => {
    axios.get(`${backendServer}/getAllClinics`).then((response) => {
      if (response.status === 200) {
        this.setState({ clinics: response.data });
      }
    });
  };

  isDisabled = () => {
    if (this.state.startDate !== "" && this.state.endDate !== "") {
      if ((this.isAdmin() && this.state.clinic !== "") || !this.isAdmin()) {
        return false;
      }
    }
    return true;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.getReports();
  };

  calculateReport = () => {
    let noShow = 0;
    if (this.state.appointments) {
      this.state.appointments.map((element) => {
        if (element.isChecked === 2) noShow = noShow + 1;
      });
      this.setState({
        total: this.state.appointments.length,
        noShow: noShow,
        ratio:
          this.state.appointments.length > 0
            ? noShow / this.state.appointments.length
            : 0,
      });
      console.log(this.state.appointments);
    }
  };

  getReports = () => {
    if (localStorage.getItem("userData")) {
      if (JSON.parse(localStorage.getItem("userData")).isAdmin) {
        let clinicId = null;
        this.state.clinics.map((element) => {
          if (element.name === this.state.clinic) {
            clinicId = element.id;
          }
        });
        if (clinicId !== null) {
          axios
            .get(
              `${backendServer}/getPatientReportForAdmin/?clinicId=${clinicId}&startDate=${this.state.startDate}&endDate=${this.state.endDate}`
            )
            .then((response) => {
              if (response.status === 200) {
                this.setState({ appointments: response.data, success2: true });
                console.log(this.state.appointments);
                this.calculateReport();
              }
            });
        }
      } else {
        let userMrn = JSON.parse(localStorage.getItem("userData")).mrn;
        axios
          .get(
            `${backendServer}/getPatientReport/?usermrn=${userMrn}&startDate=${this.state.startDate}&endDate=${this.state.endDate}`
          )
          .then((response) => {
            if (response.status === 200) {
              this.setState({ appointments: response.data, success1: true });
              this.calculateReport();
            }
          });
      }
    }
  };
  render() {
    return (
      <>
        <div
          className="reportMain"
          style={{
            display: "flex",
            justifyContent: "space-around",
            maxWidth: "60%",
            margin: "auto",
            marginTop: "100px",
          }}
        >
          {this.isAdmin() ? (
            <div>
              <div>
                <Trans>Select Clinic</Trans>
              </div>
              <div>
                <Select
                  // style={{ width: "inherit" }}
                  value={this.state.clinic}
                  onChange={(e) => {
                    this.setState({ clinic: e.target.value });
                  }}
                >
                  {this.state.clinics.map((element) => (
                    <MenuItem key={element.id} value={element.name}>
                      {element.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
          ) : (
            ""
          )}
          <div>
            <span className="reportSub">
              <Trans>Start date</Trans>
            </span>
            <div>
              <input
                className="form-control"
                type="date"
                id="dateselector"
                defaultValue={this.state.startDate}
                onChange={(e) => {
                  this.setState({
                    startDate: e.target.value,
                  });
                }}
                // placeholder="mm-dd-yyyy"
              />
            </div>
          </div>
          <div>
            <span className="reportSub">
              <Trans>End date</Trans>
            </span>
            <div>
              <input
                className="form-control"
                type="date"
                id="dateselector"
                defaultValue={this.state.endDate}
                onChange={(e) => {
                  this.setState({
                    endDate: e.target.value,
                  });
                }}
                // placeholder="mm-dd-yyyy"
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ color: "#fff" }}>
              <Trans>Submit</Trans>
            </div>
            <Button
              disabled={this.isDisabled()}
              type="submit"
              variant="info"
              onClick={(e) => {
                this.handleSubmit(e);
              }}
            >
              <Trans>Get Reports</Trans>
            </Button>
          </div>
        </div>
        <div
          className="ReportShow"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            maxWidth: "80%",
            margin: "auto",
            marginTop: "100px",
            textAlign: "center",
            fontSize: "21px",
            fontWeight: "700",
          }}
        >
          <div>
            <Trans>Total Appointments</Trans>
          </div>
          <div>
            <Trans>Total No Shows</Trans>
          </div>
          <div>
            <Trans>No Show Rate</Trans>
          </div>
          <div style={{ fontSize: "30px" }}>{this.state.total}</div>
          <div style={{ fontSize: "30px" }}>{this.state.noShow}</div>
          <div style={{ fontSize: "30px" }}>{this.state.ratio.toFixed(2)}</div>
        </div>
      </>
    );
  }
}

export default PatientReport;
