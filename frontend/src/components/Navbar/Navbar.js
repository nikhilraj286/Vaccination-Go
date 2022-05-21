import React, { Component } from "react";
import { Col, Container, Nav, Row, NavDropdown } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { DatePicker } from "@mui/lab";
import { Link, Redirect } from "react-router-dom";
import { TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import moment from "moment";
import Clock from "react-live-clock";
import { getMimicTime, asyncLocalStorage } from "../Services/ControllerUtils";
import logo from "./logo.svg";
import { withTranslation, Trans, useTranslation } from "react-i18next";

class NavigationBar extends Component {
  constructor(props) {
    let maxDate = new Date(moment().add(1, "year"));
    super(props);
    this.state = {
      isAdmin: false,
      localTime: new Date(new Date(moment())),
      currentTime: getMimicTime(),
      maxDate: maxDate,
      signOut: false,
    };
  }
  signOut = async () => {
    localStorage.clear();
    await this.props.logout();
    // window.location.reload();
    // this.setState({ signOut: true });
  };
  render() {
    if (this.state.signOut) {
      return <Redirect to="/" />;
    }

    return (
      <div
        style={{
          // borderBottom: "2px solid grey",
          margin: "0",
          width: "100%",
          maxWidth: "100%",
          padding: "0px 30px",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div id="div1">
            <Link to="/dashboard">
              <div style={{ cursor: "pointer", display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "25px",
                      paddingTop: "16px",
                      color: "grey",
                      textDecoration: "none",
                    }}
                  >
                    <img src={logo} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              id="div4"
              className="changeLang"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                marginRight: "70px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Trans>Switch Languages</Trans> : 
              </div>
              <div
                style={{
                  fontSize: "30px",
                  marginLeft: "5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "70px",
                }}
              >
                <span onClick={() => this.props.changeLanguage("en")}>
                  {" "}
                  🇺🇸{" "}
                </span>
                <span onClick={() => this.props.changeLanguage("fr")}>
                  {" "}
                  🇫🇷{" "}
                </span>
              </div>
            </div>
            <div
              id="div5"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginRight: "70px",
                fontWeight: "700",
              }}
            >
              {localStorage.getItem("userData") &&
              JSON.parse(localStorage.getItem("userData")).isAdmin ? (
                <span style={{ color: "red" }}>
                  <Trans>ADMIN</Trans>
                </span>
              ) : (
                <span style={{ color: "green" }}>
                  <Trans>PATIENT</Trans>
                </span>
              )}
            </div>
            <div
              id="div6"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginRight: "45px",
                fontWeight: "700",
                fontSize: "24px",
              }}
            >
              <NavDropdown
                // style={{ paddingTop: "10px" }}
                id="nav-dropdown-dark-example"
                title={
                  localStorage.getItem("userData")
                    ? `${
                        JSON.parse(localStorage.getItem("userData")).firstName
                      } ${
                        JSON.parse(localStorage.getItem("userData")).lastName
                      }`
                    : ""
                }
                menuVariant="dark"
              >
                <NavDropdown.Item>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "#000",
                      fontSize: "20px",
                    }}
                    to="/userProfile"
                  >
                    <Trans>User Profile</Trans>
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item 
                    onClick={() => {
                      this.signOut();
                    }}>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "#000",
                      fontSize: "20px",
                    }}
                    to="/"
                  >
                    <Trans>Log Out</Trans>
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NavigationBar;
