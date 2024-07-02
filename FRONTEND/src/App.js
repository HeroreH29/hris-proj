import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import DashLayout from "./components/Dashboard/DashLayout";
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
import Dashboard from "./components/Dashboard/Dashboard";
import EmployeesList from "./components/EmployeeRecords/EmployeesList";
import EmployeeInfo from "./components/EmployeeRecords/EmployeeInfo";

function App() {
  useTitle("Login | HRIS Project");
  return (
    <>
      <ToastContainer
        containerId={"A"}
        autoClose={3000}
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
            <Route element={<RequireAuth allowedAccess={[]} />}>
              <Route element={<Prefetch />}>
                <Route element={<DashLayout />}>
                  {/* Dashboard Routes */}
                  <Route path="dashboard">
                    <Route index element={<Dashboard />} />
                    <Route
                      element={
                        <RequireAuth allowedAccess={["Processor", "Admin"]} />
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
                  <Route
                    path="employeerecords"
                    element={
                      <RequireAuth
                        allowedAccess={[
                          "Processor",
                          "Admin",
                          "Outlet Processor",
                        ]}
                      />
                    }
                  >
                    <Route index element={<EmployeesList />} />
                    <Route path=":employeeId" element={<EmployeeInfo />} />
                    <Route
                      element={
                        <RequireAuth allowedAccess={["Processor", "Admin"]} />
                      }
                    >
                      <Route path="new" element={<EditRecord />} />
                    </Route>
                  </Route>
                  {/* Attendances Routes */}
                  <Route path="attendances">
                    <Route
                      element={
                        <RequireAuth
                          allowedAccess={[
                            "Processor",
                            "Admin",
                            "Outlet Processor",
                          ]}
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
                        <RequireAuth
                          allowedAccess={[
                            "Processor",
                            "Admin",
                            "Outlet Processor",
                            "User",
                          ]}
                        />
                      }
                    >
                      <Route index element={<LeavesList />} />
                      <Route path="new" element={<NewLeaveForm />} />
                    </Route>
                    <Route
                      element={
                        <RequireAuth allowedAccess={["Processor", "Admin"]} />
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
                    <Route element={<RequireAuth allowedAccess={["Admin"]} />}>
                      <Route index element={<UsersList />} />
                      <Route path=":id" element={<EditUser />} />
                      <Route path="new" element={<NewUserForm />} />
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
