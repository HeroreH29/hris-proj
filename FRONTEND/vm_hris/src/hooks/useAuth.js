import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import useCurrentPage from "./useCurrentPage";
import { useGetUserAccessesQuery } from "../features/users/userAccessApiSlice";

const useAuth = (allowedAccess = {}) => {
  const token = useSelector(selectCurrentToken);
  const currentPage = useCurrentPage();

  let canX = {
    canCreate: false,
    canRead: false,
    canUpdate: false,
    canDelete: false,
  };

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

  const { data: userAccesses, isSuccess } = useGetUserAccessesQuery();

  if (token && isSuccess) {
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

    const { ids, entities } = userAccesses;
    const matchingUserAccess = ids
      .filter((id) => entities[id].UserLevel === userLevel)
      .map((id) => entities[id])[0];

    if (matchingUserAccess) {
      for (const key in allowedAccess) {
        if (
          matchingUserAccess.SysFeature[featureName][key] !== allowedAccess[key]
        ) {
          isX.isUserAuthorized = false;
          break;
        }
      }
      canX.canCreate = matchingUserAccess.SysFeature[featureName].C;
      canX.canRead = matchingUserAccess.SysFeature[featureName].R;
      canX.canUpdate = matchingUserAccess.SysFeature[featureName].U;
      canX.canDelete = matchingUserAccess.SysFeature[featureName].D;
    }

    return {
      username,
      userLevel,
      user,
      branch,
      employeeId,
      isX,
      canX,
    };
  }

  return {
    username: "",
    userLevel: "",
    user: "",
    branch: "",
    employeeId: "",
    isX,
    canX,
  };
};

export default useAuth;
