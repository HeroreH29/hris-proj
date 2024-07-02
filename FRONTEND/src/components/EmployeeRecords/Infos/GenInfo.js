import React, { useState } from "react";
import { Container, Form, Stack } from "react-bootstrap";
import { format } from "date-fns";
import { useGetAllModeOfSeparationsQuery } from "../../../app/api/slices/modeOfSeparationsApiSlice";

const GenInfo = ({ get, set }) => {
  const { data: modeofseparation } = useGetAllModeOfSeparationsQuery();

  const reasonSelections = modeofseparation?.ids.map((id) => (
    <option key={id} value={modeofseparation.entities[id].Mode_of_Separation}>
      {modeofseparation.entities[id].Mode_of_Separation}
    </option>
  ));

  return (
    <Container>
      {/* UNIQUE IDENTIFIERS */}
      <Stack direction="horizontal" gap={4} className="border p-2">
        <Form.Group>
          <Form.Label>Employee ID</Form.Label>
          <Form.Control
            value={get.EmployeeID}
            onChange={(e) =>
              set((prev) => ({ ...prev, EmployeeID: e.target.value }))
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Bio ID</Form.Label>
          <Form.Control disabled value={get.BioID} />
        </Form.Group>
      </Stack>
      {/* NAME SECTION */}
      <Stack direction="horizontal" gap={4} className="border p-2">
        <Form.Group>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="type"
            value={get?.GenInfo.FirstName}
            onChange={(e) =>
              set((prev) => ({
                ...prev,
                GenInfo: {
                  ...prev.GenInfo,
                  FirstName: e.target.value,
                },
              }))
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Middle Name {`(Optional)`}</Form.Label>
          <Form.Control
            type="type"
            value={get?.GenInfo.MiddleName}
            onChange={(e) =>
              set((prev) => ({
                ...prev,
                GenInfo: {
                  ...prev.GenInfo,
                  MiddleName: e.target.value,
                },
              }))
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="type"
            value={get?.GenInfo.LastName}
            onChange={(e) =>
              set((prev) => ({
                ...prev,
                GenInfo: {
                  ...prev.GenInfo,
                  LastName: e.target.value,
                },
              }))
            }
          />
        </Form.Group>
      </Stack>
      {/* EMPLOYMENT DETAILS SECTION */}
      <Stack className="border p-2" gap={3}>
        <Stack direction="horizontal" gap={4}>
          <Form.Group>
            <Form.Label>Employment Date</Form.Label>
            <Form.Control
              type="date"
              value={format(get?.GenInfo.EmploymentDate, "yyyy-MM-dd")}
              onChange={(e) =>
                set((prev) => ({
                  ...prev,
                  GenInfo: {
                    ...prev.GenInfo,
                    EmploymentDate: e.target.value,
                  },
                }))
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contractual?</Form.Label>
            <Form.Check
              className={`text-${
                get.GenInfo?.Contractual ? "success" : "danger"
              } fw-semibold`}
              checked={get.GenInfo?.Contractual}
              onChange={(e) =>
                set((prev) => ({
                  ...prev,
                  GenInfo: {
                    ...prev.GenInfo,
                    Contractual: e.target.checked,
                  },
                }))
              }
              label={get.GenInfo?.Contractual ? "Yes" : "No"}
            />
          </Form.Group>
          {get?.GenInfo.Contractual && (
            <Form.Group>
              <Form.Label>Contract Date End</Form.Label>
              <Form.Control
                type="date"
                value={format(get?.GenInfo.ContractDateEnd, "yyyy-MM-dd")}
                onChange={(e) =>
                  set((prev) => ({
                    ...prev,
                    GenInfo: {
                      ...prev.GenInfo,
                      ContractDateEnd: e.target.value,
                    },
                  }))
                }
              />
            </Form.Group>
          )}
        </Stack>
        <Stack direction="horizontal" gap={4}>
          <Form.Group>
            <Form.Label>Probationary Date</Form.Label>
            <Form.Control
              type="date"
              value={format(get?.GenInfo.ProbationaryDate, "yyyy-MM-dd")}
              onChange={(e) =>
                set((prev) => ({
                  ...prev,
                  GenInfo: {
                    ...prev.GenInfo,
                    ProbationaryDate: e.target.value,
                  },
                }))
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Regularization Date</Form.Label>
            <Form.Control
              type="date"
              value={format(get?.GenInfo.RegularizationDate, "yyyy-MM-dd")}
              onChange={(e) =>
                set((prev) => ({
                  ...prev,
                  GenInfo: {
                    ...prev.GenInfo,
                    RegularizationDate: e.target.value,
                  },
                }))
              }
            />
          </Form.Group>
        </Stack>
        <Stack direction="horizontal" gap={4}>
          <Form.Group>
            <Form.Label>Resignation Date</Form.Label>
            <Form.Control
              type="date"
              value={
                get?.GenInfo.ResignationDate &&
                format(get?.GenInfo.ResignationDate, "yyyy-MM-dd")
              }
              onChange={(e) =>
                set((prev) => ({
                  ...prev,
                  GenInfo: {
                    ...prev.GenInfo,
                    ResignationDate: e.target.value,
                  },
                }))
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Reason</Form.Label>
            <Form.Select
              value={get?.GenInfo.Reason}
              onChange={(e) =>
                set((prev) => ({
                  ...prev,
                  GenInfo: {
                    ...prev.GenInfo,
                    Reason: e.target.value,
                  },
                }))
              }
            >
              {reasonSelections}
            </Form.Select>
          </Form.Group>
        </Stack>
      </Stack>
    </Container>
  );
};

export default GenInfo;
