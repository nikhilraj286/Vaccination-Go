import React, { Component } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { Form, FormGroup, Label, Input, ButtonGroup } from "reactstrap";
import backendServer from "../../webConfig";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { asyncLocalStorage } from "../Services/ControllerUtils";
import moment from "moment";
import { Trans } from "react-i18next";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      gender: 1,
      dob: "",
      street: "",
      aptNo: "",
      city: "",
      state: "",
      zipcode: "",
      signInFailed: false,
      pageOne: true,
      emailExists: false,
      maxDate: new Date(moment()),
      disableSignIn: false,
    };
  }

  //   handleSubmit = (e) => {
  //     e.preventDefault();
  //     if (this.props.allEmails.contains(this.state.email)) {
  //       this.setState({ emailExists: true });
  //     } else {
  //       let data = { ...this.state };
  //       this.setState({
  //         firstName: "",
  //         middleName: "",
  //         lastName: "",
  //         email: "",
  //         password: "",
  //         gender: 1,
  //         dob: "",
  //         street: "",
  //         number: "",
  //         city: "",
  //         state: "",
  //         zipcode: "",
  //       });
  //       console.log(data);
  //     }
  //     //SignUp
  //   };

  SubmitToDB = async (e) => {
    e.preventDefault();
    if (!this.props.allEmails.includes(this.state.email)) {
      let gender = "Male";
      if (this.state.gender !== 1)
        gender = this.state.gender === 2 ? "Female" : "Other";
      let user = {
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        middleName: this.state.middleName,
        lastName: this.state.lastName,
        dob: this.state.dob,
        gender: gender,
        verified: true,
        admin:
          this.state.email.substring(this.state.email.indexOf("@")) ===
          "@sjsu.edu"
            ? true
            : false,

        street: this.state.street,
        aptNo: this.state.aptNo,
        city: this.state.city,
        state: this.state.state,
        zipcode: this.state.zipcode,
      };
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
          asyncLocalStorage
            .setItem("userData", JSON.stringify(responseUser))
            .then(async () => {
              await this.props.loginSuccess();
            });
          this.setState({
            success: true,
            loginError: "",
            newUser: true,
          });
          // window.location.reload();
        }
      });
    } else {
      this.setState({ emailExists: true });
    }
  };

  render = () => {
    console.log(this.state);
    console.log(this.props);
    if (this.state.success) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <>
        <div
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "25px",
          }}
        >
          <Trans>Sign Up</Trans>
        </div>

        <Form
          onSubmit={(e) => this.SubmitToDB(e)}
          className="form-stacked"
          style={{ width: "1200px", textAlign: "center" }}
        >
          <Row>
            <Col>
              <FormGroup>
                <Label for="name">
                  <Trans>Full Name</Trans>
                </Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChange={(e) => this.setState({ firstName: e.target.value })}
                  required
                ></Input>
                <Input
                  type="text"
                  placeholder="Middle Name (Optional)"
                  value={this.state.middleName}
                  onChange={(e) =>
                    this.setState({ middleName: e.target.value })
                  }
                ></Input>
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={this.state.lastName}
                  onChange={(e) => this.setState({ lastName: e.target.value })}
                  required
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label for="email">
                  <Trans>Email Address</Trans>
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  required
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label for="password">
                  <Trans>Password</Trans>
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  minlength="8"
                  onChange={(e) => this.setState({ password: e.target.value })}
                  required
                ></Input>
                {this.state.password.length > 0 &&
                this.state.password.length < 8 ? (
                  <div style={{ fontSize: "12px" }}>
                    <Trans>Password must be atleast 8 characters</Trans>
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="gender">
                      <Trans>Gender</Trans>
                    </Label>
                    <br />
                    <ButtonGroup required>
                      <Button
                        variant="outline-info"
                        name="gender"
                        value="1"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({ gender: 1 });
                        }}
                        active={Number(this.state.gender) === 1}
                      >
                        <Trans>Male</Trans>
                      </Button>
                      <Button
                        variant="outline-info"
                        name="gender"
                        value="2"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({ gender: 2 });
                        }}
                        active={Number(this.state.gender) === 2}
                      >
                        <Trans>Female</Trans>
                      </Button>
                      <Button
                        variant="outline-info"
                        name="gender"
                        value="3"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({ gender: 3 });
                        }}
                        active={Number(this.state.gender) === 3}
                      >
                        <Trans>Other</Trans>
                      </Button>
                    </ButtonGroup>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="dob">
                      <Trans>Date of Birth</Trans>
                    </Label>
                    <Input
                      type="date"
                      id="dob"
                      name="dob"
                      max={this.state.maxDate}
                      value={this.state.dob}
                      onChange={(e) => {
                        this.setState({ dob: e.target.value });
                      }}
                      required
                    ></Input>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label htmlFor="address">
                  <Trans>Address</Trans>
                </Label>
                <Input
                  type="text"
                  id="street"
                  name="street"
                  placeholder="Street"
                  value={this.state.street}
                  onChange={(e) => {
                    this.setState({ street: e.target.value });
                  }}
                  required
                ></Input>
                <Input
                  type="text"
                  id="number"
                  name="number"
                  placeholder="Apt Number (Optional)"
                  value={this.state.aptNo}
                  onChange={(e) => {
                    this.setState({ aptNo: e.target.value });
                  }}
                ></Input>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  value={this.state.city}
                  onChange={(e) => {
                    this.setState({ city: e.target.value });
                  }}
                  required
                ></Input>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  placeholder="State"
                  value={this.state.state}
                  onChange={(e) => {
                    this.setState({ state: e.target.value });
                  }}
                  required
                ></Input>
                <Input
                  type="number"
                  id="zipcode"
                  name="zipcode"
                  placeholder="Zip Code"
                  min="0"
                  value={this.state.zipcode}
                  onChange={(e) => {
                    this.setState({ zipcode: e.target.value });
                  }}
                  required
                ></Input>
              </FormGroup>
            </Col>
            <FormGroup>
              <Button
                type="submit"
                disabled={this.state.disableSignIn}
                variant="info"
                style={{ width: "200px" }}
              >
                <Trans>Sign Me Up</Trans>
              </Button>
            </FormGroup>
          </Row>
        </Form>
        {this.state.signInFailed ? (
          <Alert variant="warning">
            <Trans>Email or Password incorrect. Please try again</Trans>
          </Alert>
        ) : (
          ""
        )}
        {this.state.emailExists ? (
          <Alert variant="warning">
            <Trans>Email already exists. Try again</Trans>
          </Alert>
        ) : null}
      </>
    );
  };
}

export default SignUp;
