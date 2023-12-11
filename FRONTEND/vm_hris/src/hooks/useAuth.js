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
    const { username, userLevel } = decoded.UserInfo;

    isHR = userLevel === "HR";
    isAdmin = userLevel === "Admin";

    if (isHR) status = "HR";
    if (isAdmin) status = "Admin";

    return { username, status, isHR, isAdmin, userLevel };
  }

  return { username: "", userLevel: "", isHR, isAdmin, status };
};

export default useAuth;
