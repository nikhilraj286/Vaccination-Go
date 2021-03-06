import React, { Component } from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import backendServer from "../../webConfig";
import { Trans } from "react-i18next";

class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirm: null,
      alert: true,
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    if (localStorage.getItem("userData") && this.state.password.length >= 8) {
      let user = JSON.parse(localStorage.getItem("userData"));
      axios
        .post(
          `${backendServer}/updatePassword/?mrn=${user.mrn}&password=${this.state.password}`
        )
        .then(async (response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            console.log(response.data);
            localStorage.removeItem("newUser");
            this.setState({ alert: false, success: true });
            // window.location.reload();
          }
        });
    }
  };

  render = () => {
    let newUser = localStorage.getItem("newUser");
    if (newUser === null || (newUser !== null && !newUser)) {
      return <Redirect to="/dashboard" />;
    }
    let username = null;
    if (localStorage.getItem("userData")) {
      username = JSON.parse(localStorage.getItem("userData")).firstName;
    }
    return (
      <div style={{ paddingTop: "200px" }}>
        <Container style={{ width: "25%", margin: "auto" }}>
          {/* <pre>{JSON.stringify(this.state, "", 2)}</pre> */}
          <div>
          <Trans>Hello</Trans>{username}. <Trans> Since you are a new user, reset password to
            continue</Trans>
          </div>
          <Form onSubmit={(e) => this.handleSubmit(e)} className="form-stacked">
            <FormGroup>
              <Label for="password"><Trans>Enter new Password</Trans></Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
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
            <FormGroup>
              <Label for="Confirm"><Trans>Confirm Password</Trans></Label>
              <Input
                type="password"
                id="Confirm"
                name="Confirm"
                placeholder="Confirm Password"
                value={this.state.confirm}
                onChange={(e) => this.setState({ confirm: e.target.value })}
                required
              ></Input>
            </FormGroup>
            <FormGroup>
              {this.state.password &&
              this.state.confirm &&
              this.state.password !== this.state.confirm &&
              this.state.alert ? (
                <Alert variant="danger"><Trans>Passwords do not match</Trans></Alert>
              ) : null}
              {/* {this.state.password &&
              this.state.confirm &&
              this.state.password === this.state.confirm &&
              this.state.alert ? (
                <Alert variant="success">Passwords match</Alert>
              ) : null} */}
              {this.state.success ? (
                <Alert variant="success"><Trans>Password Reset Complete</Trans></Alert>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Button
                disabled={this.state.password.length < 8}
                type="submit"
                variant="info"
              >
                <Trans>Reset Password</Trans>
              </Button>
            </FormGroup>
          </Form>
        </Container>
      </div>
    );
  };
}

export default PasswordReset;
