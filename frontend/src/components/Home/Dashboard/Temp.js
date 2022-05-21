import React, { Component } from "react";
import VaccinationHistory from "../VaccinationHistory/VaccinationHistory";
import Appointments from "../Appointments/Appointments";
import VaccinationsDue from "../VaccinationsDue/VaccinationsDue";
import PatientReport from "../PatientReport/PatientReport";
import AddClinic from "../../Admin/AddClinic/AddClinic";
import AddDisease from "../../Admin/AddDisease/AddDisease";
import AddVaccination from "../../Admin/AddVaccination/AddVaccination";
import { Redirect } from "react-router";
import "./Dashboard.css";
import Chatbot from "../Chatbot/Chatbot";
import { Trans } from "react-i18next";
import { Card } from "react-bootstrap";

const adminColumns = {
  1: {
    id: 1,
    name: "System Report",
  },
  6: {
    id: 6,
    name: "Add Disease",
  },
  7: {
    id: 7,
    name: "Add Clinic",
  },
  8: {
    id: 8,
    name: "Add Vaccination",
  },
};

const patientColumns = {
  1: {
    id: 1,
    name: "System Report",
  },
  2: {
    id: 2,
    name: "Vaccination History",
  },
  3: {
    id: 3,
    name: "Appointments",
  },
  4: {
    id: 4,
    name: "Vaccinations Due",
  },
  5: {
    id: 5,
    name: "Chat Bot",
  },
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      window: 1,
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
    return (
      <React.Fragment>
        <div style={{ minWidth: "100%" }}>
          <div
            className="leftBar"
            style={{ maxWidth: "15%", width: "15%", minHeight: "100%" }}
          >
            {Object.keys(columnList).map((key, value) => {
              <div
                className={
                  this.state.window === value.id ? "bgColor" : "windows"
                }
                key={value.id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  this.setState({ window: value.id });
                }}
              >
                <Trans>{value.name}</Trans>
              </div>;
            })}
          </div>
          <div style={{ maxWidth: "85%", width: "85%", minHeight: "100%" }}>
            {this.state.window === 1 ? <PatientReport /> : null}
            {this.state.window === 2 ? <VaccinationHistory /> : null}
            {this.state.window === 3 ? <Appointments /> : null}
            {this.state.window === 4 ? <VaccinationsDue /> : null}
            {this.state.window === 5 ? <Chatbot /> : null}
            {this.state.window === 6 ? <AddDisease /> : null}
            {this.state.window === 7 ? <AddClinic /> : null}
            {this.state.window === 8 ? <AddVaccination /> : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

{
  /* <React.Fragment>
        <Card style={{ overflow: "hidden", border: "0" }}>
          <Card.Header className="mb-2 text-muted" style={{ padding: "0" }}>
            <div
              style={{
                margin: "0",
                display: "flex",
                flexGrow: "1",
                flexBasis: "0",
              }}
            >
              <div
                className={this.state.window === 1 ? "bgColor" : "windows"}
                style={{ textAlign: "center", padding: "7px 10px", flex: 1 }}
                onClick={() => {
                  if (this.state.window !== 1) this.setState({ window: 1 });
                }}
              >
                {this.isAdmin() ? (
                  "System Report"
                ) : (
                  <div>
                    <Trans>Patient Report</Trans>
                  </div>
                )}
              </div>
              {!this.isAdmin() && (
                <>
                  <div
                    className={this.state.window === 2 ? "bgColor" : "windows"}
                    style={{
                      textAlign: "center",
                      padding: "7px 10px",
                      flex: 1,
                    }}
                    onClick={() => {
                      if (this.state.window !== 2) this.setState({ window: 2 });
                    }}
                  >
                    {!this.isAdmin() ? (
                      <div>
                        <Trans>Vaccination History</Trans>
                      </div>
                    ) : null}
                  </div>
                  <div
                    className={this.state.window === 3 ? "bgColor" : "windows"}
                    style={{
                      textAlign: "center",
                      padding: "7px 10px",
                      flex: 1,
                    }}
                    onClick={() => {
                      if (this.state.window !== 3) this.setState({ window: 3 });
                    }}
                  >
                    {!this.isAdmin() ? (
                      <div>
                        <Trans>Appointments</Trans>
                      </div>
                    ) : null}
                  </div>
                  <div
                    className={this.state.window === 4 ? "bgColor" : "windows"}
                    style={{
                      textAlign: "center",
                      padding: "7px 10px",
                      flex: 1,
                    }}
                    onClick={() => {
                      if (this.state.window !== 4) this.setState({ window: 4 });
                    }}
                  >
                    <Trans>Vaccinations Due</Trans>
                  </div>
                  <div
                    className={this.state.window === 5 ? "bgColor" : "windows"}
                    style={{
                      textAlign: "center",
                      padding: "7px 10px",
                      flex: 1,
                    }}
                    onClick={() => {
                      if (this.state.window !== 5) this.setState({ window: 5 });
                    }}
                  >
                    <Trans>Chat Bot</Trans>
                  </div>
                </>
              )}
            </div>
          </Card.Header>
          <Card.Body style={{ minHeight: "500px", padding: "0" }}>
            {this.state.window === 1 ? <PatientReport /> : null}
            {this.state.window === 2 ? <VaccinationHistory /> : null}
            {this.state.window === 3 ? <Appointments /> : null}
            {this.state.window === 4 ? <VaccinationsDue /> : null}
            {this.state.window === 5 ? <Chatbot /> : null}
          </Card.Body>
        </Card>
      </React.Fragment> */
}

export default Dashboard;
