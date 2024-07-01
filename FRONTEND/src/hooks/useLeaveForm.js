import { useReducer } from "react";
import { toast } from "react-toastify";

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
        const disallowedWords = ["not feeling well", "nfw"];
        for (const word of disallowedWords) {
          if (
            action.Reason.toLowerCase().includes(word) &&
            state.Ltype === "Sick Leave"
          ) {
            toast.error("This reason is not allowed!");
            action.Reason = "";
            break;
          }
        }
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
