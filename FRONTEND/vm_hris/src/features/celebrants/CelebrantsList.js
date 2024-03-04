import React from "react";
import { useGetPersonalinfosQuery } from "./pCelebrantsApiSlice";
import { useGetGeninfosQuery } from "./gCelebrantsApiSlice";
import Celebrant from "./Celebrant";
import { Table, Container, Spinner } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const CelebrantsList = () => {
  const { isHR, isAdmin, isOutletProcessor, userLeve, branch } = useAuth();

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
    const currentDate = date.getDate();

    const celebrants = ids?.length
      ? ids
          .filter((personalInfoId) => {
            const birthday = new Date(entities[personalInfoId].Birthday);
            const birthmonth = birthday.getMonth() + 1;

            return currentMonth === birthmonth;
          })
          .reduce((acc, personalInfoId) => {
            const birthday = new Date(entities[personalInfoId].Birthday);
            const birthmonth = birthday.getMonth() + 1;
            const isCurrentDay =
              currentMonth === birthmonth && birthday.getDate() === currentDate;

            return isCurrentDay
              ? [personalInfoId, ...acc] // Move current day celebrants to the top
              : [...acc, personalInfoId]; // Append others
          }, [])
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
                branch: matchingRecord.AssignedOutlet,
              }
            : null;
        })
      : [];

    tableContent = activeWithNames
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
            personalInfoId={celebrant?.celebrantId}
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
