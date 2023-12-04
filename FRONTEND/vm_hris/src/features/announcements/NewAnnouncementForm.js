import React, { useEffect, useState } from "react";
import { useAddNewAnnouncementMutation } from "./announcementsApiSlice";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col, Row, Container } from "react-bootstrap";

const NewAnnouncementForm = ({ users }) => {
  const [addNewAnnouncement, { isLoading, isSuccess, isError, error }] =
    useAddNewAnnouncementMutation();

  const navigate = useNavigate();

  /* VARIABLES */
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setDate("");
      setMessage("");

      navigate("/dashboard/announcements");
    }
  }, [isSuccess, navigate]);

  /* HANDLERS */
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDateChanged = (e) => setDate(e.target.value);
  const onMessageChanged = (e) => setMessage(e.target.value);

  /* SUBMIT FUNCTION */
  const onSaveAnnouncementClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() === true && !isLoading) {
      await addNewAnnouncement({
        title,
        date,
        message,
      });
    } else {
      e.stopPropagation();
    }

    // Show parts of the form that is valid or not
    setValidated(true);
  };

  const [validated, setValidated] = useState(false);

  const content = (
    <>
      <Container>
        <h3>Create New Announcement</h3>
        <Form
          className="p-3"
          noValidate
          validated={validated}
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
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Date</Form.Label>
              <Form.Control
                required
                type="date"
                autoComplete="off"
                placeholder="Date"
                onChange={onDateChanged}
              />
              <Form.Control.Feedback type="invalid">
                Date is required
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
