import React, { useState, useEffect } from "react";
import {
  useUpdatePersonalinfoMutation,
  useAddPersonalinfoMutation,
} from "./recordsApiSlice";
import { useNavigate } from "react-router-dom";
import { GENDER, CIVILSTATUS } from "../../config/pInfoOptions";
import {
  Form,
  Button,
  Col,
  Row,
  Container,
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useSendEmailMutation } from "../emailSender/sendEmailApiSlice";
import useAuth from "../../hooks/useAuth";
import { generateEmailMsg } from "../emailSender/generateEmailMsg";
import useRecordForm from "../../hooks/useRecordForm";

const EditPersonalInfoForm = ({ employeeId, personalinfo, AssignedOutlet }) => {
  const { isX, branch } = useAuth();

  // eslint-disable-next-line
  const [
    updatePersonalinfo,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useUpdatePersonalinfoMutation();

  const [
    addPersonalinfo,
    { isLoading: addLoading, isSuccess: addSuccess, isError: addError },
  ] = useAddPersonalinfoMutation();

  const [sendEmail] = useSendEmailMutation();

  const [disablePermAdd, setDisablePermAdd] = useState(true);

  const navigate = useNavigate();

  /* PERSONAL INFO VARIABLES */
  const { persState, persDispatch } = useRecordForm({
    personalinfo: { EmployeeID: employeeId, ...personalinfo },
  });

  useEffect(() => {
    if (addSuccess || updateSuccess) {
      toast.success("Record saved!");
      navigate("/employeerecords");
    } else if (addError || updateError) {
      toast.error("Record saving error!");
    }
  }, [addError, updateError, updateSuccess, addSuccess, navigate]);

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    const confirm = window.confirm("Add/Save this information?");

    if (confirm && form.checkValidity() && (!updateLoading || !addLoading)) {
      // Revert birthday format to MM/DD/YYYY
      /* const revertedBday = format(
        parse(persState.Birthday, "yyyy-MM-dd", new Date()),
        "MM/dd/yyyy"
      ); */

      const { _id, __v, ...others } = persState;

      if (personalinfo) {
        await updatePersonalinfo({
          id: personalinfo?.id,
          ...others,
        });
      } else {
        await addPersonalinfo(others);
      }

      // Send data to HR email if processed by outlet/branch (and vice versa)
      // if (isX.isOutletProcessor || AssignedOutlet !== "Head Office") {
      //   const updateRecord = isX.isOutletProcessor && personalinfo;
      //   const id = updateRecord ? personalinfo?.id : "";

      //   await sendEmail(
      //     generateEmailMsg({
      //       branch,
      //       filename: `${employeeId}-PersonalInfo.json`,
      //       id,
      //       compiledInfo: others,
      //       updateRecord,
      //       assignedOutlet: AssignedOutlet,
      //     })
      //   );
      // }

      /* // Send data to HR email if processed by outlet/branch
      if (isX && personalinfo) {
        // Update record
        await sendEmail(
          generateEmailMsg(
            branch,
            `${personalinfo?.EmployeeID}-PersonalInfo.json`,
            personalinfo?.id,
            others,
            true
          )
        );
      } else if (isX) {
        // Add new record
        await sendEmail(
          generateEmailMsg(
            branch,
            `${personalinfo?.EmployeeID}-PersonalInfo.json`,
            personalinfo?.id,
            others
          )
        );
      } */
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  /* DROPDOWN OPTIONS */
  const genderOptions = Object.entries(GENDER).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });
  const civilStatusOptions = Object.entries(CIVILSTATUS).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });

  const [validated, setValidated] = useState(false);

  return (
    <>
      <Container>
        <Form
          className="p-3"
          noValidate
          validated={validated}
          onSubmit={onSaveInfoClicked}
        >
          {/* Birthday & Email */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Birthday</Form.Label>
              <Form.Control
                disabled={isX.isOutletProcessor}
                required
                autoFocus
                type="date"
                value={persState.Birthday}
                onChange={(e) =>
                  persDispatch({ type: "birthday", Birthday: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control
                disabled={isX.isOutletProcessor}
                type="text"
                value={persState.Email}
                onChange={(e) =>
                  persDispatch({ type: "email", Email: e.target.value })
                }
              />
            </Form.Group>
          </Row>
          {/* Present Address, Permanent Address, and Zip Code */}
          <Row className="mb-3 pb-5 border-bottom">
            <Form.Group as={Col} md="4">
              <Form.Label className="fw-semibold">Present Address</Form.Label>
              <Form.Control
                disabled={isX.isOutletProcessor}
                required
                type="text"
                value={persState.PresentAddress ?? persState.Address}
                onChange={(e) =>
                  persDispatch({
                    type: "present_address",
                    PresentAddress: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label className="fw-semibold">Permanent Address</Form.Label>
              <InputGroup>
                <Form.Control
                  isInvalid={persState.PermanentAddress === ""}
                  type="text"
                  value={persState.PermanentAddress}
                  disabled={disablePermAdd}
                  onChange={(e) =>
                    persDispatch({
                      type: "permanent_address",
                      PermanentAddress: e.target.value,
                    })
                  }
                />
                <DropdownButton
                  variant="outline-secondary"
                  title="Options"
                  align="end"
                  disabled={isX.isOutletProcessor}
                >
                  <Dropdown.Item
                    as="option"
                    onClick={() => {
                      setDisablePermAdd(false);
                      persDispatch({
                        type: "permanent_address",
                        PermanentAddress: "",
                      });
                    }}
                  >{`(Input address)`}</Dropdown.Item>
                  <Dropdown.Item
                    as="option"
                    onClick={() => {
                      persDispatch({
                        type: "permanent_address",
                        PermanentAddress: "(Same as present address)",
                      });
                      setDisablePermAdd(true);
                    }}
                  >{`(Same as present address)`}</Dropdown.Item>
                </DropdownButton>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                This field required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Zip Code</Form.Label>
              <Form.Control
                required
                disabled={isX.isOutletProcessor}
                type="text"
                value={persState.ZipCode}
                onChange={(e) =>
                  persDispatch({ type: "zip_code", ZipCode: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Gender, height and weight */}
          <Row className="mb-3 pt-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Gender</Form.Label>
              <Form.Select
                disabled={isX.isOutletProcessor}
                required
                value={persState.Gender}
                onChange={(e) =>
                  persDispatch({ type: "gender", Gender: e.target.value })
                }
              >
                {genderOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Height</Form.Label>
              <Form.Control
                disabled={isX.isOutletProcessor}
                required
                value={persState.Height}
                onChange={(e) =>
                  persDispatch({ type: "height", Height: e.target.value })
                }
              />

              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Weight</Form.Label>
              <Form.Control
                disabled={isX.isOutletProcessor}
                required
                value={persState.Weight}
                onChange={(e) =>
                  persDispatch({ type: "weight", Weight: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Civil status and spouse */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Civil Status</Form.Label>
              <Form.Select
                disabled={isX.isOutletProcessor}
                required
                value={persState.CivilStatus}
                onChange={(e) =>
                  persDispatch({
                    type: "civil_status",
                    CivilStatus: e.target.value,
                  })
                }
              >
                {civilStatusOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Spouse</Form.Label>
              <Form.Control
                disabled={
                  persState.CivilStatus !== "Married" || isX.isOutletProcessor
                }
                type="text"
                value={persState.Spouse}
                onChange={(e) =>
                  persDispatch({ type: "spouse", Spouse: e.target.value })
                }
              />
            </Form.Group>
          </Row>
          {/* Phone and mobile  */}
          <Row className="mb-3 pb-5 border-bottom">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Phone</Form.Label>
              <Form.Control
                disabled={isX.isOutletProcessor}
                autoComplete="off"
                type="text"
                placeholder="(Optional)"
                value={persState.Phone}
                onChange={(e) =>
                  persDispatch({ type: "phone", Phone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Mobile</Form.Label>
              <Form.Control
                disabled={isX.isOutletProcessor}
                required
                type="text"
                value={persState.Mobile}
                onChange={(e) =>
                  persDispatch({ type: "mobile", Mobile: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Father & Mother Name and Occupation */}
          <Row className="mb-3 pt-3 pb-4 border-bottom">
            <InputGroup as={Col} md="auto" className="mb-3">
              <InputGroup.Text className="fw-semibold">
                Father Name and Occupation
              </InputGroup.Text>
              <Form.Control
                disabled={isX.isOutletProcessor}
                type="text"
                value={persState.FatherName}
                onChange={(e) =>
                  persDispatch({
                    type: "father_name",
                    FatherName: e.target.value,
                  })
                }
              />
              <Form.Control
                type="text"
                value={persState.Foccupation}
                disabled={isX.isOutletProcessor}
                onChange={(e) =>
                  persDispatch({
                    type: "foccupation",
                    Foccupation: e.target.value,
                  })
                }
              />
            </InputGroup>
            <InputGroup as={Col} md="auto" className="mb-3">
              <InputGroup.Text className="fw-semibold">
                Mother Name and Occupation
              </InputGroup.Text>
              <Form.Control
                type="text"
                disabled={isX.isOutletProcessor}
                value={persState.MotherName}
                onChange={(e) =>
                  persDispatch({
                    type: "mother_name",
                    MotherName: e.target.value,
                  })
                }
              />
              <Form.Control
                type="text"
                disabled={isX.isOutletProcessor}
                value={persState.Moccupation}
                onChange={(e) =>
                  persDispatch({
                    type: "moccupation",
                    Moccupation: e.target.value,
                  })
                }
              />
            </InputGroup>
          </Row>
          <Row className="pt-3">
            <Col md="auto">
              {!isX.isOutletProcessor && (
                <Button type="submit" variant="outline-success">
                  Save Changes
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default EditPersonalInfoForm;
