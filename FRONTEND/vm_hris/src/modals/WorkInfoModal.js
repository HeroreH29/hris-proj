import React from "react";
import {
  Modal,
  Form,
  Row,
  InputGroup,
  Button,
  Col,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { RegionDropdown, CountryDropdown } from "react-country-region-selector";

const WorkInfoModal = ({
  workState,
  workDispatch,
  showModal,
  setShowModal,
  validated,
  onSaveInfoClicked,
  onDeleteWorkInfoClicked,
  showRegion,
  setShowRegion,
  showCountry,
  setShowCountry,
}) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {workState.id ? "Edit Work Info" : "Add Work Info"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          className="p-3"
          noValidate
          validated={validated}
          onSubmit={onSaveInfoClicked}
        >
          {/* Job Title, Company Name, and Company Address */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto" className="mb-3">
              <Form.Label className="fw-semibold">Job Title</Form.Label>
              <Form.Control
                required
                autoFocus
                autoComplete="off"
                type="text"
                value={workState.Position_Title}
                onChange={(e) =>
                  workDispatch({
                    type: "position_title",
                    Position_Title: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto" className="mb-3">
              <Form.Label className="fw-semibold">Company Name</Form.Label>
              <Form.Control
                required
                type="text"
                value={workState.Company_Name}
                onChange={(e) =>
                  workDispatch({
                    type: "company_name",
                    Company_Name: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto" className="mb-3">
              <Form.Label className="fw-semibold">Address</Form.Label>
              <InputGroup>
                {showRegion ? (
                  <RegionDropdown
                    classes="dropdown-toggle show form-select"
                    defaultOptionLabel="Select State"
                    country={workState.Country}
                    value={workState.State}
                    onChange={(e) => workDispatch({ type: "state", State: e })}
                  />
                ) : (
                  <Form.Control
                    type="text"
                    placeholder="Enter State"
                    value={workState.State}
                    onChange={(e) =>
                      workDispatch({
                        type: "state",
                        State: e.target.value,
                      })
                    }
                  />
                )}
                <DropdownButton title="" variant="outline-secondary">
                  <Dropdown.Item
                    as={"option"}
                    onClick={() => setShowRegion(false)}
                  >
                    Enter State
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={"option"}
                    onClick={() => setShowRegion(true)}
                  >
                    Select State
                  </Dropdown.Item>
                </DropdownButton>
                {showCountry ? (
                  <CountryDropdown
                    classes="form-select"
                    value={workState.Country}
                    onChange={(e) =>
                      workDispatch({
                        type: "country",
                        Country: e,
                      })
                    }
                  />
                ) : (
                  <Form.Control
                    type="text"
                    placeholder="Enter Country"
                    value={workState.Country}
                    onChange={(e) =>
                      workDispatch({
                        type: "country",
                        Country: e.target.value,
                      })
                    }
                  />
                )}
                <DropdownButton title="" variant="outline-secondary">
                  <Dropdown.Item
                    as={"option"}
                    onClick={() => setShowCountry(false)}
                  >
                    Enter Country
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={"option"}
                    onClick={() => setShowCountry(true)}
                  >
                    Select Country
                  </Dropdown.Item>
                </DropdownButton>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Start, End Work, and Present Job */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto" className="mb-3">
              <Form.Label className="fw-semibold">
                Job Start Month | Year
              </Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  value={workState.JoinedFR_M}
                  onChange={(e) =>
                    workDispatch({
                      type: "joinedFR_M",
                      JoinedFR_M: e.target.value,
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
                <Form.Control
                  required
                  type="number"
                  value={workState.JoinedFR_Y}
                  onChange={(e) =>
                    workDispatch({
                      type: "joinedFR_Y",
                      JoinedFR_Y: e.target.value,
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md="auto" className="mb-3">
              <Form.Label className="fw-semibold">
                Job End Month | Year
              </Form.Label>
              <InputGroup>
                <Form.Control
                  disabled={workState.ToPresent === 1}
                  required={workState.ToPresent !== 1}
                  type="text"
                  value={workState.JoinedTO_M}
                  onChange={(e) =>
                    workDispatch({
                      type: "joinedTO_M",
                      JoinedTO_M: e.target.value,
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>

                <Form.Control
                  disabled={workState.ToPresent === 1}
                  required={workState.ToPresent !== 1}
                  type="number"
                  value={workState.JoinedTO_Y}
                  onChange={(e) =>
                    workDispatch({
                      type: "joinedTO_Y",
                      JoinedTO_Y: e.target.value,
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Present Job"
                checked={workState.ToPresent === 1 ? true : false}
                onChange={(e) => {
                  workDispatch({
                    type: "toPresent",
                    ToPresent: e.target.checked,
                  });
                  if (e.target.checked) {
                    workDispatch({ type: "joinedTO_M", JoinedTO_M: "" });
                    workDispatch({ type: "joinedTO_Y", JoinedTO_Y: 0 });
                  }
                }}
              />
            </Form.Group>
          </Row>
          {/* Specialization, Role, Industry, Position Level */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto" className="mb-3">
              <Form.Label className="fw-semibold">Specialization</Form.Label>
              <Form.Control
                required
                autoComplete="off"
                type="text"
                value={workState.Specialization}
                onChange={(e) =>
                  workDispatch({
                    type: "specialization",
                    Specialization: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto" className="mb-3">
              <Form.Label className="fw-semibold">Role</Form.Label>
              <Form.Control
                required
                autoComplete="off"
                type="text"
                value={workState.Role}
                onChange={(e) =>
                  workDispatch({
                    type: "role",
                    Role: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto" className="mb-3">
              <Form.Label className="fw-semibold">Industry</Form.Label>
              <Form.Control
                required
                autoComplete="off"
                type="text"
                value={workState.Industry}
                onChange={(e) =>
                  workDispatch({
                    type: "industry",
                    Industry: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto" className="mb-3">
              <Form.Label className="fw-semibold">Position Level</Form.Label>
              <Form.Control
                required
                autoComplete="off"
                type="text"
                value={workState.Position}
                onChange={(e) =>
                  workDispatch({
                    type: "position",
                    Position: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Salary and Work Description */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto" className="mb-3">
              <Form.Label className="fw-semibold">Salary</Form.Label>
              <Form.Control
                autoComplete="off"
                type="text"
                value={workState.Salary}
                onChange={(e) =>
                  workDispatch({
                    type: "salary",
                    Salary: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto" className="mb-3">
              <Form.Label className="fw-semibold">Work Description</Form.Label>
              <Form.Control
                required
                autoComplete="off"
                as="textarea"
                value={workState.Work_Description}
                onChange={(e) =>
                  workDispatch({
                    type: "work_description",
                    Work_Description: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Submit button */}
          <Row className="mb-3 float-end">
            <Col md="auto">
              <Button type="submit" variant="outline-success">
                {workState.id ? "Save Changes" : "Add Info"}
              </Button>
            </Col>
            {workState.id && (
              <Col md="auto">
                {/* Enable if dependent deletion is required */}
                <Button
                  disabled
                  type="button"
                  onClick={onDeleteWorkInfoClicked}
                  variant="outline-danger"
                >
                  Delete Info
                </Button>
              </Col>
            )}
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default WorkInfoModal;
