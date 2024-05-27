import { differenceInMonths } from "date-fns";
import { toast } from "react-toastify";

const EmployeeNotifier = ({
  gids = [],
  gentities = [],
  tableState = {},
  navigate = undefined,
  isX = {},
}) => {
  const firstEval = [];
  const finalEval = [];
  const forRegularization = [];

  gids
    .filter((gid) => {
      let match = true;

      if (isX.isOutletProcessor) {
        match =
          match && gentities[gid]?.AssignedOutlet === tableState.outletFilter;
      }

      return match;
    })
    .forEach((gid) => {
      const dateToday = new Date();

      if (
        gentities[gid].EmployeeType === "Probationary" &&
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
      autoClose: false,
      onClick: () => {
        const newTab = window.open("", "_blank");
        newTab.location.href = `/employeerecords/${e}`;
        // navigate(`/employeerecords/${e}`);
        // window.location.reload();
      },
    });
  });

  finalEval.forEach((e) => {
    toast.warning(`Final evaluation for "${e}" `, {
      toastId: e,
      position: "top-left",
      autoClose: false,
      onClick: () => {
        const newTab = window.open("", "_blank");
        newTab.location.href = `/employeerecords/${e}`;
        // navigate(`/employeerecords/${e}`);
        //window.location.reload();
      },
    });
  });

  forRegularization.forEach((e) => {
    toast.warning(`Regularization for "${e}"`, {
      toastId: e,
      position: "top-left",
      autoClose: false,
      onClick: () => {
        const newTab = window.open("", "_blank");
        newTab.location.href = `/employeerecords/${e}`;
        // navigate(`/employeerecords/${e}`);
        //window.location.reload();
      },
    });
  });
};

export default EmployeeNotifier;
