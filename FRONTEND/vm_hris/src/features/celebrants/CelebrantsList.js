import React from "react";
import Celebrant from "./Celebrant";
import { Table, Container, Spinner } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { useGetCelebrantsQuery } from "./celebrantsApiSlice";

const CelebrantsList = () => {
  const { isOutletProcessor, branch } = useAuth();

  const {
    data: celebrants,
    isLoading: isCelebLoading,
    isSuccess: isCelebSuccess,
    isError,
    error,
  } = useGetCelebrantsQuery();

  let content;

  if (isCelebLoading) return (content = <Spinner animation="border" />);

  if (isError)
    return (content = (
      <h5 className="text-secondary">{error?.data?.message}</h5>
    ));

  let tableContent;
  if (isCelebSuccess) {
    tableContent = celebrants
      .filter((celebrant) => {
        let matches = true;

        if (isOutletProcessor) {
          matches = matches && celebrant?.branch === branch;
        }

        return matches;
      })
      .map((celebrant, index) => {
        return (
          <Celebrant
            key={index}
            birthday={celebrant?.birthday}
            name={celebrant?.name}
          />
        );
      });
  }

  content = (
    <Container
      className="border"
      style={{ maxHeight: "400px", overflowY: "scroll" }}
    >
      <Table bordered striped hover className="align-middle mt-2 caption-top">
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
};

export default CelebrantsList;
