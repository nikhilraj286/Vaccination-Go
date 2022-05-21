// import moment from "moment";
import React, { Component } from "react";
import {
  Card,
  // Col,
  Container,
  Row,
} from "react-bootstrap";
import { Label } from "reactstrap";
import { getTimeFromInt } from "../../Services/ControllerUtils";
import { Trans } from "react-i18next";
class AddVaccination extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <Card>
            <Card.Header className="mb-2 text-muted">
            <Trans>Selected Clinic Details</Trans>
            </Card.Header>
            <Card.Body>
              <Row>
                <Label><Trans>Name</Trans>: {this.props.name}</Label>
                <Label>
                <Trans>Opens at</Trans>: {getTimeFromInt(this.props.startBussinessHour)}
                </Label>
                <Label>
                <Trans>Closes at</Trans>: {getTimeFromInt(this.props.endBussinessHour)}
                </Label>
                <Label>
                <Trans>Number of Physicians Available</Trans>: {this.props.noOfPhysician}
                </Label>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </React.Fragment>
    );
  }
}

export default AddVaccination;
