import React, { Component } from "react";
import VaccinationHistory from "../VaccinationHistory/VaccinationHistory";
import Appointments from "../Appointments/Appointments";
import VaccinationsDue from "../VaccinationsDue/VaccinationsDue";
import PatientReport from "../PatientReport/PatientReport";
import AddClinic from "../../Admin/AddClinic/AddClinic";
import AddDisease from "../../Admin/AddDisease/AddDisease";
import AddVaccination from "../../Admin/AddVaccination/AddVaccination";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TextField } from "@mui/material";
import moment from "moment";
import Clock from "react-live-clock";
import {
  getMimicTime,
  asyncLocalStorage,
} from "../../Services/ControllerUtils";
import { Redirect } from "react-router";
import "./Dashboard.css";
import Chatbot from "../Chatbot/Chatbot";
import { Trans } from "react-i18next";

const adminColumns = {
  4: {
    id: 4,
    name: "Add Vaccination",
  },
  5: {
    id: 5,
    name: "Add Clinic",
  },
  6: {
    id: 6,
    name: "Add Disease",
  },
  7: {
    id: 7,
    name: "System Report",
  },
};

const patientColumns = {
  1: {
    id: 1,
    name: "Appointments",
  },
  2: {
    id: 2,
    name: "Vaccination History",
  },
  3: {
    id: 3,
    name: "Vaccinations Due",
  },
  7: {
    id: 7,
    name: "Patient Report",
  },
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    let maxDate = new Date(moment().add(1, "year"));
    this.state = {
      window: this.isAdmin() ? 4 : 1,
      localTime: new Date(new Date(moment())),
      currentTime: getMimicTime(),
      maxDate: maxDate,
    };
  }

  isAdmin = () => {
    return (
      localStorage.getItem("userData") &&
      JSON.parse(localStorage.getItem("userData")).isAdmin
    );
  };

  render() {
    if (localStorage.getItem("userData") === null) {
      return <Redirect to="/" />;
    }
    let columnList = this.isAdmin() ? adminColumns : patientColumns;
    let columns = Object.keys(columnList).map((key) => {
      let value = columnList[key];
      console.log(key, value);
      return (
        <div
          className={this.state.window === value.id ? "bgColor" : "windows"}
          key={value.id}
          style={{ cursor: "pointer" }}
          onClick={() => {
            this.setState({ window: value.id });
          }}
        >
          <Trans>{value.name}</Trans>
        </div>
      );
    });
    let mimicTime = (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div style={{ padding: "20px 0 0 0", textAlign: "center" }}>
          <DatePicker
            label="GLOBAL DATE"
            value={this.state.currentTime}
            onChange={async (e) => {
              asyncLocalStorage.setItem("time", e);
              await this.setState({ currentTime: e });
              window.location.reload();
            }}
            renderInput={(params) => <TextField {...params} />}
            minDate={new Date()}
            maxDate={this.state.maxDate}
          />
        </div>
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              textAlign: "center",
              gridRowGap: "10px",
              padding: "15px 7px",
            }}
          >
            <div>
              <Trans>Global Time</Trans>:
            </div>
            <div>
              {moment(this.state.currentTime).format("MMM Do YYYY")}{" "}
              <Clock format={"HH:mm"} ticking={true} timezone={"US/Pacific"} />
            </div>
            <div>
              <Trans>Local Time</Trans>:
            </div>
            <div>
              {moment(this.state.localTime).format("MMM Do YYYY")}{" "}
              <Clock format={"HH:mm"} ticking={true} timezone={"US/Pacific"} />
            </div>
          </div>
        </div>
      </LocalizationProvider>
    );
    console.log(columns);
    return (
      <React.Fragment>
        <div style={{ minWidth: "100%", height: "100%", display: "flex" }}>
          <div
            className="leftBar"
            style={{
              maxWidth: "21%",
              width: "21%",
              minHeight: "100%",
              borderRight: "1px solid #aaa",
            }}
          >
            <div className="columns">{columns}</div>
            <div className="mimicTime" style={{ borderTop: "1px solid #aaa" }}>
              {mimicTime}
            </div>
          </div>
          <div
            style={{
              maxWidth: "79%",
              width: "79%",
              minHeight: "100%",
              overflow: "scroll",
            }}
          >
            {this.state.window === 1 && (
              <Appointments currentTime={this.state.currentTime} />
            )}
            {this.state.window === 2 && (
              <VaccinationHistory currentTime={this.state.currentTime} />
            )}
            {this.state.window === 3 && (
              <VaccinationsDue currentTime={this.state.currentTime} />
            )}
            {this.state.window === 4 && <AddVaccination />}
            {this.state.window === 5 && <AddClinic />}
            {this.state.window === 6 && <AddDisease />}
            {this.state.window === 7 && <PatientReport />}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
