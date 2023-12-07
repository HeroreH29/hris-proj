import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/Dashboard/DashLayout";
import Welcome from "./features/auth/Welcome";
import AnnouncementsList from "./features/announcements/AnnouncementsList";
import CelebrantsList from "./features/celebrants/CelebrantsList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditAnnouncement from "./features/announcements/EditAnnouncement";
import NewAnnouncement from "./features/announcements/NewAnnouncement";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* <Route index element={<Public />} /> */}
        <Route index element={<Login />} />
        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route element={<DashLayout />}>
              <Route path="dashboard">
                <Route index element={<Welcome />} />
                <Route path="announcements">
                  <Route index element={<AnnouncementsList />} />
                  <Route path=":id" element={<EditAnnouncement />} />
                  <Route path="new" element={<NewAnnouncement />} />
                </Route>
                <Route path="celebrants">
                  <Route index element={<CelebrantsList />} />
                </Route>
                {/* End Dash */}
              </Route>
              <Route path="users">
                <Route index element={<UsersList />} />
                <Route path=":id" element={<EditUser />} />
                <Route path="new" element={<NewUserForm />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
