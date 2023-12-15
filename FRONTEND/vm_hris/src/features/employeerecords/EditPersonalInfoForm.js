import React, { useState, useEffect } from "react";
import { useUpdatePersonalinfoMutation } from "./recordsApiSlice";
import { useNavigate } from "react-router-dom";
import { GENDER, CIVILSTATUS } from "../../config/pInfoOptions";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import { format, parse } from "date-fns";

const ZIPCODE_REGEX = /^[0-9]{1,4}$/;
const NUMERIC_REGEX = /^[0-9.]{1,5}$/;
const ALPHA_REGEX = /^[a-zA-Z. ]*$/;
const PHONEMOBILE_REGEX = /^[0-9+ -]*$/;

const EditPersonalInfoForm = ({ personalinfo }) => {
  const [updatePersonalinfo, { isLoading, isSuccess, isError, error }] =
    useUpdatePersonalinfoMutation();

  const navigate = useNavigate();
  const parsedBD = personalinfo?.Birthday
    ? parse(personalinfo?.Birthday, "MM/dd/yyyy", new Date())
    : null;

  /* PERSONALINFO VARIABLES */
  const [birthday, setBirthday] = useState(format(parsedBD, "yyyy-MM-dd"));
  const [presentAddress, setPresentAddress] = useState(
    personalinfo?.PresentAddress || personalinfo?.Address
  );
  const [permanentAddress, setPermanentAddress] = useState(
    personalinfo.PermanentAddress
  );
  const [zipCode, setZipCode] = useState(personalinfo.ZipCode);
  const [email, setEmail] = useState(personalinfo.Email);
  const [gender, setGender] = useState(personalinfo.Gender);
  const [civilStatus, setCivilStatus] = useState(personalinfo.CivilStatus);
  const [height, setHeight] = useState(personalinfo.Height);
  const [weight, setWeight] = useState(personalinfo.Weight);
  const [phone, setPhone] = useState(personalinfo.Phone);
  const [mobile, setMobile] = useState(personalinfo.Mobile);
  const [spouse, setSpouse] = useState(personalinfo.Spouse);
  const [fatherName, setFatherName] = useState(personalinfo.FatherName);
  const [foccupation, setFoccupation] = useState(personalinfo.Foccupation);
  const [motherName, setMotherName] = useState(personalinfo.MotherName);
  const [moccupation, setMoccupation] = useState(personalinfo.Moccupation);

  useEffect(() => {
    if (isSuccess) {
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
  }, [isSuccess, navigate]);

  /* SUBMIT FUNCTION */
  const onSaveUserClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() && !isLoading) {
      // Revert birthday format to MM/DD/YYYY
      const revertedBday = format(
        parse(birthday, "yyyy-MM-dd", new Date()),
        "MM/dd/yyyy"
      );

      await updatePersonalinfo({
        id: personalinfo.id,
        EmployeeID: personalinfo.EmployeeID,
        Birthday: revertedBday,
        PresentAddress: presentAddress,
        PermanentAddress:
          presentAddress === permanentAddress
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
          onSubmit={onSaveUserClicked}
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
                required
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Present Address, Permanent Address, and Zip Code */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto">
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
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Permanent Address</Form.Label>
              <Form.Control
                required
                type="text"
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
              />
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
          {/* TIN number, SSS number, PH number, PI number, ATM number */}
          {/* <Row className="mb-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">TIN Number</Form.Label>
              <Form.Control
                required
                type="text"
                pattern={ZIPCODE_REGEX}
                value={tinnumber}
                onChange={(e) => setTINnumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">SSS Number</Form.Label>
              <Form.Control
                required
                type="text"
                pattern={ZIPCODE_REGEX}
                value={sssnumber}
                onChange={(e) => setSSSnumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">PH Number</Form.Label>
              <Form.Control
                required
                type="text"
                pattern={ZIPCODE_REGEX}
                value={phnumber}
                onChange={(e) => setPHnumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">PI Number</Form.Label>
              <Form.Control
                required
                type="text"
                pattern={ZIPCODE_REGEX}
                value={pinumber}
                onChange={(e) => setPInumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">ATM Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="(Optional for confidentiality)"
                pattern={ZIPCODE_REGEX}
                value={atmnumber}
                onChange={(e) => setATMnumber(e.target.value)}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Col md="auto">
              <Button variant="outline-success">Save Changes</Button>
            </Col>
          </Row> */}
        </Form>
      </Container>
    </>
  );
};

export default EditPersonalInfoForm;
