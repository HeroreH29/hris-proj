import { useReducer } from "react";
import useAuth from "./useAuth";

const useTableSettings = () => {
  const { branch } = useAuth();

  const initialState = {
    sliceStart: 0,
    sliceEnd: 10,
    nameSort: false,
    searchValue: "",
    outletFilter: branch,
    statusFilter: "Y",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "slice_inc": {
        return {
          ...state,
          sliceStart: state.sliceStart + 10,
          sliceEnd: state.sliceEnd + 10,
        };
      }
      case "slice_dec": {
        return {
          ...state,
          sliceStart: state.sliceStart - 10,
          sliceEnd: state.sliceEnd - 10,
        };
      }
      case "name_sort": {
        return { ...state, nameSort: !state.nameSort };
      }
      case "search_value": {
        return {
          ...state,
          searchValue: action.searchValue,
          sliceStart: 0,
          sliceEnd: 10,
        };
      }
      case "outlet_filter": {
        return {
          ...state,
          outletFilter: action.outletFilter,
          sliceStart: 0,
          sliceEnd: 10,
        };
      }
      case "status_filter": {
        return {
          ...state,
          statusFilter: action.statusFilter,
          sliceStart: 0,
          sliceEnd: 10,
        };
      }

      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch };
};

export default useTableSettings;
