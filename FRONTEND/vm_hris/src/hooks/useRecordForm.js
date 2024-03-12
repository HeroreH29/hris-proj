import { useReducer } from "react";
import { useGetGeninfosQuery } from "../features/employeerecords/recordsApiSlice";
import { format } from "date-fns";

const ALPHA_REGEX = /^[a-zA-Z\s]+$/;
const ALPHANUM_REGEX = /^[a-zA-Z0-9]+$/;
//const NUMBER_REGEX = /^\d+$/;
const IDNUMS_REGEX = /^-?\d+$/;

const useRecordForm = (geninfo = null, personalinfo = null) => {
  const { data: geninfos } = useGetGeninfosQuery();

  // Auto increments BioID based on the latest existing BioID
  const incrementBioID = () => {
    if (geninfos?.ids?.length > 0) {
      const { ids, entities } = geninfos;

      const latestBioId = [...ids]
        .sort((a, b) => {
          return entities[b].BioID - entities[a].BioID;
        })
        .map((id) => entities[id].BioID)[0];

      return latestBioId + 1;
    }
  };

  // Date formatter
  const dateFormatter = (dateString, dateFormat = "yyyy-MM-dd") => {
    return dateString ? format(new Date(dateString), dateFormat) : "";
  };

  const geninfoInitialState = !geninfo
    ? {
        EmployeeID: "",
        BioID: incrementBioID(),
        Prefix: "",
        FirstName: "",
        MiddleName: "",
        LastName: "",
        EmployeeType: "",
        AssignedOutlet: "",
        Department: "",
        JobTitle: "",
        DateEmployed: "",
        DateProbationary: "",
        RegDate: "",
        DateLeaved: "",
        EmpStatus: "",
        Notes: "",
        TINnumber: "",
        SSSnumber: "",
        PHnumber: "",
        PInumber: "",
        ATMnumber: "",
      }
    : {
        ...geninfo,
        RegDate: dateFormatter(geninfo?.RegDate),
        DateEmployed: dateFormatter(geninfo?.DateEmployed),
        DateProbationary: dateFormatter(geninfo?.DateProbationary),
        DateLeaved: dateFormatter(geninfo?.DateLeaved),
        ContractDateEnd: dateFormatter(geninfo?.ContractDateEnd),
      };

  const personalinfoInitialState = !personalinfo
    ? {
        Birthday: "",
      }
    : {};

  const inputRegExpTest = (inputValue = "", REGEX = new RegExp()) => {
    if (REGEX.test(inputValue)) {
      return inputValue;
    }

    return inputValue.trim();
  };

  const geninfoReducer = (state, action) => {
    switch (action.type) {
      case "employee_id": {
        return {
          ...state,
          EmployeeID: inputRegExpTest(action.EmployeeID, ALPHANUM_REGEX),
        };
      }
      case "prefix": {
        return {
          ...state,
          Prefix: action.Prefix,
        };
      }
      case "first_name": {
        return {
          ...state,
          FirstName: inputRegExpTest(action.FirstName, ALPHA_REGEX),
        };
      }
      case "middle_name": {
        return {
          ...state,
          MiddleName: inputRegExpTest(action.MiddleName, ALPHA_REGEX),
        };
      }
      case "last_name": {
        return {
          ...state,
          LastName: inputRegExpTest(action.LastName, ALPHA_REGEX),
        };
      }
      case "employee_type": {
        return {
          ...state,
          EmployeeType: action.EmployeeType,
        };
      }
      case "assigned_outlet": {
        return {
          ...state,
          AssignedOutlet: action.AssignedOutlet,
        };
      }
      case "department": {
        return {
          ...state,
          Department: action.Department,
        };
      }
      case "job_title": {
        return {
          ...state,
          JobTitle: action.JobTitle,
        };
      }
      case "date_employed": {
        return {
          ...state,
          DateEmployed: action.DateEmployed,
        };
      }
      case "contract_date_end": {
        return {
          ...state,
          ContractDateEnd: action.ContractDateEnd,
        };
      }
      case "date_probationary": {
        return {
          ...state,
          DateProbationary: action.DateProbationary,
        };
      }
      case "reg_date": {
        return {
          ...state,
          RegDate: action.RegDate,
        };
      }
      case "date_leaved": {
        return {
          ...state,
          DateLeaved: action.DateLeaved,
        };
      }
      case "emp_status": {
        return {
          ...state,
          EmpStatus: action.EmpStatus,
        };
      }
      case "notes": {
        return {
          ...state,
          Notes: action.Notes,
        };
      }
      case "tin_number": {
        return {
          ...state,
          TINnumber: inputRegExpTest(action.TINnumber, IDNUMS_REGEX),
        };
      }
      case "sss_number": {
        return {
          ...state,
          SSSnumber: inputRegExpTest(action.SSSnumber, IDNUMS_REGEX),
        };
      }
      case "ph_number": {
        return {
          ...state,
          PHnumber: inputRegExpTest(action.PHnumber, IDNUMS_REGEX),
        };
      }
      case "pi_number": {
        return {
          ...state,
          PInumber: inputRegExpTest(action.PInumber, IDNUMS_REGEX),
        };
      }
      case "atm_number": {
        return {
          ...state,
          ATMnumber: inputRegExpTest(action.ATMnumber, IDNUMS_REGEX),
        };
      }

      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  const [genState, genDispatch] = useReducer(
    geninfoReducer,
    geninfoInitialState
  );

  return { genState, genDispatch };
};

export default useRecordForm;
