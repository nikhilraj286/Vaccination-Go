import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import backendServer from "../../webConfig";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import { asyncLocalStorage } from "../Services/ControllerUtils";
import { Trans } from "react-i18next";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signIn: false,
      user: null,
      allEmails: [],
      logInFlag: true,
      newUser: false,
    };
  }

  componentDidMount = () => {
    this.getAllUsers();
  };

  getAllUsers = () => {
    axios.get(`${backendServer}/allEmails`).then((response) => {
      this.setState({ allEmails: response.data });
    });
  };

  getUser = () => {
    axios
      .get(
        `${backendServer}/getUser/${this.state.user.additionalUserInfo.profile.email}`
      )
      .then(async (response) => {
        if (response.status === 200) {
          console.log(response.data);
          let responseUser = {
            mrn: response.data.mrn,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            isAdmin: response.data.admin,
          };
          console.log(responseUser);
          await asyncLocalStorage.setItem(
            "userData",
            JSON.stringify(responseUser)
          );
          this.getAllUsers();
          this.setState({
            isSuccess: true,
            loginError: "",
          });
          // window.location.reload();
        }
      });
  };

  proceedWithSignUp = () => {
    if (
      !this.state.newUser &&
      this.state.signIn &&
      this.state.user.user.emailVerified
    ) {
      let emailId = this.state.user.additionalUserInfo.profile.email;
      let user = {
        email: emailId,
        password: "",
        firstName: this.state.user.additionalUserInfo.profile.given_name,
        middleName: "",
        lastName: this.state.user.additionalUserInfo.profile.family_name,
        dob: new Date().toDateString(),
        gender: "Male",
        verified: true,
        admin:
          emailId.substring(emailId.indexOf("@")) === "@sjsu.edu"
            ? true
            : false,
        address: {
          street: "",
          aptNo: "",
          city: "San Jose",
          state: "CA",
          zipcode: 95110,
        },
      };
      console.log(user);
      axios.post(`${backendServer}/signup`, user).then(async (response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data);
          let responseUser = {
            mrn: response.data.mrn,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            isAdmin: response.data.admin,
          };
          asyncLocalStorage.setItem("userData", JSON.stringify(responseUser));
          // localStorage.setItem("newUser", true);
          this.getAllUsers();
          this.setState({
            isSuccess: true,
            loginError: "",
          });
          // window.location.reload();
        }
      });
    }
  };

  signOut = () => {
    this.setState({ signIn: false, user: null });
    localStorage.clear();
  };

  render = () => {
    if (
      (this.props && this.props.userLoggedIn) ||
      localStorage.getItem("userData")
    ) {
      return <Redirect to="/dashboard" />;
    }
    console.log(this.state);
    console.log(this.props);
    console.log(localStorage.getItem("userData"));

    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this.state.logInFlag ? (
            <>
              <Login loginSuccess={this.props.loginSuccess} />
              <div style={{ display: "flex", alignItems: "center" }}>
                <Trans>Don't have an account?</Trans>{" "}
                <div
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    marginLeft: "10px",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                  onClick={() => this.setState({ logInFlag: false })}
                >
                  <Trans>Sign Up</Trans>
                </div>
              </div>
            </>
          ) : (
            <>
              <SignUp
                loginSuccess={this.props.loginSuccess}
                allEmails={this.state.allEmails}
              />
              <div style={{ display: "flex", alignItems: "center" }}>
                <Trans>Already have an account?</Trans>{" "}
                <div
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    marginLeft: "10px",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                  onClick={() => this.setState({ logInFlag: true })}
                >
                  <Trans>Sign In</Trans>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };
}

export default Landing;
