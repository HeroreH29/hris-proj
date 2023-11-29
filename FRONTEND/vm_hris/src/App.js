import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import AnnouncementList from "./features/announcements/AnnouncementList";
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
            <Route index element={<AnnouncementList />} />
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
