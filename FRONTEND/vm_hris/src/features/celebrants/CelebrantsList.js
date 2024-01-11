import React from "react";
import { useGetPersonalinfosQuery } from "./pCelebrantsApiSlice";
import { useGetGeninfosQuery } from "./gCelebrantsApiSlice";
import Celebrant from "./Celebrant";
import { Table, Container, Row, Col, Spinner } from "react-bootstrap";
import PulseLoader from "react-spinners/PulseLoader";

const CelebrantsList = () => {
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
    // eslint-disable-next-line
    isError: isGenErr,
    // eslint-disable-next-line
    error: generr,
  } = useGetGeninfosQuery();

  let content;

  if (isPersLoading || isGenLoading)
    return (content = <Spinner animation="border" />);

  if (isError)
    return (content = (
      <h5 className="text-secondary">{error?.data?.message}</h5>
    ));

  let tableContent;
  if (isPersSuccess && isGenSuccess) {
    const { ids, entities } = personalinfos;
    const date = new Date();
    const currentMonth = date.getMonth() + 1;

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

    tableContent = activeWithNames
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
  }

  content = (
    <Container
      className="border"
      style={{ maxHeight: "500px", overflowY: "scroll" }}
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
