import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isHR = false;
  let isAdmin = false;
  let isOutletProcessor = false;

  if (token) {
    const decoded = jwtDecode(token);
    const { username, userLevel, branch, user, employeeId } = decoded.UserInfo;

    isHR = userLevel === "HR";
    isAdmin = userLevel === "Admin";
    isOutletProcessor = userLevel === "Outlet/Processor";

    return {
      username,
      user,
      isHR,
      isAdmin,
      isOutletProcessor,
      userLevel,
      branch,
      employeeId,
    };
  }

  return {
    user: "",
    username: "",
    userLevel: "",
    isHR,
    isAdmin,
    isOutletProcessor,
    branch: "",
    employeeId: "",
  };
};

export default useAuth;
