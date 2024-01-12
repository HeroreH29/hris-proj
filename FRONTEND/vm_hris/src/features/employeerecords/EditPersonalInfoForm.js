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
import { format, parse } from "date-fns";

const ZIPCODE_REGEX = /^[0-9]{1,4}$/;
const NUMERIC_REGEX = /^[0-9.]{1,5}$/;
const ALPHA_REGEX = /^[a-zA-Z. ]*$/;
const PHONEMOBILE_REGEX = /^[0-9+ -]*$/;

const EditPersonalInfoForm = ({ employeeId, personalinfo }) => {
  // eslint-disable-next-line
  const [
    updatePersonalinfo,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
      error: updateerr,
    },
  ] = useUpdatePersonalinfoMutation();

  const [
    addPersonalinfo,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addError,
      error: adderr,
    },
  ] = useAddPersonalinfoMutation();

  const [disablePermAdd, setDisablePermAdd] = useState(true);

  const navigate = useNavigate();
  const parsedBD = personalinfo?.Birthday
    ? parse(personalinfo?.Birthday, "MM/dd/yyyy", new Date())
    : null;

  /* PERSONALINFO VARIABLES */
  const [birthday, setBirthday] = useState(
    parsedBD ? format(parsedBD, "yyyy-MM-dd") : ""
  );
  const [presentAddress, setPresentAddress] = useState(
    personalinfo?.PresentAddress || personalinfo?.Address
  );
  const [permanentAddress, setPermanentAddress] = useState(
    personalinfo?.PermanentAddress
  );
  const [zipCode, setZipCode] = useState(personalinfo?.ZipCode);
  const [email, setEmail] = useState(personalinfo?.Email);
  const [gender, setGender] = useState(personalinfo?.Gender);
  const [civilStatus, setCivilStatus] = useState(personalinfo?.CivilStatus);
  const [height, setHeight] = useState(personalinfo?.Height);
  const [weight, setWeight] = useState(personalinfo?.Weight);
  const [phone, setPhone] = useState(personalinfo?.Phone);
  const [mobile, setMobile] = useState(personalinfo?.Mobile);
  const [spouse, setSpouse] = useState(personalinfo?.Spouse);
  const [fatherName, setFatherName] = useState(personalinfo?.FatherName);
  const [foccupation, setFoccupation] = useState(personalinfo?.Foccupation);
  const [motherName, setMotherName] = useState(personalinfo?.MotherName);
  const [moccupation, setMoccupation] = useState(personalinfo?.Moccupation);

  useEffect(() => {
    if (updateSuccess || addSuccess) {
      setBirthday("");
      setPresentAddress("");
      setPermanentAddress("");
      setZipCode("");
      setEmail("");
      setGender("");
      setCivilStatus("");
      setHeight("");
      setWeight("");
      setPhone("");
      setMobile("");
      setSpouse("");
      setFatherName("");
      setFoccupation("");
      setMotherName("");
      setMoccupation("");

      navigate("/employeerecords");
    }
  }, [updateSuccess, addSuccess, navigate]);

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    const confirm = window.confirm("Add/Save this information?");

    if (confirm && form.checkValidity() && (!updateLoading || !addLoading)) {
      // Revert birthday format to MM/DD/YYYY
      const revertedBday = format(
        parse(birthday, "yyyy-MM-dd", new Date()),
        "MM/dd/yyyy"
      );

      if (personalinfo) {
        await updatePersonalinfo({
          id: personalinfo?.id,
          EmployeeID: personalinfo?.EmployeeID,
          Birthday: revertedBday,
          PresentAddress: presentAddress,
          PermanentAddress: presentAddress
            ? "(Same as present address)"
            : permanentAddress,
          ZipCode: zipCode,
          Email: email,
          Gender: gender,
          CivilStatus: civilStatus,
          Height: height,
          Weight: weight,
          Phone: phone,
          Mobile: mobile,
          Spouse: spouse,
          FatherName: fatherName,
          Foccupation: foccupation,
          MotherName: motherName,
          Moccupation: moccupation,
        });
      } else {
        await addPersonalinfo({
          EmployeeID: employeeId,
          Birthday: revertedBday,
          PresentAddress: presentAddress,
          PermanentAddress: presentAddress
            ? "(Same as present address)"
            : permanentAddress,
          ZipCode: zipCode,
          Email: email,
          Gender: gender,
          CivilStatus: civilStatus,
          Height: height,
          Weight: weight,
          Phone: phone,
          Mobile: mobile,
          Spouse: spouse,
          FatherName: fatherName,
          Foccupation: foccupation,
          MotherName: motherName,
          Moccupation: moccupation,
        });
      }
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  /* USER INPUT PATTERN VALIDATION */
  const userInputChange = (e, REGEX, setStateVariable) => {
    const inputValue = e.target.value;

    if (REGEX.test(inputValue) || inputValue === "") {
      setStateVariable(inputValue);
    }
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
          {/* Birthday */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Birthday</Form.Label>
              <Form.Control
                required
                autoFocus
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
          </Row>
          {/* Present Address, Permanent Address, and Zip Code */}
          <Row className="mb-3">
            <Form.Group as={Col} md="4">
              <Form.Label className="fw-semibold">Present Address</Form.Label>
              <Form.Control
                required
                type="text"
                value={presentAddress}
                onChange={(e) => setPresentAddress(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label className="fw-semibold">Permanent Address</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={permanentAddress}
                  disabled={disablePermAdd}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                />
                <DropdownButton
                  variant="outline-secondary"
                  title="Options"
                  align="end"
                >
                  <Dropdown.Item
                    as="option"
                    onClick={() => {
                      setDisablePermAdd(false);
                      setPermanentAddress("");
                    }}
                  >{`(Input address)`}</Dropdown.Item>
                  <Dropdown.Item
                    as="option"
                    onClick={() => {
                      setPermanentAddress("(Same as present address)");
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
                type="text"
                value={zipCode}
                onChange={(e) => userInputChange(e, ZIPCODE_REGEX, setZipCode)}
              />
              <Form.Control.Feedback type="invalid">
                This field required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Gender, height and weight */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Gender</Form.Label>
              <Form.Select
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
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
                required
                value={height}
                onChange={(e) => userInputChange(e, NUMERIC_REGEX, setHeight)}
              />

              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Weight</Form.Label>
              <Form.Control
                required
                value={weight}
                onChange={(e) => userInputChange(e, NUMERIC_REGEX, setWeight)}
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Civil Status</Form.Label>
              <Form.Select
                required
                value={civilStatus}
                onChange={(e) => setCivilStatus(e.target.value)}
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
                disabled={civilStatus === "Single"}
                type="text"
                placeholder="(Optional)"
                value={spouse}
                onChange={(e) => userInputChange(e, ALPHA_REGEX, setSpouse)}
              />
            </Form.Group>
          </Row>
          {/* Phone and mobile  */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Phone</Form.Label>
              <Form.Control
                autoComplete="off"
                type="text"
                placeholder="(Optional)"
                value={phone}
                onChange={(e) =>
                  userInputChange(e, PHONEMOBILE_REGEX, setPhone)
                }
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Mobile</Form.Label>
              <Form.Control
                required
                type="text"
                value={mobile}
                onChange={(e) =>
                  userInputChange(e, PHONEMOBILE_REGEX, setMobile)
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Father & Mother Name and Occupation */}
          <Row className="mb-3">
            <InputGroup as={Col} md="auto" className="mb-3">
              <InputGroup.Text className="fw-semibold">
                Father Name and Occupation
              </InputGroup.Text>
              <Form.Control
                type="text"
                value={fatherName}
                onChange={(e) => userInputChange(e, ALPHA_REGEX, setFatherName)}
              />
              <Form.Control
                type="text"
                value={foccupation}
                onChange={(e) =>
                  userInputChange(e, ALPHA_REGEX, setFoccupation)
                }
              />
            </InputGroup>
            <InputGroup as={Col} md="auto" className="mb-3">
              <InputGroup.Text className="fw-semibold">
                Mother Name and Occupation
              </InputGroup.Text>
              <Form.Control
                type="text"
                value={motherName}
                onChange={(e) => userInputChange(e, ALPHA_REGEX, setMotherName)}
              />
              <Form.Control
                type="text"
                value={moccupation}
                onChange={(e) =>
                  userInputChange(e, ALPHA_REGEX, setMoccupation)
                }
              />
            </InputGroup>
          </Row>
          <Row className="mb-3">
            <Col md="auto">
              <Button type="submit" variant="outline-success">
                Save Changes
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default EditPersonalInfoForm;
