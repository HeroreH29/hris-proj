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

function App() {
  useTitle("Login | Via Mare HRIS");
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Login />} />
        <Route path="forgotpassword" element={<ForgotPass />} />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={
              <RequireAuth allowedUserLevels={[...Object.values(USERLEVELS)]} />
            }
          >
            <Route element={<Prefetch />}>
              <Route element={<DashLayout />}>
                <Route path="dashboard">
                  <Route index element={<Welcome />} />

                  <Route path="announcements">
                    {/* <Route index element={<AnnouncementsList />} /> */}
                    <Route
                      element={
                        <RequireAuth
                          allowedUserLevels={[USERLEVELS.Admin, USERLEVELS.HR]}
                        />
                      }
                    >
                      <Route path=":id" element={<EditAnnouncement />} />
                      <Route path="new" element={<NewAnnouncement />} />
                    </Route>
                  </Route>
                  {/* End Dash */}
                </Route>
                <Route
                  element={
                    <RequireAuth
                      allowedUserLevels={[USERLEVELS.Admin, USERLEVELS.HR]}
                    />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>
                <Route
                  element={
                    <RequireAuth
                      allowedUserLevels={[USERLEVELS.Admin, USERLEVELS.HR]}
                    />
                  }
                >
                  <Route path="employeerecords">
                    <Route index element={<RecordsList />} />
                    <Route path=":employeeId" element={<EditRecord />} />
                    {/* <Route path="new" element={<NewUserForm />} /> */}
                  </Route>
                </Route>
                <Route
                  element={
                    <RequireAuth
                      allowedUserLevels={[USERLEVELS.Admin, USERLEVELS.HR]}
                    />
                  }
                >
                  <Route path="attendances">
                    <Route index element={<Attendances />} />
                    {/* <Route path=":bioId" element={<ViewAttendance />} /> */}
                    {/* <Route path="new" element={<NewUserForm />} /> */}
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        {/* end protected routes */}
      </Route>
    </Routes>
  );
}

export default App;
