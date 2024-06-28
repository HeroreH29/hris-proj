import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditGenInfoForm from "./EditGenInfoForm";
import {
  useGetDependentsQuery,
  useGetDocumentsQuery,
  useGetEducinfosQuery,
  useGetGeninfosQuery,
  useGetPersonalinfosQuery,
  useGetWorkinfosQuery,
  useGetInactiveEmpsQuery,
  useGetTrainingHistoriesQuery,
  useAddGeninfoMutation,
  useAddPersonalinfoMutation,
} from "./recordsApiSlice";
import {
  Spinner,
  Tab,
  Tabs,
  Container,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLeftLong,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import EditPersonalInfoForm from "./EditPersonalInfoForm";
import DependentsList from "./DependentsList";
import WorkInfosList from "./WorkInfosList";
import EducInfoList from "./EducInfosList";
import useTitle from "../../hooks/useTitle";
import TrainingHistoryList from "./TrainingHistoryList";
import PrintEmployeeRecord from "./PrintEmployeeRecord";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import RecordToOutletModal from "../../modals/RecordToOutletModal";

const refetchInterval = 15000;

const EditRecord = () => {
  const { employeeId } = useParams();
  const { isX } = useAuth();

  useTitle(`${employeeId ? "Edit Record" : "Add Record"} | Via Mare HRIS`);

  const [
    addGeninfo,
    {
      isSuccess: isGenSuccess,
      isLoading: isGenLoading,
      isError: isGenError,
      error: genErr,
    },
  ] = useAddGeninfoMutation();

  const [
    addPersonainfo,
    {
      isSuccess: isPersonalSuccess,
      isLoading: isPersonalLoading,
      isError: isPersonalError,
      err: personalErr,
    },
  ] = useAddPersonalinfoMutation();

  const navigate = useNavigate();

  const [showOutletPicker, setShowOutletPicker] = useState(false);

  // Fetch general info using Employee ID
  const { geninfo } = useGetGeninfosQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      geninfo: data?.ids
        .filter((id) => data.entities[id].EmployeeID.toString() === employeeId)
        .map((id) => data.entities[id])[0],
    }),
    pollingInterval: refetchInterval,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Fetch personal info using Employee ID
  const { personalinfo } = useGetPersonalinfosQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      personalinfo: data?.ids
        .filter(
          (id) => data?.entities[id]?.EmployeeID?.toString() === employeeId
        )
        .map((id) => data?.entities[id])[0],
    }),
    pollingInterval: refetchInterval,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Fetch dependents using EmployeeID
  const { dependents } = useGetDependentsQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      dependents: data?.ids
        .filter((id) => data?.entities[id].EmployeeID.toString() === employeeId)
        .map((id) => data?.entities[id]),
    }),
    pollingInterval: refetchInterval,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Fetch educinfos using EmployeeID
  const { educinfos } = useGetEducinfosQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      educinfos: data?.ids
        .filter(
          (id) => data?.entities[id]?.EmployeeID?.toString() === employeeId
        )
        .map((id) => data?.entities[id]),
    }),
    pollingInterval: refetchInterval,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Fetch workinfos using EmployeeID
  const { workinfos } = useGetWorkinfosQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      workinfos: data?.ids
        .filter((id) => data?.entities[id].EmployeeID.toString() === employeeId)
        .map((id) => data?.entities[id]),
    }),
    pollingInterval: refetchInterval,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Fetch document using document name (filename)
  const { document } = useGetDocumentsQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      document: data?.ids
        ?.filter(
          (id) =>
            data?.entities?.[id]?.filename.toString() === "employee-record"
        )
        .map((id) => data?.entities[id]),
    }),
  });

  // Fetch workinfos using EmployeeID
  const { inactiveEmp } = useGetInactiveEmpsQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      inactiveEmp: data?.ids
        .filter((id) => data?.entities[id].EmployeeID.toString() === employeeId)
        .map((id) => data?.entities[id])[0],
    }),
    pollingInterval: refetchInterval,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Fetch training/seminar history using EmployeeID
  const { trainingHistories } = useGetTrainingHistoriesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      trainingHistories: data?.ids
        .filter((id) => data?.entities[id].EmployeeID.toString() === employeeId)
        .map((id) => data?.entities[id]),
    }),
    pollingInterval: refetchInterval,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (
    !geninfo &&
    !personalinfo &&
    !dependents &&
    !workinfos &&
    !educinfos &&
    !document &&
    !inactiveEmp &&
    !trainingHistories
  ) {
    content = <Spinner animation="border" />;
  }

  const handlePrintEmployeeRecord = async () => {
    await PrintEmployeeRecord({
      document: document,
      geninfo: geninfo,
      personalinfo: personalinfo,
      dependents: dependents,
      educinfos: educinfos,
      workinfos: workinfos,
    });
  };

  const handleEmployeeRecordUpload = async (file) => {
    if (!file.type.startsWith("application/json")) {
      return toast.error("Invalid file type. Please upload a '.json' file", {
        containerId: "A",
      });
    }
    const reader = new FileReader();

    reader.onload = async (e) => {
      const infoData = JSON.parse(e.target.result);
      const genInfo = infoData[0].GenInfo; // Gen Info
      const persInfo = infoData[0].PersonalInfo; // Personal Info

      // Gen Info upload
      await addGeninfo(genInfo);
      await addPersonainfo(persInfo);
    };

    // Error catcher
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    if (isGenLoading && isPersonalLoading) {
      toast.loading(`Uploading data to server...`, { containerId: "A" });
    }
    if (isGenSuccess && isPersonalSuccess) {
      toast.dismiss();
      toast.success("Data uploaded to server!", { containerId: "A" });
      navigate("/employeerecords");
    }
    if (isGenError && isPersonalError) {
      toast.error(
        `Error occurred while uploading data to server: ${genErr?.data}|${personalErr?.data}`,
        { containerId: "A" }
      );
    }
  }, [
    isGenSuccess,
    isGenLoading,
    isPersonalLoading,
    isPersonalSuccess,
    isGenError,
    isPersonalError,
    genErr,
    personalErr,
  ]);

  content = (
    <Container>
      <Row className="mb-3">
        <Col md="auto">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/employeerecords")}
          >
            <FontAwesomeIcon icon={faLeftLong} />
          </Button>
        </Col>
        <Col>
          <div>
            <h3>{employeeId ? "Edit Record" : "Add Record"}</h3>
            {isX.isOutletProcessor ? (
              <></>
            ) : !employeeId ? (
              <small className="text-decoration-underline fw-semibold fst-italic text-primary">
                You can ONLY add GENERAL INFO for now. Add other details later.
              </small>
            ) : (
              <small className="text-decoration-underline fw-semibold fst-italic">
                Click any from the navigation tab to reveal the information
              </small>
            )}
          </div>
        </Col>
        {!employeeId && isX.isOutletProcessor ? (
          <Form.Group as={Col}>
            <Form.Label className="fw-semibold">
              Or upload a record file here...
            </Form.Label>
            <Form.Control
              type="file"
              size="sm"
              onChange={(e) => handleEmployeeRecordUpload(e.target.files[0])}
            />
          </Form.Group>
        ) : (
          employeeId &&
          (isX.isAdmin || isX.isProcessor) && (
            <Col md="auto">
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => setShowOutletPicker(true)}
              >
                <span className="me-2">Send record to outlet</span>
                <FontAwesomeIcon icon={faEnvelope} />
              </Button>
            </Col>
          )
        )}
      </Row>
      <Tabs
        className="p-3 mb-3"
        defaultActiveKey={employeeId ? "" : "geninfo"}
        justify
      >
        <Tab eventKey="geninfo" title="General Info" unmountOnExit={true}>
          <EditGenInfoForm geninfo={geninfo} inactiveEmp={inactiveEmp} />
        </Tab>
        <Tab
          eventKey="personalinfo"
          title="Personal Info"
          unmountOnExit={true}
          disabled={!employeeId || isX.isOutletProcessor}
        >
          <EditPersonalInfoForm
            employeeId={employeeId}
            AssignedOutlet={geninfo?.AssignedOutlet}
            personalinfo={personalinfo}
          />
        </Tab>
        <Tab
          eventKey="dependents"
          title="Dependents"
          unmountOnExit={true}
          disabled={!employeeId || isX.isOutletProcessor}
        >
          <DependentsList
            dependents={dependents}
            AssignedOutlet={geninfo?.AssignedOutlet}
            employeeId={employeeId}
          />
        </Tab>
        <Tab
          eventKey="educinfo"
          title="Educational Attainment"
          unmountOnExit={true}
          disabled={!employeeId || isX.isOutletProcessor}
        >
          <EducInfoList
            AssignedOutlet={geninfo?.AssignedOutlet}
            educinfos={educinfos}
            employeeId={employeeId}
          />
        </Tab>
        <Tab
          eventKey="workinfo"
          title="Employment History"
          unmountOnExit={true}
          disabled={!employeeId || isX.isOutletProcessor}
        >
          <WorkInfosList
            AssignedOutlet={geninfo?.AssignedOutlet}
            workinfos={workinfos}
            employeeId={employeeId}
          />
        </Tab>
        <Tab
          eventKey="traininghistory"
          title="Training History"
          unmountOnExit={true}
          disabled={!employeeId || isX.isOutletProcessor}
        >
          <TrainingHistoryList trainingHistories={trainingHistories} />
        </Tab>
        <Tab
          title="Print record"
          disabled={!employeeId || !personalinfo || isX.isOutletProcessor}
          eventKey={"printrecord"}
          unmountOnExit={true}
        >
          <div className="text-center">
            <Button
              variant="outline-primary"
              onClick={handlePrintEmployeeRecord}
            >
              Click here to print record{" "}
              <FontAwesomeIcon className="ms-2" icon={faPrint} />
            </Button>
          </div>
        </Tab>
      </Tabs>

      {(isX.isAdmin || isX.isProcessor) && (
        <RecordToOutletModal
          showOutletPicker={showOutletPicker}
          setShowOutletPicker={setShowOutletPicker}
          geninfo={geninfo}
          personalinfo={personalinfo}
          dependents={dependents}
          educinfos={educinfos}
          workinfos={workinfos}
          trainingHistories={trainingHistories}
        />
      )}
    </Container>
  );

  return content;
};

export default EditRecord;
