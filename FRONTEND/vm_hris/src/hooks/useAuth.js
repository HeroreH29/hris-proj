import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isHR = false;
  let isAdmin = false;
  let isOutletProcessor = false;
  let isPayrollMaster = false;
  let isApprover = false;
  let isUser = false;
  let isCostController = false;
  let isProcessor = false;

  if (token) {
    const decoded = jwtDecode(token);
    const { username, userLevel, branch, user, employeeId } = decoded.UserInfo;

    isHR = userLevel === "HR";
    isAdmin = userLevel === "Admin";
    isOutletProcessor = userLevel === "Outlet Processor";
    isPayrollMaster = userLevel === "Payroll Master";
    isApprover = userLevel === "Approver";
    isUser = userLevel === "User";
    (isCostController = userLevel === "Cost Controller"),
      (isProcessor = userLevel === "Processor");

    return {
      username,
      user,
      isHR,
      isAdmin,
      isOutletProcessor,
      isPayrollMaster,
      isApprover,
      isUser,
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
    isUser,
    branch: "",
    employeeId: "",
  };
};

export default useAuth;
