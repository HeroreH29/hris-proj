import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { OUTLET_EMAILS } from "../config/outletEmailOptions";
import { useSendEmailMutation } from "../features/emailSender/sendEmailApiSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetOutletEmailsQuery } from "../features/emailSender/outletEmailsApiSlice";

const RecordToOutletModal = ({
  showOutletPicker,
  setShowOutletPicker,
  geninfo,
  personalinfo,
}) => {
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedOutletName, setSelectedOutletName] = useState("");
  const { employeeId } = useParams();

  const [
    sendEmail,
    {
      isLoading: isEmailLoading,
      isSuccess: isEmailSuccess,
      isError: isEmailError,
      error: emailErr,
    },
  ] = useSendEmailMutation();

  const {
    data: outletEmails,
    isSuccess: isOutletEmailSuccess,
    isLoading: isOutletEmailLoading,
    isError: isOutletEmailError,
    error: outletEmailErr,
  } = useGetOutletEmailsQuery();

  const handleSendToOutlet = async () => {
    let emailMsg = {
      email: OUTLET_EMAILS[selectedOutletName],
      subject: `Employee Record for ${selectedOutletName}`,
      message: `Good day,\n\nThis email contains an employee record for this branch/outlet sent by VM HR Department.\nKindly upload the attached file to your system. ASAP.\n\n\n*PLEASE DO NOT REPLY TO THIS EMAIL*`,
      attachments: [
        {
          filename: `${employeeId}-RecordInfo.json`,
          content: JSON.stringify([
            { GenInfo: geninfo, PersonalInfo: personalinfo },
          ]),
          contentType: "application/json",
        },
      ],
    };

    await sendEmail(emailMsg).unwrap();
  };

  useEffect(() => {
    if (isEmailLoading) {
      toast.loading("Sending record...", { containerId: "A" });
    }
    if (isEmailSuccess) {
      toast.dismiss();
      toast.success(`Record sent successfully thru ${selectedOutlet}'s email`, {
        containerId: "A",
      });
      setShowOutletPicker(false);
      setSelectedOutlet("");
    }
    if (isEmailError) {
      toast.error(`Error occurred while sending record: ${emailErr}`, {
        containerId: "A",
      });
    }
    // eslint-disable-next-line
  }, [isEmailSuccess, isEmailLoading, isEmailError, emailErr]);

  if (isOutletEmailError)
    return <p>{`Error has occured: ${outletEmailErr?.message}`}</p>;

  if (isOutletEmailLoading) return <Spinner animation="border" />;

  if (isOutletEmailSuccess) {
    const { ids, entities } = outletEmails;

    return (
      <Modal show={showOutletPicker} onHide={() => setShowOutletPicker(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pick an outlet to send...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            value={selectedOutlet}
            onChange={(e) => {
              setSelectedOutlet(e.target.value);
              setSelectedOutletName(
                e.target.selectedOptions[0].getAttribute("data-key")
              );
            }}
          >
            <option value="" key="default">
              Select an outlet...
            </option>
            {ids
              .filter((id) => entities[id].outletName !== "admin")
              .map((id) => (
                <option
                  key={id}
                  value={entities[id].email}
                  data-key={entities[id].outletName}
                >
                  {entities[id].outletName}
                </option>
              ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={!selectedOutlet}
            variant="outline-success"
            onClick={handleSendToOutlet}
          >
            Send to {!selectedOutletName ? "..." : selectedOutletName}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
};

export default RecordToOutletModal;
