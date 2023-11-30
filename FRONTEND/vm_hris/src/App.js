import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/Dashboard/DashLayout";
import Welcome from "./features/auth/Welcome";
import AnnouncementsList from "./features/announcements/AnnouncementsList";
import CelebrantsList from "./features/celebrants/CelebrantsList";
import UsersList from "./features/users/UsersList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route path="dashboard" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="announcements">
            <Route index element={<AnnouncementsList />} />
          </Route>
          <Route path="celebrants">
            <Route index element={<CelebrantsList />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>
          {/* End Dash */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
