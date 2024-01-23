import React, { useState, useEffect } from "react";
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

const EditAnnouncementForm = ({ users, announcement }) => {
  useTitle("Edit Announcement | Via Mare HRIS");

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
  const [title, setTitle] = useState(announcement.title);
  const [date, setDate] = useState(announcement.date);
  const [message, setMessage] = useState(announcement.message);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setDate("");
      setMessage("");
      isSuccess && toast.success("Changes saved!");
      isDelSuccess && toast.info("Announcement deleted!");
      navigate("/dashboard");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  /* HANDLERS */
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDateChanged = (e) => setDate(e.target.value);
  const onMessageChanged = (e) => setMessage(e.target.value);

  /* SUBMIT FUNCTION */
  const onSaveAnnouncementClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() === true && !isLoading) {
      await updateAnnouncement({
        id: announcement.id,
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

  /* DELETE FUNCTION */
  const onDeleteAnnouncement = async (e) => {
    const isConfirmed = window.confirm(`Delete this announcement?`);
    if (isConfirmed) {
      await deleteAnnouncement({ id: announcement.id });
    }
  };

  const [validated, setValidated] = useState(false);

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
                value={title}
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
                value={date}
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
                value={message}
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
