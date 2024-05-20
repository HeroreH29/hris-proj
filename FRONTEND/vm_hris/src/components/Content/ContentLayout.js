import React from "react";
import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  OverlayTrigger,
  Stack,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faFileCirclePlus,
  faLeftLong,
  faLevelUp,
  faPlus,
  faUserLock,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import TooltipRenderer from "../../xtra_functions/TooltipRenderer";
import useAuth from "../../hooks/useAuth";

const ContentLayout = ({ backTo = "", title = "" }) => {
  const { isHR, isAdmin } = useAuth();
  const { id, employeeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isUser = location.pathname.includes("users");
  const isUserAccess = location.pathname.includes("useraccess");
  const isLeave = location.pathname.includes("leaves");
  const isCreditIncrease = location.pathname.includes("increasecredits");
  const isNew = location.pathname.includes("new");
  const isEdit = !isNew && (id || employeeId);

  let pageTitle = "";
  if (isNew) {
    pageTitle = `New ${title}`;
  } else if (isEdit) {
    pageTitle = `Edit ${title}`;
  } else if (isCreditIncrease) {
    pageTitle = `Increase Credits`;
  } else if (isUserAccess) {
    pageTitle = `${title} Access`;
  } else {
    pageTitle = `${title}s`;
  }

  return (
    <Container>
      <Row>
        {/* Back button */}
        {(isNew || isEdit || isCreditIncrease || isUserAccess) && (
          <Col md="auto">
            <Button
              variant="outline-secondary"
              onClick={() => navigate(backTo)}
            >
              <FontAwesomeIcon icon={faLeftLong} />
            </Button>
          </Col>
        )}
        {/* Content title */}
        <Col>
          <h3>{pageTitle}</h3>
        </Col>
        {/* Extra buttons */}
        <Col md="auto">
          <Stack direction="horizontal" gap={1}>
            {/* Users page */}
            {isUser && !isUserAccess && !isNew && !isEdit && (
              <>
                <OverlayTrigger
                  overlay={TooltipRenderer({ tip: `New ${title}` })}
                >
                  <Button
                    variant="outline-success"
                    onClick={() => navigate(`${location.pathname}/new`)}
                  >
                    <FontAwesomeIcon icon={faUserPlus} />
                  </Button>
                </OverlayTrigger>
                {/* Hidden = UNDER DEVELOPMENT = */}
                {/* <OverlayTrigger
                  overlay={TooltipRenderer({ tip: `${title} Access` })}
                >
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate(`${location.pathname}/useraccess`)}
                  >
                    <FontAwesomeIcon icon={faUserLock} />
                  </Button>
                </OverlayTrigger> */}
              </>
            )}

            {/* Leaves page */}
            {isLeave && !isCreditIncrease && !isNew && !isEdit && (
              <>
                <OverlayTrigger overlay={TooltipRenderer({ tip: "New Leave" })}>
                  <Button
                    variant="outline-success"
                    onClick={() => navigate(`${location.pathname}/new`)}
                  >
                    <FontAwesomeIcon icon={faFileCirclePlus} />
                  </Button>
                </OverlayTrigger>
                {/* <OverlayTrigger
                overlay={TooltipRenderer({ tip: `${title} Access` })}
              >
                <Button
                  variant="outline-primary"
                  onClick={() => navigate(`${location.pathname}/useraccess`)}
                >
                  <FontAwesomeIcon icon={faUserLock} />
                </Button>
              </OverlayTrigger> */}
              </>
            )}
          </Stack>
        </Col>
      </Row>
      <Outlet />
    </Container>
  );
};

export default ContentLayout;
