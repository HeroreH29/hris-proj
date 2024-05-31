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
import RequireAuth from "./features/auth/RequireAuth";
import useTitle from "./hooks/useTitle";
import Attendances from "./features/attendances/Attendances";
import LeavesList from "./features/leaves/LeavesList";
import NewLeaveForm from "./features/leaves/NewLeaveForm";

import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import IncreaseCredits from "./features/leaves/IncreaseCredits";
import UserAccess from "./features/users/UserAccess";

function App() {
  useTitle("Login | Via Mare HRIS");
  return (
    <>
      <ToastContainer
        containerId={"A"}
        autoClose={3000}
        stacked
        closeOnClick={true}
        position="top-right"
      />
      <ToastContainer
        containerId={"B"}
        autoClose={false}
        stacked
        closeOnClick={true}
        position="bottom-left"
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route index element={<Login />} />
          <Route path="forgotpassword" element={<ForgotPass />} />
          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedAccess={{ R: true }} />}>
              <Route element={<Prefetch />}>
                <Route element={<DashLayout />}>
                  {/* Dashboard Routes */}
                  <Route path="dashboard">
                    <Route index element={<Welcome />} />
                    <Route
                      element={
                        <RequireAuth
                          allowedAccess={{ C: true, U: true, D: true }}
                        />
                      }
                    >
                      <Route
                        path="announcements/:id"
                        element={<EditAnnouncement />}
                      />
                      <Route
                        path="announcements/new"
                        element={<NewAnnouncement />}
                      />
                    </Route>
                  </Route>
                  {/* Employee Records Routes */}
                  <Route path="employeerecords">
                    <Route index element={<RecordsList />} />
                    <Route
                      element={
                        <RequireAuth
                          exceptions={["Outlet Processor"]}
                          allowedAccess={{ C: true, U: true, D: true }}
                        />
                      }
                    >
                      <Route path=":employeeId" element={<EditRecord />} />
                      <Route path="new" element={<EditRecord />} />
                    </Route>
                  </Route>
                  {/* Attendances Routes */}
                  <Route path="attendances">
                    <Route
                      element={
                        <RequireAuth
                          allowedAccess={{ C: true, R: true, U: true }}
                        />
                      }
                    >
                      <Route index element={<Attendances />} />
                    </Route>
                  </Route>
                  {/* Leaves Routes */}
                  <Route path="leaves">
                    <Route
                      element={
                        <RequireAuth allowedAccess={{ C: true, R: true }} />
                      }
                    >
                      <Route index element={<LeavesList />} />
                      <Route path="new" element={<NewLeaveForm />} />
                    </Route>
                    <Route
                      element={
                        <RequireAuth allowedAccess={{ U: true, D: true }} />
                      }
                    >
                      <Route
                        path="increasecredits"
                        element={<IncreaseCredits />}
                      />
                    </Route>
                  </Route>
                  {/* User Settings Routes */}
                  <Route path="users">
                    <Route
                      element={
                        <RequireAuth
                          allowedAccess={{
                            C: true,
                            R: true,
                            U: true,
                            D: true,
                          }}
                        />
                      }
                    >
                      <Route index element={<UsersList />} />
                      <Route path=":id" element={<EditUser />} />
                      <Route path="new" element={<NewUserForm />} />
                      <Route path="useraccess" element={<UserAccess />} />
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
