import React from "react";
import { useGetPersonalinfosQuery } from "./pCelebrantsApiSlice";
import { useGetGeninfosQuery } from "./gCelebrantsApiSlice";
import Celebrant from "./Celebrant";
import { useNavigate } from "react-router-dom";
import { Table, Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const CelebrantsList = () => {
  const navigate = useNavigate();

  useTitle("Birthday Celebrants | Via Mare HRIS");

  const {
    data: personalinfos,
    isLoading: isPersLoading,
    isSuccess: isPersSuccess,
    isError,
    error,
  } = useGetPersonalinfosQuery();

  const {
    data: generalinfos,
    isLoading: isGenLoading,
    isSuccess: isGenSuccess,
    isError: isGenErr,
    error: generr,
  } = useGetGeninfosQuery();

  let content;

  if (isPersLoading || isGenLoading) return <PulseLoader color="#808080" />;

  if (isError)
    return (content = <p className="text-danger">{error?.data?.message}</p>);

  if (isPersSuccess && isGenSuccess) {
    const { ids, entities } = personalinfos;
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const monthName = date.toLocaleString("default", { month: "long" });

    const celebrants = ids?.length
      ? ids.filter((personalInfoId) => {
          const birthday = new Date(entities[personalInfoId].Birthday);
          const birthmonth = birthday.getMonth() + 1;

          return currentMonth === birthmonth;
        })
      : [];

    // Convert generalinfos to array so it can be iterated
    const generalinfosArray = Object.values(
      generalinfos ? generalinfos.entities : {}
    );

    const activeWithNames = celebrants.length
      ? celebrants.map((celebrant) => {
          const matchingRecord = generalinfosArray.find((g) => {
            return (
              g.EmployeeID === entities[celebrant].EmployeeID &&
              g.EmpStatus === "Y"
            );
          });

          return matchingRecord
            ? {
                celebrantId: celebrant,
                name: `${matchingRecord.FirstName} ${matchingRecord.LastName}`,
              }
            : null;
        })
      : [];

    const tableContent = activeWithNames
      .filter((celebrant) => celebrant !== null)
      .map((celebrant) => {
        return (
          <Celebrant
            key={celebrant.celebrantId}
            personalInfoId={celebrant.celebrantId}
            name={celebrant.name}
          />
        );
      });

    content = (
      <Container>
        <Row>
          <Col md="auto">
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/dashboard")}
            >
              <FontAwesomeIcon icon={faLeftLong} />
            </Button>
          </Col>
          <Col md="auto">
            <h3>Birthday Celebrants for {monthName}</h3>
          </Col>
        </Row>
        <Table
          bordered
          responsive
          striped
          hover
          className="align-middle m-3 caption-top"
        >
          <caption>Today's celebrant/s is/are highlighted</caption>
          <thead>
            <tr>
              <th>Celebrant</th>
              <th>Birthday</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </Table>
      </Container>
    );

    return content;
  }
};

export default CelebrantsList;
