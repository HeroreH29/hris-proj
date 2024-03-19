import { useReducer } from "react";
import { differenceInDays, format } from "date-fns";
import DateFormatter from "../xtra_functions/DateFormatter";

const useLeaveForm = () => {
  const initialState = {
    DateOfFilling: "",
    NoOfDays: 0,
    DayTime: "",
    Ltype: "",
    Lfrom: "",
    Lto: "",
    Remarks: "",
    Reason: "",
    Approve: 0,
    HalfDay: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "dateoffilling": {
        return { ...state, DateOfFilling: action.DateOfFilling };
      }
      case "daytime": {
        return { ...state, DayTime: action.DayTime };
      }
      case "ltype": {
        return { ...state, Ltype: action.Ltype };
      }
      case "lfrom": {
        return { ...state, Lfrom: action.Lfrom };
      }
      case "lto": {
        return { ...state, Lto: action.Lto };
      }
      case "remarks": {
        return { ...state, Remarks: action.Remarks };
      }
      case "approve": {
        return { ...state, Approve: action.Approve };
      }
      case "halfday": {
        return { ...state, HalfDay: !state.HalfDay, DayTime: "" };
      }
      case "reason": {
        return { ...state, Reason: action.Reason };
      }
      case "resetform": {
        return initialState;
      }

      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  const [leaveState, leaveDispatch] = useReducer(reducer, initialState);

  return { leaveState, leaveDispatch };
};

export default useLeaveForm;
