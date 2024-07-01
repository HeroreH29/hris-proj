import React, { useEffect } from "react";
import {
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from "./announcementsApiSlice";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import useTitle from "../../hooks/useTitle";
import { toast } from "react-toastify";
import useAnnouncementForm from "../../hooks/useAnnouncementForm";

const EditAnnouncementForm = ({ announcement }) => {
  useTitle("Edit Announcement | HRIS Project");

  // eslint-disable-next-line
  const [updateAnnouncement, { isLoading, isSuccess, isError, error }] =
    useUpdateAnnouncementMutation();

  const [
    deleteAnnouncement,
    // eslint-disable-next-line
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteAnnouncementMutation();

  const navigate = useNavigate();

  /* VARIABLES */
  const { state, dispatch } = useAnnouncementForm({ announcement });

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      isSuccess && toast.success("Changes saved!");
      isDelSuccess && toast.info("Announcement deleted!");
      navigate("/dashboard");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  /* HANDLERS */
  const onTitleChanged = (e) =>
    dispatch({ type: "input_title", title: e.target.value });
  const onMessageChanged = (e) =>
    dispatch({ type: "input_message", message: e.target.value });

  /* SUBMIT FUNCTION */
  const onSaveAnnouncementClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() === true && !isLoading) {
      await updateAnnouncement({
        id: announcement.id,
        title: state.title,
        message: state.message,
      });
    } else {
      e.stopPropagation();
    }

    // Show parts of the form that is valid or not
    dispatch({ type: "validated", validated: true });
  };

  /* DELETE FUNCTION */
  const onDeleteAnnouncement = async (e) => {
    const isConfirmed = window.confirm(`Delete this announcement?`);
    if (isConfirmed) {
      await deleteAnnouncement({ id: announcement.id });
    }
  };

  const content = (
    <>
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
          <Col>
            <h3>Edit Announcement</h3>
          </Col>
        </Row>
        <Form
          className="p-3"
          noValidate
          validated={state.validated}
          onSubmit={onSaveAnnouncementClicked}
        >
          {/* Title and date */}
          <Row className="mb-3">
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Title</Form.Label>
              <Form.Control
                required
                autoFocus
                autoComplete="off"
                type="text"
                placeholder="Title"
                value={state.title}
                onChange={onTitleChanged}
              />
              <Form.Control.Feedback type="invalid">
                Title is required
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Message */}
          <Row className="mb-3 ">
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Message</Form.Label>
              <Form.Control
                required
                as={"textarea"}
                autoComplete="off"
                rows={10}
                placeholder="Message"
                value={state.message}
                onChange={onMessageChanged}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Col md={"auto"}>
              <Button variant="outline-success" type="submit">
                Save Changes
              </Button>
            </Col>
            <Col md={"auto"}>
              <Button
                variant="outline-danger"
                type="button"
                onClick={() => onDeleteAnnouncement()}
              >
                Delete Announcement
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );

  return content;
};

export default EditAnnouncementForm;
