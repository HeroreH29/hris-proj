import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Spinner,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faSortNumericAsc,
  faSortNumericDesc,
} from "@fortawesome/free-solid-svg-icons";
import { useGetLeaveCreditsQuery, useGetLeavesQuery } from "./leavesApiSlice";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import useTitle from "../../hooks/useTitle";
import Leave from "./Leave";
import useAuth from "../../hooks/useAuth";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";

const LeavesList = () => {
  useTitle("Leaves | Via Mare HRIS");

  const { status, employeeId } = useAuth();

  const navigate = useNavigate();

  const [leaveCredit, setLeaveCredit] = useState("");
  const [empId, setEmpId] = useState(undefined);

  const {
    data: leavecredits,
    isLoading: creditsLoading,
    isSuccess: creditsSuccess,
    isError: creditsError,
    error: credserr,
  } = useGetLeaveCreditsQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: leaves,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetLeavesQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { data: geninfos } = useGetGeninfosQuery();

  const handleHover = (empId) => {
    setEmpId(empId);

    if (creditsSuccess && !creditsLoading && !creditsError) {
      const { ids, entities } = leavecredits;

      const leavecredit = ids?.length
        ? ids
            .filter((id) => {
              return entities[id]?.EmployeeID === empId;
            })
            .map((id) => entities[id])[0]
        : "";

      setLeaveCredit(leavecredit);
    } else {
      console.error(credserr?.data?.message);
    }
  };

  const [name, setName] = useState("");
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("");
  const start = new Date().getFullYear();
  const yearsArr = Array.from({ length: start - 2010 + 1 }, (_, i) => 2010 + i);
  const monthsArr = Array.from({ length: 12 }, (_, index) => index).map(
    (monthNum) => format(new Date(2023, monthNum, 1), "MMM")
  );

  const yearDropdown = yearsArr.map((yr, index) => {
    return (
      <option value={yr} key={index}>
        {yr}
      </option>
    );
  });

  const monthDropdown = monthsArr.map((month, index) => {
    return (
      <option value={month} key={index}>
        {month}
      </option>
    );
  });

  const sortIconArr = [faSortNumericDesc, faSortNumericAsc];
  const [sortIcon, setSortIcon] = useState(0);

  const handleSortIconChange = () =>
    setSortIcon((prev) => (prev === 0 ? prev + 1 : prev - 1));

  const [startSlice, setStartSlice] = useState(0);
  const [endSlice, setEndSlice] = useState(10);

  const handleNext = () => {
    setStartSlice((prev) => prev + 10);
    setEndSlice((prev) => prev + 10);
  };
  const handlePrev = () => {
    setStartSlice((prev) => prev - 10);
    setEndSlice((prev) => prev - 10);
  };

  const handlePrintSummary = async () => {
    const pdfDoc = await PDFDocument.create();
    const helveticaFontBold = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );
    const timesRomanBoldItalic = await pdfDoc.embedFont(
      StandardFonts.TimesRomanBoldItalic
    );
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 16;

    const pageTitle = () => {
      page.drawText("Via Mare Corporation", {
        x: width / 2.75,
        y: height - 2 * fontSize,
        size: fontSize,
        font: helveticaFontBold,
        color: rgb(0, 124 / 255, 200 / 255),
      });
      page.drawText("Employee's Leave Ledger", {
        x: width / 2.6,
        y: height - 3.25 * fontSize,
        size: fontSize - 5,
        font: helveticaFontBold,
      });
    };

    const pageBody = () => {
      const { ids, entities } = geninfos;
      const employeeName = ids
        .filter((id) => entities[id]?.EmployeeID === empId)
        .map(
          (id) =>
            `${entities[id].LastName}, ${entities[id].FirstName} ${entities[id].MI}.`
        )[0];
      const leaveData = leaves.ids
        .filter((id) => leaves.entities[id]?.EmployeeID === empId)
        .map((id) => leaves.entities[id]);

      // Table Header
      page.drawText(`${employeeName} (${empId})`, {
        x: width * 0.06,
        y: height * 0.88,
        size: fontSize - 2,
        font: timesRomanBoldItalic,
      });
      page.drawLine({
        start: { x: width * 0.05, y: height * 0.87 },
        end: { x: width * 0.95, y: height * 0.87 },
        thickness: 3,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      page.drawText("Date Filed", {
        x: width * 0.06,
        y: height * 0.855,
        size: fontSize - 6,
        font: helveticaFontBold,
      });
      page.drawText("Leave Type", {
        x: width * 0.2,
        y: height * 0.855,
        size: fontSize - 6,
        font: helveticaFontBold,
      });
      page.drawText("Leave From", {
        x: width * 0.378,
        y: height * 0.855,
        size: fontSize - 6,
        font: helveticaFontBold,
      });
      page.drawText("Leave Until", {
        x: width * 0.57,
        y: height * 0.855,
        size: fontSize - 6,
        font: helveticaFontBold,
      });
      page.drawText("Status", {
        x: width * 0.75,
        y: height * 0.855,
        size: fontSize - 6,
        font: helveticaFontBold,
      });
      page.drawText("Day/s", {
        x: width * 0.9,
        y: height * 0.855,
        size: fontSize - 6,
        font: helveticaFontBold,
      });
      page.drawLine({
        start: { x: width * 0.05, y: height * 0.85 },
        end: { x: width * 0.95, y: height * 0.85 },
        thickness: 1,
        opacity: 1,
      });

      // Table Body
      let dataHeight = 0.82;
      let totalLeaves = 0;
      leaveData.forEach((leave) => {
        page.drawText(leave.DateOfFilling, {
          x: width * 0.06,
          y: height * dataHeight,
          size: fontSize - 6,
          font: timesRoman,
        });
        page.drawText(leave.Ltype, {
          x: width * 0.2,
          y: height * dataHeight,
          size: fontSize - 6,
          font: timesRoman,
        });
        page.drawText(leave.Lfrom, {
          x: width * 0.378,
          y: height * dataHeight,
          size: fontSize - 6,
          font: timesRoman,
        });
        page.drawText(leave.Lto, {
          x: width * 0.57,
          y: height * dataHeight,
          size: fontSize - 6,
          font: timesRoman,
        });
        page.drawText(
          leave.Approve === 1
            ? "Approved"
            : leave.Approve === 2
            ? "Disapproved"
            : leave.Approve === 3
            ? "Cancelled"
            : "Pending",
          {
            x: width * 0.75,
            y: height * dataHeight,
            size: fontSize - 6,
            font: timesRoman,
          }
        );
        page.drawText(leave.NoOfDays.toString(), {
          x: width * 0.91,
          y: height * dataHeight,
          size: fontSize - 6,
          font: timesRoman,
        });

        if (leave.Approve === 1) {
          totalLeaves += leave.NoOfDays;
        }
        dataHeight -= 0.025;
      });
      page.drawLine({
        start: { x: width * 0.05, y: height * dataHeight + 0.02 },
        end: { x: width * 0.95, y: height * dataHeight + 0.02 },
        thickness: 1,
        opacity: 1,
      });
      page.drawText("Total # of approved leaves:", {
        x: width * 0.06,
        y: height * dataHeight - 23,
        size: fontSize - 6,
        font: helveticaFontBold,
      });
      page.drawText(totalLeaves.toString(), {
        x: width * 0.91,
        y: height * dataHeight - 23,
        size: fontSize - 6,
        font: helveticaFontBold,
      });
      page.drawLine({
        start: { x: width * 0.05, y: height * dataHeight - 40 },
        end: { x: width * 0.95, y: height * dataHeight - 40 },
        thickness: 1,
        opacity: 1,
      });
    };

    // Title
    pageTitle();

    // Body
    pageBody();

    // Footer

    const pdfBytes = await pdfDoc.save();

    const blobUrl = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" })
    );

    window.open(blobUrl, "_blank");
  };

  useEffect(() => {
    setStartSlice(0);
    setEndSlice(10);
  }, [month, name]);

  let content;

  if (isLoading && !leaves) content = <Spinner animation="border" />;

  if (isError) {
    content = <p className="text-danger">{error?.data?.message}</p>;
  }

  let overallLeavesContent;
  if (isSuccess) {
    const { ids, entities } = leaves;

    const filteredIds = ids
      .filter((id) => {
        const leave = entities[id];
        let matches = true;

        if (status !== "Admin") {
          matches = leave.EmployeeID === employeeId;
        }

        if (name !== "") {
          matches =
            matches && leave.EmpName.toLowerCase().includes(name.toLowerCase());
        }

        if (month !== "") {
          matches = matches && leave.DateOfFilling.includes(month);
        }

        /* if (year !== "") {
        matches = matches && leave.DateOfFilling.includes(year);
      } */

        return matches;
      })
      .reduce((acc, id) => {
        const leave = entities[id];
        const isPending = leave.Approve === 0;

        return isPending ? [id, ...acc] : [...acc, id];
      }, []);

    overallLeavesContent = filteredIds?.length
      ? filteredIds
          .sort(() => {
            return sortIcon === 0 ? 1 : -1;
          })
          .slice(startSlice, endSlice)
          .map((leaveId) => (
            <Leave
              key={leaveId}
              leaveId={leaveId}
              handleHover={handleHover}
              leaveCredit={leaveCredit}
            />
          ))
      : null;

    content = (
      <Container>
        <Row>
          <Col>
            <h3>Leaves</h3>
          </Col>
          <Col>
            <Button
              className="float-end"
              variant="outline-primary"
              onClick={() => navigate("/leaves/new")}
            >
              <FontAwesomeIcon icon={faFileAlt} />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              bordered
              striped
              hover
              className="align-middle ms-3 mt-3 mb-3 caption-top"
            >
              <caption>Overall Filed Leaves of Year 2024</caption>
              <thead>
                <tr className="align-middle">
                  <th scope="col">User</th>
                  <th scope="col" onClick={handleSortIconChange}>
                    Date Filed{" "}
                    <FontAwesomeIcon
                      className="float-end"
                      icon={sortIconArr[sortIcon]}
                    />
                  </th>
                  <th scope="col">From</th>
                  <th scope="col">Until</th>
                  <th scope="col"># of Days</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>{overallLeavesContent}</tbody>
              <tfoot>
                <tr>
                  <td>
                    <Form>
                      <Form.Control
                        type="text"
                        value={name}
                        disabled={status !== "Admin" /* true */}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form>
                  </td>
                  <td>
                    <Form>
                      <Form.Select
                        value={year}
                        disabled
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value={""}>Select year</option>
                        {yearDropdown}
                      </Form.Select>
                    </Form>
                  </td>
                  <td>
                    <Form>
                      <Form.Select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        <option value={""}>Select month</option>
                        {monthDropdown}
                      </Form.Select>
                    </Form>
                  </td>
                  <td colSpan={4}>
                    <Button
                      className="float-end ms-2"
                      variant="outline-secondary"
                      onClick={handleNext}
                      disabled={endSlice > filteredIds?.length}
                    >
                      Next
                    </Button>
                    <Button
                      className="float-end"
                      variant="outline-secondary"
                      onClick={handlePrev}
                      disabled={startSlice === 0}
                    >
                      Prev
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Col>

          <Col className="align-items-center" md="auto">
            <Table
              size="sm"
              striped
              bordered
              hover
              className="align-middle ms-3 mt-3 mb-3 caption-top sticky-top"
            >
              <caption>
                {status === "Admin"
                  ? `Leave Credit Info of ${leaveCredit?.EmployeeID}`
                  : "Your Credit Info"}
              </caption>
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Amount</th>
                  <th>Used</th>
                  <th>Balance</th>
                </tr>
              </thead>
              {leaveCredit ? (
                <>
                  <tbody>
                    <tr>
                      <td className="fw-semibold">Sick</td>
                      <td>{leaveCredit?.CreditBudget}</td>
                      <td>
                        {leaveCredit?.CreditBudget - leaveCredit?.SickLeave}
                      </td>
                      <td>{leaveCredit?.SickLeave}</td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Vacation</td>
                      <td>{leaveCredit?.CreditBudget}</td>
                      <td>
                        {leaveCredit?.CreditBudget - leaveCredit?.VacationLeave}
                      </td>
                      <td>{leaveCredit?.VacationLeave}</td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Birthday</td>
                      <td>1</td>
                      <td>{1 - leaveCredit?.BirthdayLeave}</td>
                      <td>{leaveCredit?.BirthdayLeave}</td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Maternity</td>
                      <td>{leaveCredit?.MaternityLeave && 105}</td>
                      <td>
                        {leaveCredit?.MaternityLeave &&
                          105 - leaveCredit?.MaternityLeave}
                      </td>
                      <td>{leaveCredit?.MaternityLeave}</td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Paternity</td>
                      <td>{leaveCredit?.PaternityLeave && 7}</td>
                      <td>
                        {leaveCredit?.PaternityLeave &&
                          7 - leaveCredit?.PaternityLeave}
                      </td>
                      <td>{leaveCredit?.PaternityLeave}</td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Matrimonial</td>
                      <td>{leaveCredit?.MatrimonialLeave && 7}</td>
                      <td>
                        {leaveCredit?.MatrimonialLeave &&
                          7 - leaveCredit?.MatrimonialLeave}
                      </td>
                      <td>{leaveCredit?.MatrimonialLeave}</td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Bereavement</td>
                      <td>{leaveCredit?.BereavementLeave}</td>
                      <td>0</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="fw-semibold">Print:</td>
                      <td colSpan={3}>
                        <Button
                          variant="outline-secondary"
                          className="me-2"
                          onClick={handlePrintSummary}
                        >
                          Detailed
                        </Button>
                        <Button variant="outline-secondary">Summary</Button>
                      </td>
                    </tr>
                  </tfoot>
                </>
              ) : (
                <>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="text-center">
                        No leave credits yet...
                      </td>
                    </tr>
                  </tbody>
                </>
              )}
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }

  return content;
};

export default LeavesList;
