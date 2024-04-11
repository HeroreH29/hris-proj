import { useReducer } from "react";

const useAttModalSettings = () => {
  const initialState = {
    dateTo: "",
    dateFrom: "",
    showModal: false,
    startSlice: 0,
    endSlice: 10,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "date_to": {
        return {
          ...state,
          dateTo: action.dateTo,
          endSlice: 10,
        };
      }
      case "date_from": {
        return {
          ...state,
          dateFrom: action.dateFrom,
          startSlice: 0,
        };
      }
      case "show_modal": {
        return { ...state, showModal: true };
      }
      case "close_modal": {
        return { ...state, showModal: false, dateTo: "", dateFrom: "" };
      }

      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  const [attModalState, attModalDispatch] = useReducer(reducer, initialState);

  return { attModalState, attModalDispatch };
};

export default useAttModalSettings;
