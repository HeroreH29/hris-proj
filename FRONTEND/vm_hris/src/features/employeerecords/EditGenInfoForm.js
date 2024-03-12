import React, { useState, useEffect } from "react";
import {
  useAddGeninfoMutation,
  useUpdateGeninfoMutation,
  useAddInactiveEmpMutation,
  useDeleteInactiveEmpMutation,
} from "./recordsApiSlice";
import { useNavigate } from "react-router-dom";
import {
  ASSIGNEDOUTLET,
  DEPARTMENT,
  EMPLOYEETYPE,
  EMPSTATUS,
  MODE_OF_SEPARATION,
  PREFIX,
} from "../../config/gInfoOptions";
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
import { differenceInDays, format } from "date-fns";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { useSendEmailMutation } from "../emailSender/sendEmailApiSlice";
import { generateEmailMsg } from "../emailSender/generateEmailMsg";
import useRecordForm from "../../hooks/useRecordForm";

const EditGenInfoForm = ({ geninfo, inactiveEmp }) => {
  const { username, isOutletProcessor, branch } = useAuth();

  const [updateGeninfo, { isSuccess: updateSuccess, isError: updateError }] =
    useUpdateGeninfoMutation();

  const [addGeninfo, { isSuccess: addSuccess, isError: addError }] =
    useAddGeninfoMutation();

  const [sendEmail, { isSuccess: emailSuccess, isError: emailError }] =
    useSendEmailMutation();

  const [addInactiveEmp] = useAddInactiveEmpMutation();

  const [deleteInactiveEmp] = useDeleteInactiveEmpMutation();

  const navigate = useNavigate();

  /* GEN INFO VARIABLES */
  const { genState, genDispatch } = useRecordForm(geninfo);
  const [modeOfSeparation, setModeOfSeparation] = useState(
    inactiveEmp?.Mode_of_Separation ?? ""
  );
  const [isContractual, setIsContractual] = useState(
    genState.ContractDateEnd ? true : false
  );

  useEffect(() => {
    if (addSuccess || updateSuccess) {
      toast.success("Record saved!");
      navigate("/employeerecords");
    } else if (addError || updateError) {
      toast.error("Record saving error!");
    }

    if (emailSuccess) {
      toast.success("Record sent to HR!");
    } else if (emailError) {
      toast.error("Failed to send record to HR!");
    }
  }, [
    addSuccess,
    updateSuccess,
    addError,
    updateError,
    emailSuccess,
    emailError,
    navigate,
  ]);

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity()) {
      const confirm = window.confirm("Proceed with these information?");

      if (confirm) {
        const { _id, __v, ...others } = genState;
        // Check if user is adding or updating an employee record
        if (geninfo) {
          await updateGeninfo({ id: geninfo?.id, others });
        } else {
          await addGeninfo(others);
        }

        /* Include inactive employee record in inactive list.
        Remove from inactive list if reverted back to active */
        if (genState.EmpStatus === "N") {
          await addInactiveEmp({
            EmployeeID: genState.EmployeeID,
            Mode_of_Separation: modeOfSeparation,
            UserName: username,
          });
        } else if (genState.EmpStatus === "Y") {
          await deleteInactiveEmp({ id: inactiveEmp?.id });
        }

        // Send data to HR email if processed by outlet/branch
        if (isOutletProcessor && geninfo) {
          // Update record
          await sendEmail(
            generateEmailMsg(
              branch,
              `${geninfo?.EmployeeID}-GenInfo.json`,
              geninfo?.id,
              others,
              true
            )
          );
        } else if (isOutletProcessor) {
          // Add new record
          await sendEmail(
            generateEmailMsg(
              branch,
              `${geninfo?.EmployeeID}-GenInfo.json`,
              "",
              others
            )
          );
        }
      }
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  /* DROPDOWN OPTIONS */
  const employeeTypeOptions = Object.entries(EMPLOYEETYPE).map(
    ([key, value]) => {
      return (
        <option key={key} value={value}>
          {key}
        </option>
      );
    }
  );
  const assignedOutletOptions = Object.entries(ASSIGNEDOUTLET).map(
    ([key, value]) => {
      return (
        <Dropdown.Item
          key={key}
          value={value}
          as="option"
          onClick={() =>
            genDispatch({ type: "assigned_outlet", AssignedOutlet: value })
          }
        >
          {key}
        </Dropdown.Item>
      );
    }
  );
  const departmentOptions = Object.entries(DEPARTMENT).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });
  const empStatusOptions = Object.entries(EMPSTATUS).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });
  const prefixOptions = Object.entries(PREFIX).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });
  const modeOfSeparationOptions = Object.entries(MODE_OF_SEPARATION).map(
    ([key, value]) => {
      return (
        <option key={key} value={value}>
          {key}
        </option>
      );
    }
  );

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
          {/* EmployeeID and BioID */}
          <Row className="mb-3">
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Employee ID</Form.Label>
              <Form.Control
                required
                autoFocus
                autoComplete="off"
                type="text"
                value={genState.EmployeeID}
                onChange={(e) =>
                  genDispatch({
                    type: "employee_id",
                    EmployeeID: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">{`Bio ID (Auto-Generated)`}</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                required
                disabled
                defaultValue={genState.BioID}
              />
              <Form.Control.Feedback type="invalid">
                This field is required
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* First name, middle name, last name and prefix */}
          <Row className="mb-3 pb-5 border-bottom">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Prefix</Form.Label>
              <Form.Select
                value={genState.Prefix}
                onChange={(e) =>
                  genDispatch({ type: "prefix", Prefix: e.target.value })
                }
              >
                {prefixOptions}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label className="fw-semibold">First Name</Form.Label>
              <Form.Control
                required
                type="text"
                autoComplete="off"
                value={genState.FirstName}
                onChange={(e) =>
                  genDispatch({ type: "first_name", FirstName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label className="fw-semibold">Middle Name</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="(Optional)"
                value={genState.MiddleName}
                onChange={(e) =>
                  genDispatch({
                    type: "middle_name",
                    MiddleName: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label className="fw-semibold">Last Name</Form.Label>
              <Form.Control
                required
                type="text"
                autoComplete="off"
                value={genState.LastName}
                onChange={(e) =>
                  genDispatch({ type: "last_name", LastName: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Employee type & assigned outlet */}
          <Row className="mb-3 pt-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Employee Type</Form.Label>
              <Form.Select
                required
                value={genState.EmployeeType}
                onChange={(e) =>
                  genDispatch({
                    type: "employee_type",
                    EmployeeType: e.target.value,
                  })
                }
              >
                {employeeTypeOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Assigned Outlet</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  value={genState.AssignedOutlet}
                  onChange={(e) =>
                    genDispatch({
                      type: "assigned_outlet",
                      AssignedOutlet: e.target.value,
                    })
                  }
                />
                <DropdownButton variant="outline-secondary" title="Options">
                  {assignedOutletOptions}
                </DropdownButton>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Department & Job Title */}
          <Row className="mb-3 pb-5 border-bottom">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Department</Form.Label>
              <Form.Select
                required
                value={genState.Department}
                onChange={(e) =>
                  genDispatch({
                    type: "department",
                    Department: e.target.value,
                  })
                }
              >
                {departmentOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Job Title</Form.Label>
              <Form.Control
                type="text"
                required
                value={genState.JobTitle}
                onChange={(e) =>
                  genDispatch({ type: "job_title", JobTitle: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Date employed, contractual, and date probationary */}
          <Row className="mb-3 pt-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Date Employed</Form.Label>
              <Form.Control
                required
                autoComplete="off"
                type="date"
                value={genState.DateEmployed}
                onChange={(e) =>
                  genDispatch({
                    type: "date_employed",
                    DateEmployed: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Contractual?</Form.Label>
              <Form.Check
                type="switch"
                checked={isContractual}
                label={isContractual ? "Yes" : "No"}
                onChange={() => {
                  setIsContractual(!isContractual);
                  genDispatch({
                    type: "contract_date_end",
                    ContractDateEnd: "",
                  });
                }}
              />
            </Form.Group>
            {isContractual && (
              <>
                <Form.Group as={Col} md="auto">
                  <Form.Label className="fw-semibold">
                    Contract Date End
                  </Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={genState.ContractDateEnd}
                    onChange={(e) => {
                      // Checking if the contract date is after the employed date
                      const daysDiff = differenceInDays(
                        new Date(e.target.value),
                        new Date(genState.DateEmployed)
                      );

                      if (daysDiff > 0) {
                        genDispatch({
                          type: "contract_date_end",
                          ContractDateEnd: e.target.value,
                        });
                      } else {
                        toast.error(
                          "Contract date must be greater than employed date"
                        );
                      }
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Probationary Date</Form.Label>
              <Form.Control
                disabled={isContractual}
                type="date"
                value={genState.DateProbationary}
                onChange={(e) =>
                  genDispatch({
                    type: "date_probationary",
                    DateProbationary: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Regularization Date and Date Leaved/Date of Resignation */}
          <Row className="mb-3 ">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">
                Regularization Date
              </Form.Label>
              <Form.Control
                type="date"
                disabled={isContractual}
                value={genState.RegDate}
                onChange={(e) =>
                  genDispatch({ type: "reg_date", RegDate: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">
                Date of Resignation
              </Form.Label>
              <Form.Control
                type="date"
                disabled={isContractual}
                value={genState.DateLeaved}
                onChange={(e) =>
                  genDispatch({
                    type: "date_leaved",
                    DateLeaved: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Employment Status, Mode of Separation & Notes */}
          <Row className="mb-3 pb-5 border-bottom">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Employment Status</Form.Label>
              <Form.Select
                onChange={(e) =>
                  genDispatch({ type: "emp_status", EmpStatus: e.target.value })
                }
                value={genState.EmpStatus}
              >
                {empStatusOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            {genState.EmpStatus === "N" && (
              <>
                <Form.Group as={Col} md="auto">
                  <Form.Label className="fw-semibold">
                    Mode of Separation
                  </Form.Label>
                  <Form.Select
                    required
                    value={modeOfSeparation}
                    onChange={(e) => setModeOfSeparation(e.target.value)}
                  >
                    <option value={""}>Select mode...</option>
                    {modeOfSeparationOptions}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Notes</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                value={genState.Notes}
                onChange={(e) =>
                  genDispatch({ type: "notes", Notes: e.target.value })
                }
              />
            </Form.Group>
          </Row>
          {/* TIN number, SSS number, and PH number */}
          <Row className="mb-3 pt-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">TIN Number</Form.Label>
              <Form.Control
                required
                type="text"
                value={genState.TINnumber}
                onChange={(e) =>
                  genDispatch({ type: "tin_number", TINnumber: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">SSS Number</Form.Label>
              <Form.Control
                required
                type="text"
                value={genState.SSSnumber}
                onChange={(e) =>
                  genDispatch({ type: "sss_number", SSSnumber: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">PH Number</Form.Label>
              <Form.Control
                required
                type="text"
                value={genState.PHnumber}
                onChange={(e) =>
                  genDispatch({ type: "ph_number", PHnumber: e.target.value })
                }
              />
            </Form.Group>
          </Row>
          {/* PI number & ATM number */}
          <Row className="mb-3 pb-5 border-bottom">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">PI Number</Form.Label>
              <Form.Control
                required
                type="text"
                value={genState.PInumber}
                onChange={(e) =>
                  genDispatch({ type: "pi_number", PInumber: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label className="fw-semibold">ATM Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="(Optional for confidentiality)"
                value={genState.ATMnumber}
                onChange={(e) =>
                  genDispatch({ type: "atm_number", ATMnumber: e.target.value })
                }
              />
            </Form.Group>
          </Row>
          <Row className="pt-3">
            <Col md="auto">
              <Button type="submit" variant="outline-success">
                {geninfo ? "Save Change" : "Proceed"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default EditGenInfoForm;
