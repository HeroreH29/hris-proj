import React from "react";
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
} from "./recordsApiSlice";
import {
  Spinner,
  Tab,
  Tabs,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faPrint } from "@fortawesome/free-solid-svg-icons";
import EditPersonalInfoForm from "./EditPersonalInfoForm";
import DependentsList from "./DependentsList";
import WorkInfosList from "./WorkInfosList";
import EducInfoList from "./EducInfosList";
import { PDFDocument } from "pdf-lib";
import { format } from "date-fns";
import useTitle from "../../hooks/useTitle";
import { toast } from "react-toastify";
import { FONTS } from "../../config/fontBase64";
import fontkit from "@pdf-lib/fontkit";

const refetchInterval = 15000;

const EditRecord = () => {
  const { employeeId } = useParams();

  useTitle(`${employeeId ? "Edit Record" : "Add Record"} | Via Mare HRIS`);

  const navigate = useNavigate();

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

  if (
    !geninfo &&
    !personalinfo &&
    !dependents &&
    !workinfos &&
    !educinfos &&
    !document &&
    !inactiveEmp
  ) {
    return <Spinner animation="border" />;
  }

  const handlePrintEmployeeRecord = async () => {
    try {
      const formUrl = `data:application/pdf;base64,${document?.[0]?.data}`;
      const formPdfBytes = await fetch(formUrl).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(formPdfBytes);
      const form = pdfDoc.getForm();
      pdfDoc.registerFontkit(fontkit);
      const fontSize = 14;
      const workSans = await pdfDoc.embedFont(FONTS.WorkSansRegular);
      const workSansItalic = await pdfDoc.embedFont(FONTS.WorkSansItalic);
      const workSansBoldItalic = await pdfDoc.embedFont(
        FONTS.WorkSansBoldItalic
      );
      const gazpachoRegularItalic = await pdfDoc.embedFont(
        FONTS.GazpachoRegularItalic
      );

      // Function to find fields on the document
      const FieldFinder = (fieldName, altFieldName) => {
        let row = form.getFieldMaybe(fieldName);
        if (!row) {
          row = form.getField(altFieldName);
        }
        let rowName = row.getName();
        return form.getTextField(rowName);
      };

      /* const fields = form.getFields();
      fields.forEach((field) => {
        const type = field.constructor.name;
        const name = field.getName();
        console.log(`${type}: ${name}`);
      }); */

      try {
        const formEducAttain = [
          "Institution_Name",
          "Address",
          "CourseDegreeStrand",
          "YearAttended",
        ];
        const formEmpHist = [
          "Position_Title",
          "Company_Name",
          "WorkAddress",
          "LengthOfStay",
        ];

        const genInfoValArr = [
          "JobTitle",
          "EmployeeID",
          "BioID",
          "EmployeeType",
          "AssignedOutlet",
          "Department",
          "TINnumber",
          "SSSnumber",
          "PHnumber",
          "PInumber",
          "DateEmployed",
          "DateProbationary",
          "RegDate",
          "Notes",
          "DateLeaved",
          "EmpStatus",
        ];

        const personalInfoValArr = [
          "Birthday",
          "Gender",
          "Email",
          "PresentAddress",
          "PermanentAddress",
          "ZipCode",
          "FatherName",
          "MotherName",
          "Foccupation",
          "Moccupation",
          "Height",
          "Weight",
          "Mobile",
          "Phone",
          "CivilStatus",
          "Spouse",
        ];

        const depValArr = [
          "Names",
          "Dependent",
          "Birthday",
          "Status",
          "Relationship",
          "Covered",
        ];

        const employeeName = FieldFinder(
          "EmployeeName",
          `undefined.EmployeeName`
        );
        employeeName.setText(
          `${geninfo.LastName}, ${geninfo.FirstName} ${geninfo.MI}.`
        );

        const empNameTxtLength = employeeName.getText().length;
        employeeName.setFontSize(fontSize - empNameTxtLength * 0.1);
        employeeName.updateAppearances(workSans);

        let txtLength = 0;

        genInfoValArr.forEach((e) => {
          //const element = form.getTextField(e);
          const element = FieldFinder(e, `undefined.${e}`);

          if (e === "EmpStatus") {
            element.setText(
              String(geninfo?.[e]) === "Y" ? "Active" : "Inactive"
            );
          } else if (e.includes("Date")) {
            if (geninfo?.[e]) {
              const formattedDate = format(
                new Date(geninfo?.[e]),
                "MMM dd, yyyy"
              );
              element.setText(formattedDate);
            } else {
              element.setText("");
            }
          } else {
            element.setText(geninfo[e] ? String(geninfo[e]) : "");
          }

          if (element.getText()) {
            txtLength = element.getText().length ? element.getText().length : 0;
          }
          element.setFontSize(fontSize - txtLength * 0.2);
          element.updateAppearances(workSans);
        });

        personalInfoValArr.forEach((e) => {
          //const element = form.getTextField(e);
          const element = FieldFinder(e, `undefined.${e}`);

          if (e === "PresentAddress") {
            element.setText(
              personalinfo?.PresentAddress
                ? personalinfo?.PresentAddress
                : personalinfo?.Address
            );
          } else if (e === "PermanentAddress") {
            element.setText(
              personalinfo.PermanentAddress ? personalinfo.PermanentAddress : ""
            );
          } else if (e === "Email") {
            element.setText(personalinfo[e] ? String(personalinfo[e]) : "");
          } else {
            element.setFontSize(fontSize - 3);
            element.setText(personalinfo[e] ? String(personalinfo[e]) : "");
          }
          element.updateAppearances(workSans);
        });

        dependents
          .sort((a, b) => new Date(a.Birthday) - new Date(b.Birthday))
          .forEach((d, i) => {
            depValArr.forEach((e) => {
              //const element = form.getTextField(`${e}Row${i + 1}`);
              const element = FieldFinder(
                `${e}${i + 1}`,
                `undefined.${e}${i + 1}`
              );

              if (element) {
                if (e === "Covered") {
                  element.setText(String(d[e]) === "1" ? "Yes" : "No");
                } else {
                  element.setText(String(d[e]));
                }
              } else {
                console.warn(`Element ${e}${i + 1} not found.`);
              }

              if (e !== "Names") {
                element.setFontSize(fontSize - 2);
              }
              element.updateAppearances(workSans);
            });
          });

        educinfos.forEach((e, i) => {
          formEducAttain.forEach((val) => {
            // const element = form.getTextField(`${val}Row${i + 1}`);
            const element = FieldFinder(
              `${val}${i + 1}`,
              `undefined.${val}${i + 1}`
            );

            if (val === "CourseDegreeStrand") {
              element.setText(
                `${e?.Field_of_Study} | ${e?.Degree} | ${e?.Major} (${e?.Level})`
              );
            } else if (val === "YearAttended") {
              element.setText(`${e?.yrStart} - ${e?.yrGraduated}`);
            } else {
              element.setText(e?.[val]);
            }
            element.setFontSize(fontSize - 5);
            element.updateAppearances(workSans);
          });
        });

        workinfos.forEach((w, i) => {
          formEmpHist.forEach((val) => {
            // const element = form.getTextField(`${val}Row${i + 1}`);
            const element = FieldFinder(
              `${val}${i + 1}`,
              `undefined.${val}${i + 1}`
            );

            if (val === "LengthOfStay") {
              element.setText(
                `${w?.JoinedFR_M} ${w?.JoinedFR_Y} - ${w?.JoinedTO_M} ${w?.JoinedTO_Y}`
              );
            } else if (val === "WorkAddress") {
              element.setText(`${w?.State}, ${w?.Country}`);
            } else {
              element.setText(String(w?.[val]));
            }
            element.setFontSize(fontSize - 5);
            element.updateAppearances(workSans);
          });
        });

        const pages = pdfDoc.getPages();
        const thirdPage = pages[2];
        const { height, width } = thirdPage.getSize();
        const text = `"The information contained in this document is confidential and intended solely for the recipient. Unauthorized disclosure, copying, or distribution of this content is strictly prohibited. Any breach of confidentiality will be subject to legal action. This document also includes confidential information related to Via Mare Corporation and may only be requested within the organization."\n- Via Mare Corp. (${new Date()
          .getFullYear()
          .toString()})`;

        thirdPage.drawText("Date Printed:", {
          x: width * 0.06,
          y: height * 0.55,
          size: fontSize - 4,
          font: workSansBoldItalic,
          opacity: 0.5,
        });
        thirdPage.drawText(`${format(new Date(), "PPPP")}`, {
          x: width * 0.2,
          y: height * 0.55,
          size: fontSize - 4,
          font: workSansItalic,
          opacity: 0.5,
        });
        thirdPage.drawText(text, {
          y: height * 0.4,
          x: width * 0.04,
          size: fontSize - 6,
          font: gazpachoRegularItalic,
          opacity: 0.5,
          lineHeight: fontSize - 2,
          maxWidth: 550,
          wordBreaks: [" "],
        });

        const pdfBytes = await pdfDoc.save();

        const blobUrl = URL.createObjectURL(
          new Blob([pdfBytes], { type: "application/pdf" })
        );

        toast.success("Record generated!");
        window.open(blobUrl, "_blank");
      } catch (error) {
        console.error("formFill error: ", error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
            {!employeeId && (
              <small className="text-decoration-underline">
                You can only add GENERAL INFO for now. Add other details later.
              </small>
            )}
          </div>
        </Col>
      </Row>
      <Tabs className="p-3 mb-3" defaultActiveKey="geninfo" fill>
        <Tab eventKey="geninfo" title="General Info" unmountOnExit={true}>
          <EditGenInfoForm geninfo={geninfo} inactiveEmp={inactiveEmp} />
        </Tab>
        <Tab
          eventKey="personalinfo"
          title="Personal Info"
          unmountOnExit={true}
          disabled={!employeeId}
        >
          <EditPersonalInfoForm
            employeeId={employeeId}
            personalinfo={personalinfo}
          />
        </Tab>
        <Tab
          eventKey="dependents"
          title="Dependents"
          unmountOnExit={true}
          disabled={!employeeId}
        >
          <DependentsList dependents={dependents} employeeId={employeeId} />
        </Tab>
        <Tab
          eventKey="educinfo"
          title="Educational Attainment"
          unmountOnExit={true}
          disabled={!employeeId}
        >
          <EducInfoList educinfos={educinfos} employeeId={employeeId} />
        </Tab>
        <Tab
          eventKey="workinfo"
          title="Employment History"
          unmountOnExit={true}
          disabled={!employeeId}
        >
          <WorkInfosList workinfos={workinfos} employeeId={employeeId} />
        </Tab>
        <Tab
          title="Print record"
          disabled={!personalinfo}
          eventKey={"printrecord"}
          unmountOnExit={true}
          onSelect={() => console.log("first")}
        >
          <div className="text-center">
            <Button
              variant="outline-dark"
              disabled={!personalinfo}
              onClick={handlePrintEmployeeRecord}
            >
              Click here to print record{" "}
              <FontAwesomeIcon className="ms-2" icon={faPrint} />
            </Button>
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default EditRecord;
