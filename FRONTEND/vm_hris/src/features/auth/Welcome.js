import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import useAuth from "../../hooks/useAuth";
import AnnouncementsList from "../announcements/AnnouncementsList";
import CelebrantsList from "../celebrants/CelebrantsList";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import { parse, differenceInDays } from "date-fns";
import { toast } from "react-toastify";

const Welcome = () => {
  const { isHR, isAdmin, isOutletProcessor, userLevel } = useAuth();
  useTitle(`${userLevel} Dashboard | Via Mare HRIS`);

  const { data: geninfos, isSuccess } = useGetGeninfosQuery();

  const navigate = useNavigate();

  const date = new Date();
  const monthName = date.toLocaleString("default", { month: "long" });

  const EmployeeContractNotif = () => {
    const { ids, entities } = geninfos;

    const contractedEmployees = ids
      .filter((id) => entities[id]?.ContractDateEnd)
      .map((id) => entities[id]);

    contractedEmployees.forEach((employee) => {
      const contractDateEnd = parse(
        employee?.ContractDateEnd,
        "MMMM dd, yyyy",
        new Date()
      );
      const dateToday = new Date();

      if (contractDateEnd) {
        // Notify user when contract of an employee is about to end
        const daysLeft = differenceInDays(dateToday, contractDateEnd);

        daysLeft < 7 &&
          daysLeft > 0 &&
          toast.info(`Contract of "${employee?.EmployeeID}" will end soon`, {
            toastId: employee.EmployeeID,
            onClick: () => {
              const newTab = window.open("", "_blank");
              newTab.location.href = `/employeerecords/${employee.EmployeeID}`;
            },
          });

        console.log(daysLeft);

        daysLeft < 1 &&
          toast.warning(
            `Contract of "${employee?.EmployeeID}" already ended. Change it ASAP!`,
            {
              toastId: employee.EmployeeID,
              onClick: () => {
                const newTab = window.open("", "_blank");
                newTab.location.href = `/employeerecords/${employee.EmployeeID}`;
              },
            }
          );
      }
    });
  };

  useEffect(() => {
    if (isSuccess && (isHR || isAdmin || isOutletProcessor)) {
      EmployeeContractNotif();
    }
    // eslint-disable-next-line
  }, [isSuccess]);

  const content = (
    <Container>
      <h3 className="pb-2">Dashboard</h3>
      <Row className="p-3">
        {/* Announcements */}
        <Col>
          <h3>
            HR Memos/Announcements{" "}
            {isHR ||
              isAdmin ||
              (isOutletProcessor && (
                <>
                  <Button
                    className="float-end"
                    variant="outline-primary"
                    onClick={() => navigate("/dashboard/announcements/new")}
                  >
                    <FontAwesomeIcon icon={faFileCirclePlus} />
                  </Button>
                </>
              ))}
          </h3>
          <AnnouncementsList />
        </Col>
        <Col>
          <h3>Birthday Celebrants for {monthName}</h3>
          <CelebrantsList />
        </Col>
      </Row>
    </Container>
  );

  return content;
};

export default Welcome;
