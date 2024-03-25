import React, { useEffect } from "react";
import { useAddNewAnnouncementMutation } from "./announcementsApiSlice";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { toast } from "react-toastify";
import { format } from "date-fns";
import useAnnouncementForm from "../../hooks/useAnnouncementForm";

const NewAnnouncementForm = () => {
  useTitle("Create Announcement | Via Mare HRIS");

  // eslint-disable-next-line
  const [addNewAnnouncement, { isLoading, isSuccess, isError, error }] =
    useAddNewAnnouncementMutation();

  const { username } = useAuth();

  const navigate = useNavigate();

  /* VARIABLES */
  const { state, dispatch } = useAnnouncementForm();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Announcement posted!");
      navigate("/dashboard");
    }
  }, [isSuccess, navigate]);

  /* HANDLERS */
  const onTitleChanged = (e) =>
    dispatch({ type: "input_title", title: e.target.value });
  const onMessageChanged = (e) =>
    dispatch({ type: "input_message", message: e.target.value });

  /* SUBMIT FUNCTION */
  const onSaveAnnouncementClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() && !isLoading) {
      const creationDate = format(new Date(), "Pp");
      await addNewAnnouncement({
        user: username,
        title: state.title,
        date: creationDate,
        message: state.message,
      });
    } else {
      e.stopPropagation();
    }

    // Show parts of the form that is valid or not
    dispatch({ type: "validated", validated: true });
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
            <h3>Create New Announcement</h3>
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
                onChange={onMessageChanged}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button variant="outline-success" type="submit">
            Add Announcement
          </Button>
        </Form>
      </Container>
    </>
  );
  return content;
};

export default NewAnnouncementForm;
