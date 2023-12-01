import React from "react";
import {
  useGetPersonalinfosQuery,
  useGetGeninfosQuery,
} from "./celebrantsApiSlice";
import Celebrant from "./Celebrant";
import { Table, Container } from "react-bootstrap";

const CelebrantsList = () => {
  const {
    data: personalinfos,
    isLoading,
    isSuccess,
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

  if (isLoading || isGenLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="text-danger">{error?.data?.message}</p>;
  }

  if (isSuccess || isGenSuccess) {
    const { ids: pIds, entities: pEntities } = personalinfos;
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const monthName = date.toLocaleString("default", { month: "long" });

    const celebrants = pIds?.length
      ? pIds.filter((personalInfoId) => {
          const birthday = new Date(pEntities[personalInfoId].Birthday);
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
              g.EmployeeID === pEntities[celebrant].EmployeeID &&
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
        <h3>Birthday Celebrants for {monthName}</h3>
        <Table responsive bordered striped hover className="align-middle m-3">
          <thead>
            <tr>
              <th scope="col">Celebrant</th>
              <th scope="col">Birthday</th>
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
