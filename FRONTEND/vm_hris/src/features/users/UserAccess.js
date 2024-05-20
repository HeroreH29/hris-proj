import React, { useEffect, useState } from "react";
import useTitle from "../../hooks/useTitle";
import { Form, Stack, Spinner, Button } from "react-bootstrap";
import { USERLEVELS, SYSFEATS } from "../../config/userOptions";
import {
  useGetUserAccessesQuery,
  useUpdateUserAccessMutation,
} from "./userAccessApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserAccess = () => {
  useTitle("User Access | Via Mare HRIS");

  const navigate = useNavigate();

  const [userLevel, setUserLevel] = useState("");
  const [sysFeat, setSysFeat] = useState("");
  const [userAccessData, setUserAccessData] = useState({});
  const [crudValues, setCrudValues] = useState({});
  const [initCrudValues, setInitCrudValues] = useState({});

  const {
    data: userAccesses,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserAccessesQuery();

  const [
    updateUserAccess,
    { isLoading: updateLoading, isSuccess: updateSuccess },
  ] = useUpdateUserAccessMutation();

  const userLevelOptions = Object.values(USERLEVELS)
    .sort((a, b) => a.localeCompare(b))
    .map((userlevel) => {
      return (
        <option key={userlevel} value={userlevel}>
          {userlevel}
        </option>
      );
    });

  const sysFeatsOptions = Object.values(SYSFEATS)
    /* .sort((a, b) => a.localeCompare(b)) */
    .map((userlevel) => {
      return (
        <option key={userlevel} value={userlevel}>
          {userlevel}
        </option>
      );
    });

  const handleSaveChanges = async () => {
    // setUserAccessData((prev) => ({
    //   ...prev,
    //   SysFeature: { ...prev.SysFeature, [sysFeat]: crudValues },
    // }));
    await updateUserAccess({
      ...userAccessData,
      SysFeature: {
        ...userAccessData.SysFeature,
        [sysFeat.replace(" ", "")]: crudValues,
      },
    });
  };

  // User access & CRUD values setter
  useEffect(() => {
    if (userLevel && sysFeat) {
      const { ids, entities } = userAccesses;

      const matchingUserAccess = ids
        .filter((id) => entities[id].UserLevel === userLevel)
        .map((id) => entities[id])[0];

      //console.log(matchingUserAccess.SysFeature[sysFeat]);

      setUserAccessData(matchingUserAccess);
      setCrudValues(matchingUserAccess.SysFeature[sysFeat.replace(" ", "")]);
      setInitCrudValues(
        matchingUserAccess.SysFeature[sysFeat.replace(" ", "")]
      );
    }
    // eslint-disable-next-line
  }, [userLevel, sysFeat]);

  // User access update checker
  useEffect(() => {
    if (updateLoading) {
      toast.loading("Updating...");
    }

    if (updateSuccess) {
      toast.dismiss(); // to dismiss all toast
      toast.success("User Acccess updated!");
      //navigate("/users");
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1500);
    }
  }, [updateSuccess, updateLoading, navigate]);

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (isError) {
    return <p className="text-danger">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    return (
      <>
        <Form className="p-3">
          <Stack direction="horizontal" gap={3}>
            <Form.Group>
              <Form.Label className="fw-semibold">User Level</Form.Label>
              <Form.Select
                onChange={(e) => setUserLevel(e.target.value)}
                value={userLevel}
              >
                <option value="">Select a level...</option>
                {userLevelOptions}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">System Feature</Form.Label>
              <Form.Select
                onChange={(e) => setSysFeat(e.target.value)}
                value={sysFeat}
              >
                <option value="">Select a feature...</option>
                {sysFeatsOptions}
              </Form.Select>
            </Form.Group>
          </Stack>
          {userLevel && sysFeat && (
            <>
              <Stack gap={3} direction="horizontal" className="p-3">
                <Form.Check
                  label="Create"
                  type="checkbox"
                  checked={crudValues.C}
                  onChange={(e) =>
                    setCrudValues((prev) => ({ ...prev, C: e.target.checked }))
                  }
                />
                <Form.Check
                  label="Read"
                  type="checkbox"
                  checked={crudValues.R}
                  onChange={(e) =>
                    setCrudValues((prev) => ({ ...prev, R: e.target.checked }))
                  }
                />
                <Form.Check
                  label="Update"
                  type="checkbox"
                  checked={crudValues.U}
                  onChange={(e) =>
                    setCrudValues((prev) => ({ ...prev, U: e.target.checked }))
                  }
                />
                <Form.Check
                  label="Delete"
                  type="checkbox"
                  checked={crudValues.D}
                  onChange={(e) =>
                    setCrudValues((prev) => ({ ...prev, D: e.target.checked }))
                  }
                />
              </Stack>
              <Stack gap={4} direction="horizontal">
                <Button
                  variant="outline-success"
                  disabled={
                    JSON.stringify(crudValues) ===
                    JSON.stringify(initCrudValues)
                  }
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </Stack>
            </>
          )}
        </Form>
      </>
    );
  }
};

export default UserAccess;
