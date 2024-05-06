import {
  faAdd,
  faLeftLong,
  faMinus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Table,
  Button,
  Row,
  InputGroup,
  Form,
  OverlayTrigger,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  useGetLeaveCreditsQuery,
  useUpdateLeaveCreditMutation,
} from "../leaves/leavesApiSlice";
import useTitle from "../../hooks/useTitle";
import { differenceInYears } from "date-fns";
import TooltipRenderer from "../../xtra_functions/TooltipRenderer";
import { toast } from "react-toastify";

const IncreaseCredits = () => {
  const navigate = useNavigate();

  useTitle("Increase Credits | Via Mare HRIS");

  const { leavecredits } = useGetLeaveCreditsQuery("", {
    selectFromResult: ({ data }) => ({
      leavecredits: data?.ids
        .filter((id) => {
          return data?.entities[id].CreditsOf?.EmpStatus === "Y";
        })
        .map((id) => data?.entities[id]),
    }),
  });

  const [updateLeaveCredit, { isSuccess, isLoading, isError, error }] =
    useUpdateLeaveCreditMutation();

  const [content, setContent] = useState([]);

  // Initialize data
  useEffect(() => {
    if (!content?.length) {
      setContent(leavecredits);
    }

    // eslint-disable-next-line
  }, [leavecredits]);

  const searchEmployee = (searchTxt = "") => {
    // Filter content based on searchTxt
    const filteredInfos = leavecredits.filter((data) => {
      const info = data.CreditsOf;

      return info?.FullName.toLowerCase().includes(searchTxt.toLowerCase());
    });

    // Update the state with filtered results
    setContent(filteredInfos);
  };

  const increaseCredit = async ({ data = {} }) => {
    // Check credit budget if it can be decreased
    const budget = data.CreditBudget;

    if (budget === 5 || budget === 10) {
      await updateLeaveCredit({ ...data, CreditBudget: budget + 2 });
    } else if (!budget) {
      await updateLeaveCredit({
        ...data,
        VacationLeave: 5,
        SickLeave: 5,
        BirthdayLeave: 1,
        CreditBudget: 5,
      });
    } else {
      await updateLeaveCredit({ ...data, CreditBudget: budget + 3 });
    }
  };

  const decreaseCredit = async ({ data = {} }) => {
    // Check credit budget if it can be decreased
    const budget = data.CreditBudget;

    if (budget === 12 || budget === 7) {
      await updateLeaveCredit({ ...data, CreditBudget: budget - 2 });
    } else if (budget === 5) {
      await updateLeaveCredit({
        ...data,
        VacationLeave: 0,
        SickLeave: 0,
        BirthdayLeave: 0,
        CreditBudget: 0,
      });
    } else {
      await updateLeaveCredit({ ...data, CreditBudget: budget - 3 });
    }
  };

  // For enabling/disabling increase button
  const creditChecker = ({ srvcYrs = 0, data = {} }) => {
    const conditions = [
      { years: [0, 0], maxCredit: 0 },
      { years: [1, 4], maxCredit: 5 },
      { years: [5, 7], maxCredit: 7 },
      { years: [8, 10], maxCredit: 10 },
      { years: [11, 13], maxCredit: 12 },
      { years: [14, Infinity], maxCredit: 15 },
    ];

    // Check eligibility based on service years and current credit budget
    for (const condition of conditions) {
      const [start, end] = condition.years;
      if (
        srvcYrs >= start &&
        srvcYrs <= end &&
        data.CreditBudget <= condition.maxCredit
      ) {
        return false; // Enable button
      }
    }

    // Disable button
    return true;
  };

  // Leave credit update checker
  useEffect(() => {
    if (isLoading) {
      toast.loading("Saving changes...");
    } else if (isError) {
      toast.error(error);
    } else if (isSuccess) {
      toast.dismiss(); // Remove loading toast
      toast.success("Leave credit budget changed");
      navigate("/leaves");
    }
  }, [isSuccess, isLoading, isError, error, navigate]);

  const tableContent =
    content?.length &&
    content.slice(0, 20).map((data) => {
      const info = data.CreditsOf;
      const srvcYrs = differenceInYears(
        new Date(),
        new Date(info.DateEmployed)
      );
      return (
        <tr key={info._id}>
          <td>{info.EmployeeID}</td>
          <td>{`${info.FullName}`}</td>
          <td>{srvcYrs}</td>
          <td>{data.CreditBudget}</td>
          <td>
            <Stack direction="horizontal" gap={1}>
              <OverlayTrigger
                overlay={TooltipRenderer({ tip: "Increase credit" })}
              >
                <Button
                  variant="outline-success"
                  size="sm"
                  disabled={creditChecker({ srvcYrs, data })}
                  onClick={() => increaseCredit({ srvcYrs, data })}
                >
                  <FontAwesomeIcon icon={faAdd} />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                overlay={TooltipRenderer({ tip: "Decrease credit" })}
              >
                <Button
                  variant="outline-warning"
                  size="sm"
                  disabled={data.CreditBudget === 0}
                  onClick={() => decreaseCredit({ data })}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
              </OverlayTrigger>
            </Stack>
          </td>
        </tr>
      );
    });

  return (
    <Container>
      <Row className="mb-3">
        <Stack direction="horizontal" gap={4}>
          <div>
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/leaves")}
            >
              <FontAwesomeIcon icon={faLeftLong} />
            </Button>
          </div>
          <div>
            <h3>Increase Credits</h3>
          </div>
          <div className="ms-auto">
            <InputGroup>
              <InputGroup.Text className="">
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by name..."
                onChange={(e) => searchEmployee(e.target.value)}
              />
            </InputGroup>
          </div>
        </Stack>
      </Row>
      <Row className="p-3">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th># of Service Years</th>
              <th>Credit Budget</th>
              <th>Increase/Decrease</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default IncreaseCredits;
