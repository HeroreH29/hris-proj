import { differenceInMonths } from "date-fns";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const EmployeeNotifier = ({ gids = [], gentities = [], tableState = {} }) => {
  const { isOutletProcessor } = useAuth;

  const firstEval = [];
  const finalEval = [];
  const forRegularization = [];

  gids
    .filter((gid) => {
      let match = true;

      if (isOutletProcessor) {
        match =
          match && gentities[gid]?.AssignedOutlet === tableState.outletFilter;
      }

      return match;
    })
    .forEach((gid) => {
      const dateToday = new Date();

      if (
        gentities[gid]?.EmployeeType === "Probationary" &&
        gentities[gid].EmpStatus === "Y"
      ) {
        if (gentities[gid]?.DateEmployed) {
          const monthDiff = differenceInMonths(
            dateToday,
            new Date(gentities[gid].DateEmployed)
          );

          // First eval
          if (monthDiff >= 3 && monthDiff <= 4) {
            firstEval.push(gentities[gid].EmployeeID);
          }

          // Final eval
          if (monthDiff >= 5 && monthDiff <= 6) {
            finalEval.push(gentities[gid].EmployeeID);
          }

          // For regularization
          if (monthDiff >= 6) {
            forRegularization.push(gentities[gid].EmployeeID);
          }
        }
      }
    });

  firstEval.forEach((e) => {
    toast.warning(`First evaluation for "${e}" `, {
      toastId: e,
      position: "top-left",
      onClick: () => {
        const newTab = window.open("", "_blank");
        newTab.location.href = `/employeerecords/${e}`;
      },
    });
  });

  finalEval.forEach((e) => {
    toast.warning(`Final evaluation for "${e}" `, {
      toastId: e,
      position: "top-left",
      onClick: () => {
        const newTab = window.open("", "_blank");
        newTab.location.href = `/employeerecords/${e}`;
      },
    });
  });

  forRegularization.forEach((e) => {
    toast.warning(`Regularization for "${e}"`, {
      toastId: e,
      position: "top-left",
      onClick: () => {
        const newTab = window.open("", "_blank");
        newTab.location.href = `/employeerecords/${e}`;
      },
    });
  });
};

export default EmployeeNotifier;
