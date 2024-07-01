import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import useCurrentPage from "./useCurrentPage";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  const currentPage = useCurrentPage();

  let isX = {
    isAdmin: false,
    isOutletProcessor: false,
    isPayrollMaster: false,
    isApprover: false,
    isUser: false,
    isCostController: false,
    isProcessor: false,
    isUserAuthorized: true,
  };

  let featureName = "";

  if (currentPage === "/dashboard") {
    featureName = "Dashboard";
  } else if (currentPage.includes("/announcements")) {
    featureName = "Announcements";
  } else if (currentPage.includes("/employeerecords")) {
    featureName = "EmployeeRecords";
  } else if (currentPage.includes("/attendances")) {
    featureName = "Attendances";
  } else if (currentPage.includes("/leaves")) {
    featureName = "Leaves";
  } else if (currentPage.includes("/users")) {
    featureName = "UserSettings";
  }

  if (token) {
    const decoded = jwtDecode(token);
    const { username, userLevel, branch, user, employeeId } = decoded.UserInfo;

    switch (userLevel) {
      case "Admin":
        isX.isAdmin = true;
        break;
      case "Processor":
        isX.isProcessor = true;
        break;
      case "Outlet Processor":
        isX.isOutletProcessor = true;
        break;
      case "Payroll Master":
        isX.isPayrollMaster = true;
        break;
      case "Approver":
        isX.isApprover = true;
        break;
      case "Cost Controller":
        isX.isCostController = true;
        break;
      case "User":
        isX.isUser = true;
        break;

      default:
        break;
    }

    return {
      username,
      userLevel,
      user,
      branch,
      employeeId,
      isX,
    };
  }

  return {
    username: "",
    userLevel: "",
    user: "",
    branch: "",
    employeeId: "",
    isX,
  };
};

export default useAuth;
