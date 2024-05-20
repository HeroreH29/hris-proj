import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import DashLayout from "./components/Dashboard/DashLayout";
import Welcome from "./features/auth/Welcome";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditAnnouncement from "./features/announcements/EditAnnouncement";
import NewAnnouncement from "./features/announcements/NewAnnouncement";
import RecordsList from "./features/employeerecords/RecordsList";
import EditRecord from "./features/employeerecords/EditRecord";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import ForgotPass from "./features/auth/ForgotPass";
import { USERLEVELS } from "./config/userOptions";
import RequireAuth from "./features/auth/RequireAuth";
import useTitle from "./hooks/useTitle";
import Attendances from "./features/attendances/Attendances";
import LeavesList from "./features/leaves/LeavesList";
import NewLeaveForm from "./features/leaves/NewLeaveForm";

import { ToastContainer } from "react-toastify";
import IncreaseCredits from "./features/leaves/IncreaseCredits";
import ContentLayout from "./components/Content/ContentLayout";
import UserAccess from "./features/users/UserAccess";

function App() {
  useTitle("Login | Via Mare HRIS");
  return (
    <>
      <ToastContainer autoClose={3000} stacked closeOnClick={true} />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route index element={<Login />} />
          <Route path="forgotpassword" element={<ForgotPass />} />
          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route
              element={
                <RequireAuth
                  allowedUserLevels={[...Object.values(USERLEVELS)]}
                  /* allowedAccess={{ C: true, R: true, U: true, D: true }} */
                />
              }
            >
              <Route element={<Prefetch />}>
                <Route element={<DashLayout />}>
                  <Route path="dashboard">
                    <Route index element={<Welcome />} />
                    <Route path="announcements">
                      <Route
                        element={
                          <RequireAuth
                            allowedUserLevels={[
                              USERLEVELS.Admin,
                              USERLEVELS.HR,
                            ]}
                          />
                        }
                      >
                        <Route path=":id" element={<EditAnnouncement />} />
                        <Route path="new" element={<NewAnnouncement />} />
                      </Route>
                    </Route>
                  </Route>
                  <Route
                    element={
                      <RequireAuth
                        allowedUserLevels={[USERLEVELS.Admin, USERLEVELS.HR]}
                      />
                    }
                  >
                    <Route
                      path="users"
                      element={<ContentLayout backTo="/users" title="User" />}
                    >
                      <Route index element={<UsersList />} />
                      <Route path=":id" element={<EditUser />} />
                      <Route path="new" element={<NewUserForm />} />
                      <Route path="useraccess" element={<UserAccess />} />
                    </Route>
                  </Route>
                  <Route
                    element={
                      <RequireAuth
                        allowedUserLevels={[
                          USERLEVELS.Admin,
                          USERLEVELS.HR,
                          USERLEVELS.OutletProcessor,
                        ]}
                      />
                    }
                  >
                    <Route path="employeerecords">
                      <Route index element={<RecordsList />} />
                      <Route path=":employeeId" element={<EditRecord />} />
                      <Route path="new" element={<EditRecord />} />
                    </Route>
                  </Route>
                  <Route
                    element={
                      <RequireAuth
                        allowedUserLevels={[
                          USERLEVELS.Admin,
                          USERLEVELS.HR,
                          USERLEVELS.OutletProcessor,
                        ]}
                      />
                    }
                  >
                    <Route path="attendances">
                      <Route index element={<Attendances />} />
                      {/* Include more routes if necessary */}
                    </Route>
                  </Route>
                  <Route
                    path="leaves"
                    element={<ContentLayout backTo="/leaves" title="Leave" />}
                  >
                    <Route index element={<LeavesList />} />
                    {/* Include more routes if necessary */}
                    <Route path="new" element={<NewLeaveForm />} />
                    <Route
                      element={
                        <RequireAuth
                          allowedUserLevels={[USERLEVELS.Admin, USERLEVELS.HR]}
                        />
                      }
                    >
                      <Route
                        path="increasecredits"
                        element={<IncreaseCredits />}
                      />
                    </Route>
                  </Route>
                  {/* End Dash */}
                </Route>
              </Route>
            </Route>
          </Route>
          {/* end protected routes */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
