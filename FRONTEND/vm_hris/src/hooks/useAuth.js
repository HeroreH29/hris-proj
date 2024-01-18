import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isHR = false;
  let isAdmin = false;
  let status = "User";

  if (token) {
    const decoded = jwtDecode(token);
    const { username, userLevel, branch, user } = decoded.UserInfo;

    isHR = userLevel === "HR";
    isAdmin = userLevel === "Admin";

    if (isHR) status = "HR";
    if (isAdmin) status = "Admin";

    return { username, user, status, isHR, isAdmin, userLevel, branch };
  }

  return {
    user: "",
    username: "",
    userLevel: "",
    isHR,
    isAdmin,
    status,
    branch: "",
  };
};

export default useAuth;
