import React, { Component } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input, Col, Row } from "reactstrap";
import backendServer from "../../../webConfig";
import { Redirect } from "react-router";
import Navbar from "./../../Navbar/Navbar";
import swal from "sweetalert";
import { Trans } from "react-i18next";
import { Container } from "react-bootstrap";

class AddClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinicInfo: {
        name: "",
        noOfPhysician: 0,
        aptNo: "",
        street: "",
        number: "",
        city: "",
        zipcode: "",
        state: "",
        startBussinessHour: 0,
        endBussinessHour: 0,
      },
      error: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      clinicInfo: {
        ...this.state.clinicInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    // axios.defaults.headers["Access-Control-Allow-Origin"] = true;
    if (
      Number(this.state.clinicInfo.startBussinessHour) >
      Number(this.state.clinicInfo.endBussinessHour)
    ) {
      swal("Error", "Start time can not be greater than end time", "error");
    } else if (
      Number(this.state.clinicInfo.endBussinessHour) -
        Number(this.state.clinicInfo.startBussinessHour) <
      8
    ) {
      swal("Error", "Minimum Bussiness hour should be 8 hours", "error");
    } else {
      let data = {
        name: this.state.clinicInfo.name,
        noOfPhysician: Number(this.state.clinicInfo.noOfPhysician),
        startBussinessHour: Number(this.state.clinicInfo.startBussinessHour),
        endBussinessHour: Number(this.state.clinicInfo.endBussinessHour),
        street: this.state.clinicInfo.street,
        aptNo: this.state.clinicInfo.aptNo,
        city: this.state.clinicInfo.city,
        state: this.state.clinicInfo.state,
        zipcode: Number(this.state.clinicInfo.zipcode),
      };
      axios
        .post(`${backendServer}/addClinic`, data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            swal("Success", "Clinic added successfully", "success");
            this.setState({
              isSuccess: true,
              error: "",
            });
            this.SetLocalStorage(JSON.stringify(response.data));
          } else {
            this.setState({
              error: "Error adding clinic to the Database",
            });
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            this.setState({
              error: error.response.data,
            });
            swal("Error", this.state.error, "error");
          }
        });
    }
  };

  render() {
    // if (localStorage.getItem("userData") === null) {
    // 	return <Redirect to="/" />;
    // }
    if (this.state.isSuccess) {
      return <Redirect to="/dashboard" />;
    } else
      return (
        <React.Fragment>
          {/* <div className="container-fluid form-cont">
            <div className="flex-container">
              <div className="row" style={{ padding: "120px" }}>
                <div className="col col-sm-3"></div>
                <div className="col col-sm-6"> */}
          <div style={{ width: "90%", margin: "auto", marginTop: "100px" }}>
            <h3>Create Clinic</h3>
            <Form onSubmit={this.handleSubmit} className="form-stacked">
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="clinicName">
                      <Trans>Clinic Name</Trans>
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Clinic Name"
                      onChange={this.handleChange}
                      required
                    ></Input>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="noOfPhysician">
                      <Trans>Number of Physicians</Trans>
                    </Label>
                    <Input
                      type="number"
                      id="noOfPhysician"
                      name="noOfPhysician"
                      placeholder="Number of Physicians"
                      min="0"
                      onChange={this.handleChange}
                      required
                    ></Input>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label for="startBussinessHour">
                    <Trans>Start Bussiness Hour</Trans>
                  </Label>
                  <Input
                    type="number"
                    id="startBussinessHour"
                    name="startBussinessHour"
                    placeholder="Start Hour (0 to 16)"
                    min="0"
                    max="16"
                    onChange={this.handleChange}
                    required
                  ></Input>
                </Col>
                <Col>
                  <Label for="firstName">
                    <Trans>End Bussiness Hour</Trans>
                  </Label>
                  <Input
                    type="number"
                    id="endBussinessHour"
                    name="endBussinessHour"
                    min="0"
                    max="24"
                    placeholder="End Hour (8 to 24)"
                    onChange={this.handleChange}
                    required
                  ></Input>
                </Col>
                <span style={{ color: "red", fontSize: "10px" }}>
                  <Trans>Integers interpreted as hour of the day</Trans>
                </span>
              </Row>
              <FormGroup>
                <Label htmlFor="address">
                  <Trans>Address</Trans>
                </Label>
                <Row>
                  <Col>
                    <Input
                      type="text"
                      id="street"
                      name="street"
                      placeholder="Street"
                      onChange={this.handleChange}
                      required
                    ></Input>
                  </Col>
                  <Col>
                    <Input
                      type="text"
                      id="number"
                      name="number"
                      placeholder="Apt Number (Optional)"
                      onChange={this.handleChange}
                    ></Input>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {" "}
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="City"
                      onChange={this.handleChange}
                      required
                    ></Input>
                  </Col>
                  <Col>
                    {" "}
                    <Input
                      type="number"
                      id="zipcode"
                      name="zipcode"
                      min="0"
                      placeholder="Zip Code"
                      onChange={this.handleChange}
                      required
                    ></Input>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {" "}
                    <Input
                      type="text"
                      id="state"
                      name="state"
                      placeholder="State"
                      onChange={this.handleChange}
                      required
                    ></Input>
                  </Col>
                  <Col></Col>
                </Row>
              </FormGroup>
            <FormGroup row>
              <Button type="submit" color="btn btn-info">
                <Trans>Create Clinic</Trans>
              </Button>
            </FormGroup>
            </Form>
          </div>
          {/* <pre>{JSON.stringify(this.state, "", 2)}</pre> */}
          {/* </div>
              </div>
            </div>
          </div> */}
        </React.Fragment>
      );
  }
}

export default AddClinic;
