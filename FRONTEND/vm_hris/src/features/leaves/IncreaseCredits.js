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
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import { useGetLeaveCreditsQuery } from "../leaves/leavesApiSlice";
import useTitle from "../../hooks/useTitle";
import { differenceInYears } from "date-fns";
import TooltipRenderer from "../../xtra_functions/TooltipRenderer";

const IncreaseCredits = () => {
  const navigate = useNavigate();
  useTitle("Increase Credits | Via Mare HRIS");

  const { geninfos } = useGetGeninfosQuery("", {
    selectFromResult: ({ data }) => ({
      geninfos: data?.ids
        ?.filter((id) => {
          return (
            data?.entities[id].EmpStatus === "Y" &&
            data?.entities[id].EmployeeType === "Regular"
          );
        })
        .map((id) => data?.entities[id]),
    }),
  });

  const { leavecredits } = useGetLeaveCreditsQuery("", {
    selectFromResult: ({ data }) => ({
      leavecredits: data?.ids?.map((id) => data?.entities[id]),
    }),
  });

  const [content, setContent] = useState([]);

  // Initialize data
  useEffect(() => {
    if (!content?.length) {
      setContent(leavecredits?.map((credit) => credit.Employee?.GenInfo));
    }

    console.log(content);
    // eslint-disable-next-line
  }, [geninfos]);

  const searchEmployee = (searchTxt = "") => {
    const filteredInfos = geninfos.filter((info) => {
      let matches = true;

      matches =
        matches &&
        (info.LastName.toLowerCase().includes(searchTxt.toLowerCase()) ||
          info.FirstName.toLowerCase().includes(searchTxt.toLowerCase()));

      return matches;
    });

    setContent(filteredInfos);
  };

  const tableContent =
    content?.length &&
    content.slice(0, 20).map((info) => {
      const srvcYrs = differenceInYears(
        new Date(),
        new Date(info.DateEmployed)
      );
      let currCred = 0;

      const getCred = () => {
        switch (true) {
          case srvcYrs >= 14:
            currCred = 15;
            break;
          case srvcYrs >= 11:
            currCred = 12;
            break;
          case srvcYrs >= 8:
            currCred = 10;
            break;
          case srvcYrs >= 5:
            currCred = 7;
            break;
          case srvcYrs >= 1:
            currCred = 5;
            break;
          default:
            currCred = 0;
            break;
        }
      };

      getCred();

      return (
        <tr key={info._id}>
          <td>{info.EmployeeID}</td>
          <td>{`${info.LastName}, ${info.FirstName}`}</td>
          <td>{srvcYrs}</td>
          <td>{currCred}</td>
          <td>
            <Stack direction="horizontal" gap={1}>
              <OverlayTrigger
                overlay={TooltipRenderer({ tip: "Increase credit" })}
              >
                <Button variant="outline-success" size="sm">
                  <FontAwesomeIcon icon={faAdd} />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                overlay={TooltipRenderer({ tip: "Decrease credit" })}
              >
                <Button variant="outline-warning" size="sm">
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
              <th>Current Credits</th>
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
