import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { OUTLET_EMAILS } from "../config/outletEmailOptions";
import { useSendEmailMutation } from "../features/emailSender/sendEmailApiSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const RecordToOutletModal = ({
  showOutletPicker,
  setShowOutletPicker,
  geninfo,
  personalinfo,
}) => {
  const [selectedOutlet, setSelectedOutlet] = useState("");
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

  const handleSendToOutlet = async () => {
    let emailMsg = {
      email: OUTLET_EMAILS[selectedOutlet],
      subject: `Employee Record for ${selectedOutlet}`,
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

  return (
    <Modal
      show={showOutletPicker}
      onHide={() => {
        setSelectedOutlet("");
        setShowOutletPicker(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Pick an outlet to send...</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Select
          value={selectedOutlet}
          onChange={(e) => setSelectedOutlet(e.target.value)}
        >
          <option value="" key="1">
            Select an outlet...
          </option>
          {Object.entries(OUTLET_EMAILS)
            .filter(([key]) => key !== "admin")
            .map(([key, value]) => {
              return (
                <option key={key} value={key}>
                  {key}
                </option>
              );
            })}
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={!selectedOutlet}
          variant="outline-success"
          onClick={handleSendToOutlet}
        >
          Send to {!selectedOutlet ? "" : selectedOutlet}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecordToOutletModal;
