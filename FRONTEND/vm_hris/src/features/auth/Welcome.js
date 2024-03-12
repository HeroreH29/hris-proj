import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import useAuth from "../../hooks/useAuth";
import AnnouncementsList from "../announcements/AnnouncementsList";
import CelebrantsList from "../celebrants/CelebrantsList";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import useContractNotif from "../../hooks/useContractNotif";

const Welcome = () => {
  const { isHR, isAdmin, userLevel } = useAuth();
  useTitle(`${userLevel} Dashboard | Via Mare HRIS`);

  const { data: geninfos, isSuccess } = useGetGeninfosQuery();

  const navigate = useNavigate();

  const date = new Date();
  const monthName = date.toLocaleString("default", { month: "long" });

  useContractNotif(geninfos, isSuccess, useAuth);

  const content = (
    <Container>
      <h3 className="pb-2">Dashboard</h3>
      <Row className="p-3">
        {/* Announcements */}
        <Col>
          <h3>
            HR Memos/Announcements{" "}
            {(isHR || isAdmin) && (
              <>
                <Button
                  className="float-end"
                  variant="outline-primary"
                  onClick={() => navigate("/dashboard/announcements/new")}
                >
                  <FontAwesomeIcon icon={faFileCirclePlus} />
                </Button>
              </>
            )}
          </h3>
          <small className="text-muted">
            {(isHR || isAdmin) && <>Click an announcement to edit</>}
          </small>
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
