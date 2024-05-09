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
  faLeftLong,
  faLevelUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import useTitle from "../../hooks/useTitle";
import TooltipRenderer from "../../xtra_functions/TooltipRenderer";
import useAuth from "../../hooks/useAuth";

const ContentLayout = ({ backTo = "", title = "" }) => {
  const { isHR, isAdmin } = useAuth();
  const { id, employeeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isNew = location.pathname.includes("new");
  const isEdit = !isNew && (id || employeeId);
  const isLeave = location.pathname.includes("leaves");
  const isCreditIncrease = location.pathname.includes("increasecredits");

  let pageTitle = "";
  if (isNew) {
    pageTitle = `New ${title}`;
  } else if (isEdit) {
    pageTitle = `Edit ${title}`;
  } else if (isCreditIncrease) {
    pageTitle = `Increase Credits`;
  } else {
    pageTitle = `${title}s`;
  }

  return (
    <Container>
      <Row>
        {/* Back button */}
        {(isNew || isEdit || isCreditIncrease) && (
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
            {!isNew && !isEdit && !isCreditIncrease && (
              <OverlayTrigger
                overlay={TooltipRenderer({ tip: `New ${title}` })}
              >
                <Button
                  variant="outline-primary"
                  onClick={() => navigate(`${location.pathname}/new`)}
                >
                  <FontAwesomeIcon icon={isLeave ? faFileAlt : faPlus} />
                </Button>
              </OverlayTrigger>
            )}

            {isLeave &&
              !isNew &&
              !isEdit &&
              !isCreditIncrease &&
              (isAdmin || isHR) && (
                <OverlayTrigger
                  overlay={TooltipRenderer({ tip: `Increase Credit` })}
                >
                  <Button
                    variant="outline-success"
                    onClick={() =>
                      navigate(`${location.pathname}/increasecredits`)
                    }
                  >
                    <FontAwesomeIcon icon={faLevelUp} />
                  </Button>
                </OverlayTrigger>
              )}
          </Stack>
        </Col>
      </Row>
      <Outlet />
    </Container>
  );
};

export default ContentLayout;
