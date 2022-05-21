import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Row } from "reactstrap";
import { Container } from "react-bootstrap";
import axios from "axios";
import backendServer from "../../../webConfig";
import swal from "sweetalert";
import Navbar from "./../../Navbar/Navbar";
import { Trans } from "react-i18next";

class AddDisease extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let diseaseData = {
      diseaseName: this.state.diseaseName,
      diseaseDesc: this.state.diseaseDesc,
    };
    axios
      .post(`${backendServer}/addDisease`, diseaseData)
      .then((response) => {
        console.log("response from addDisease  : ", response);
        console.log("Status Code : ", response.status);

        if (response.status === 200) {
          this.setState({
            isSuccess: true,
            disease: response.data,
            error: "",
          });
          swal("Success", "Disease added successfully", "success");
        } else {
          this.setState({
            error: "Given disease name already exists",
            isSuccess: false,
          });

          swal("Error", "Given disease name already exists", "error");
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          this.setState({
            error: error.response.data,
            isSuccess: false,
          });
          swal("Error", this.state.error, "error");
        }
      });
  };

  render() {
    // if (localStorage.getItem("userData") === null) {
    //   return <Redirect to="/" />;
    // }
    if (this.state.isSuccess) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <React.Fragment>
        <div style={{ width: "90%", margin: "auto", marginTop: "100px" }}>
          <h3>
            <Trans>Create Disease</Trans>
          </h3>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <FormGroup>
                <Label for="diseaseName">
                  <Trans>Disease Name</Trans>
                </Label>
                <Input
                  type="text"
                  id="diseaseName"
                  name="diseaseName"
                  placeholder="Disease Name"
                  onChange={(e) => {
                    this.setState({ diseaseName: e.target.value });
                  }}
                  required
                ></Input>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Label for="diseaseDesc">
                  <Trans>Disease Description</Trans>
                </Label>
                <Input
                  type="textarea"
                  id="diseaseDesc"
                  name="diseaseDesc"
                  placeholder="Disease Description"
                  onChange={(e) => {
                    this.setState({ diseaseDesc: e.target.value });
                  }}
                  required
                ></Input>
              </FormGroup>
            </Row>
            <FormGroup row>
              <Button type="submit" color="btn btn-info">
                <Trans>Add disease</Trans>
              </Button>
            </FormGroup>
          </Form>
          {/* <pre>{JSON.stringify(this.state, "", 2)}</pre> */}
        </div>
      </React.Fragment>
    );
  }
}

export default AddDisease;
