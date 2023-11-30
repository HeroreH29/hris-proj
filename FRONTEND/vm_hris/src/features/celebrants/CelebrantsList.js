import React from "react";
import { useGetPersonalinfosQuery } from "./celebrantsApiSlice";
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

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="text-danger">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = personalinfos;
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const monthName = date.toLocaleString("default", { month: "long" });

    const tableContent = ids?.length
      ? ids.map((personalInfoId) => {
          const birthday = new Date(entities[personalInfoId].Birthday);
          const birthmonth = birthday.getMonth() + 1;

          if (currentMonth === birthmonth) {
            return (
              <Celebrant key={personalInfoId} personalInfoId={personalInfoId} />
            );
          }
        })
      : null;

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
