import React, { Component } from "react";
import { Route } from "react-router-dom";
import AddClinic from "./Admin/AddClinic/AddClinic";
import AddDisease from "./Admin/AddDisease/AddDisease";
import AddVaccination from "./Admin/AddVaccination/AddVaccination";
import Appointments from "./Home/Appointments/Appointments";
import Dashboard from "./Home/Dashboard/Dashboard";
import NewAppointment from "./Home/NewAppointment/NewAppointment";
import VaccinationHistory from "./Home/VaccinationHistory/VaccinationHistory";
import VaccinationsDue from "./Home/VaccinationsDue/VaccinationsDue";
import Landing from "./Landing/Landing";
import PasswordReset from "./UserProfile/PasswordReset";
import UserProfile from "./UserProfile/UserProfile";
import Navbar from "./Navbar/Navbar";
import Chatbot from "./Home/Chatbot/Chatbot";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginSuccess: false,
    };
  }

  loginSuccess = () => {
    return new Promise((resolve) => {
      resolve(this.setState({ loginSuccess: true }));
    });
  };

  logout = () => {
    return new Promise((resolve) => {
      resolve(this.setState({ loginSuccess: false }));
    });
  };

  render() {
    console.log(this.state);
    return (
      <React.Fragment>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <Route
            exact
            path="/"
            render={(props) => (
              <Landing
                loginSuccess={this.loginSuccess}
                userLoggedIn={this.state.loginSuccess}
              />
            )}
          />
          {this.state.loginSuccess || localStorage.getItem("userData") ? (
            <div
              style={{
                height: "100vh",
                maxWidth: "1440px",
                minWidth: "1440px",
                maxHeight: "821px",
                minHeight: "821px",
                margin: "auto",
                border: "1px solid #aaa",
                position:"relative"
              }}
            >
              <div style={{ height: "10%", borderBottom: "1px solid #aaa" }}>
                <Navbar
                  logout={this.logout}
                  changeLanguage={this.props.changeLanguage}
                />
              </div>
              <div style={{ height: "90%", maxHeight: "90%" }}>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/addClinic" component={AddClinic} />
                <Route path="/addDisease" component={AddDisease} />
                <Route path="/addVaccination" component={AddVaccination} />
                <Route path="/appointments" component={Appointments} />
                <Route
                  path="/vaccinationHistory"
                  component={VaccinationHistory}
                />
                <Route path="/vaccinationsDue" component={VaccinationsDue} />
                <Route path="/newAppointment" component={NewAppointment} />
                <Route path="/userProfile" component={UserProfile} />
                <Route path="/passwordReset" component={PasswordReset} />
              </div>
              {this.state.loginSuccess || localStorage.getItem("userData") ? (
                <div
                  style={{
                    position: "absolute",
                    zIndex: "10000",
                    bottom: "0",
                    right: "0",
                  }}
                >
                  <Chatbot />
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <Route path="/dashboard" component={Dashboard} />
          )}
        </div>
      </React.Fragment>
    );
  }
}
//Export The Main Component
export default Main;
