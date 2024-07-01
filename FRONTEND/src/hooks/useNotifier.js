import { differenceInDays, differenceInMonths, parse } from "date-fns";
import { useEffect, useState, useRef } from "react";
import useAuth from "./useAuth";
import { useGetGeninfosQuery } from "../features/employeerecords/recordsApiSlice";

const useNotifier = () => {
  const { isX, branch } = useAuth();
  const { data: geninfos, isSuccess: isGenSuccess } = useGetGeninfosQuery();
  const [notifList, setNotifList] = useState([]);

  // Use useRef to store a set of unique notifications
  const notificationSet = useRef(new Set());

  // Regularization
  useEffect(() => {
    if (isGenSuccess) {
      const { ids: gids, entities: gentities } = geninfos;
      const firstEval = [];
      const finalEval = [];
      const forRegularization = [];

      gids
        .filter((gid) => {
          let match = true;
          if (isX.isOutletProcessor) {
            match = match && gentities[gid]?.AssignedOutlet === branch;
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

              if (monthDiff >= 3 && monthDiff <= 4) {
                firstEval.push({
                  msg: `First evaluation for "${gentities[gid].EmployeeID}"`,
                  id: gentities[gid].EmployeeID,
                });
              }

              if (monthDiff >= 5 && monthDiff <= 6) {
                finalEval.push({
                  msg: `Final evaluation for "${gentities[gid].EmployeeID}"`,
                  id: gentities[gid].EmployeeID,
                });
              }

              if (monthDiff >= 6) {
                forRegularization.push({
                  msg: `Regularization for "${gentities[gid].EmployeeID}"`,
                  id: gentities[gid].EmployeeID,
                });
              }
            }
          }
        });

      const newNotifications = [
        ...firstEval,
        ...finalEval,
        ...forRegularization,
      ].filter((notif) => !notificationSet.current.has(notif.id));

      newNotifications.forEach((notif) =>
        notificationSet.current.add(notif.id)
      );

      setNotifList((prevNotifList) => [...prevNotifList, ...newNotifications]);
    }
  }, [geninfos, isGenSuccess, isX.isOutletProcessor, branch]);

  // Contractual
  useEffect(() => {
    if (isGenSuccess) {
      if (isX.isHR || isX.isAdmin || isX.isOutletProcessor) {
        const { ids, entities } = geninfos;
        const contractedEmployees = ids
          .filter((id) => entities[id]?.ContractDateEnd)
          .map((id) => entities[id]);

        const newNotifList = [];

        contractedEmployees.forEach((employee) => {
          const contractDateEnd = parse(
            employee?.ContractDateEnd,
            "MMMM dd, yyyy",
            new Date()
          );
          const dateToday = new Date();

          if (contractDateEnd) {
            const daysLeft = differenceInDays(contractDateEnd, dateToday);

            if (daysLeft < 7 && daysLeft > 0) {
              newNotifList.push({
                msg: `Contract of "${employee?.EmployeeID}" will end soon`,
                id: employee?.EmployeeID,
              });
            }

            if (daysLeft < 1) {
              newNotifList.push({
                msg: `Contract of "${employee?.EmployeeID}" already ended!`,
                id: employee?.EmployeeID,
              });
            }
          }
        });

        const uniqueNewNotifList = newNotifList.filter(
          (notif) => !notificationSet.current.has(notif.id)
        );

        uniqueNewNotifList.forEach((notif) =>
          notificationSet.current.add(notif.id)
        );

        setNotifList((prevNotifList) => [
          ...prevNotifList,
          ...uniqueNewNotifList,
        ]);
      }
    }
  }, [geninfos, isGenSuccess, isX.isHR, isX.isAdmin, isX.isOutletProcessor]);

  return notifList;
};

export default useNotifier;
