import { differenceInDays, parse } from "date-fns";
import { useEffect } from "react";
import { toast } from "react-toastify";

const useContractNotif = (geninfos, isSuccess, useAuth) => {
  const { isHR, isAdmin, isOutletProcessor } = useAuth();

  useEffect(() => {
    if (isSuccess && (isHR || isAdmin || isOutletProcessor)) {
      const { ids, entities } = geninfos;
      const contractedEmployees = ids
        .filter((id) => entities[id]?.ContractDateEnd)
        .map((id) => entities[id]);

      contractedEmployees.forEach((employee) => {
        const contractDateEnd = parse(
          employee?.ContractDateEnd,
          "MMMM dd, yyyy",
          new Date()
        );
        const dateToday = new Date();

        if (contractDateEnd) {
          // Notify user when contract of an employee is about to end
          const daysLeft = differenceInDays(contractDateEnd, dateToday);

          daysLeft < 7 &&
            daysLeft > 0 &&
            toast.info(`Contract of "${employee?.EmployeeID}" will end soon`, {
              toastId: employee.EmployeeID,
              onClick: () => {
                const newTab = window.open("", "_blank");
                newTab.location.href = `/employeerecords/${employee.EmployeeID}`;
              },
            });

          daysLeft < 1 &&
            toast.warning(
              `Contract of "${employee?.EmployeeID}" already ended. Change it ASAP!`,
              {
                toastId: employee.EmployeeID,
                onClick: () => {
                  const newTab = window.open("", "_blank");
                  newTab.location.href = `/employeerecords/${employee.EmployeeID}`;
                },
              }
            );
        }
      });
    }
    // eslint-disable-next-line
  }, [geninfos]);
};

export default useContractNotif;
