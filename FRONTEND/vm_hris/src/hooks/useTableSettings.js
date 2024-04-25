import { useReducer } from "react";
import useAuth from "./useAuth";
import {
  faSortNumericAsc,
  faSortNumericDesc,
} from "@fortawesome/free-solid-svg-icons";

const useTableSettings = () => {
  const { branch } = useAuth();

  const dateSortIconArr = [faSortNumericDesc, faSortNumericAsc];

  const initialState = {
    sliceStart: 0,
    sliceEnd: 10,
    nameSort: false,
    searchValue: "",
    outletFilter: branch,
    statusFilter: "Y",
    empTypeFilter: "",
    name: "",
    year: new Date().getFullYear(),
    month: "",
    dateSort: false,
    dateSortIcon: dateSortIconArr[1],
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
      case "emptype_filter": {
        return {
          ...state,
          empTypeFilter: action.empTypeFilter,
          sliceStart: 0,
          sliceEnd: 10,
        };
      }
      case "name": {
        return { ...state, name: action.name, sliceStart: 0, sliceEnd: 10 };
      }
      case "month": {
        return { ...state, month: action.month, sliceStart: 0, sliceEnd: 10 };
      }
      case "year": {
        return {
          ...state,
          year: action.year * 1,
          sliceStart: 0,
          sliceEnd: 10,
        };
      }
      case "datesort": {
        return {
          ...state,
          dateSort: !state.dateSort,
          dateSortIcon: dateSortIconArr[state.dateSort ? 1 : 0],
        };
      }
      case "reset": {
        return {
          ...state,
          ...initialState,
        };
      }

      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  const [tableState, tableDispatch] = useReducer(reducer, initialState);

  return { tableState, tableDispatch };
};

export default useTableSettings;
