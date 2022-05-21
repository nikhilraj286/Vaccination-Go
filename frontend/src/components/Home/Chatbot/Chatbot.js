import React, { Component } from "react";
import { Container } from "@mui/material";
import { Redirect } from "react-router-dom";
import ChatBot from "react-simple-chatbot";
import { Trans } from "react-i18next";
import icon from "./icon.svg";
import "./Chatbot.css";
import axios from "axios";
import backendServer from "../../../webConfig";
import { getMimicTime } from "./../../Services/ControllerUtils";

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
      steps: [],
    };
  }

  getAppointmentCount = () => {
    if (localStorage.getItem("userData")) {
      let userMrn = JSON.parse(localStorage.getItem("userData")).mrn;
      let currentDate = getMimicTime();
      axios
        .get(
          `${backendServer}/upcomingAppointments/?userMrn=${userMrn}&currentDate=${currentDate}`
        )
        .then((response) => {
          if (response.status === 200) {
            let steps = [
              {
                id: "1",
                message: "Hi!",
                trigger: "start",
              },
              {
                id: "start",
                user: true,
                trigger: "options",
              },
              {
                id: "options",
                message: "What do you want to know about?",
                trigger: "radios",
              },
              {
                id: "radios",
                options: [
                  {
                    value: "Appointments",
                    label: "Appointments",
                    trigger: "AppointmentsInfo",
                  },
                  {
                    value: "Vaccinations",
                    label: "Vaccinations",
                    trigger: "VaccinationsInfo",
                  },
                  { value: "None", label: "None", trigger: "end-message" },
                ],
              },
              {
                id: "AppointmentsInfo",
                message:
                  "You have " +
                  response.data.length +
                  " upcoming appointment(s)",
                trigger: "options",
              },
              {
                id: "VaccinationsInfo",
                message:
                  "Please visit the vaccinations due tab for finding due vaccinations",
                trigger: "options",
              },
              {
                id: "end-message",
                message: "See you later",
                end: true,
              },
            ];
            this.setState({ steps: steps });
          }
        });
    }
  };

  componentDidMount = () => {
    this.getAppointmentCount();
  };

  render() {
    if (localStorage.getItem("userData") === null) {
      return <Redirect to="/" />;
    }
    console.log(this.state);
    return (
      <React.Fragment>
        <div style={{ padding: "35px" }}>
          {this.state.hidden ? "" : <ChatBot steps={this.state.steps} />}
          <div
            style={{
              textAlign: "right",
            }}
          >
            <img
              src={icon}
              style={{
                borderRadius: "50%",
                border: "1px solid #999",
                transform: "scale(0.8)",
                cursor: "pointer",
                background: "#e0e0e0",
                boxShadow: "20px 20px 60px #bebebe,-20px -20px 60px #ffffff",
              }}
              onClick={() => {
                this.setState({
                  hidden: this.state.hidden ? false : true,
                });
                this.getAppointmentCount();
              }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Chatbot;
