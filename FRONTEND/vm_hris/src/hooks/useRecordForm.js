import { useReducer } from "react";
import { useGetGeninfosQuery } from "../features/employeerecords/recordsApiSlice";
import { format } from "date-fns";

const ALPHA_REGEX = /^[a-zA-Z\s]+$/;
const ALPHANUM_REGEX = /^[a-zA-Z0-9]+$/;
const NUMBERWDECIMAL_REGEX = /^\d+\.?\d*$/;
const NUMBER_REGEX = /^\d+$/;
const IDNUMS_REGEX = /^\d+-?\d*-?\d*$/;

const useRecordForm = ({
  geninfo = null,
  personalinfo = null,
  dependent = null,
  educinfo = null,
  workinfo = null,
}) => {
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

  /* INITAL STATES */
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
        Email: "",
        PresentAddress: "",
        PermanentAddress: "",
        Address: "",
        ZipCode: "",
        Gender: "",
        Height: "",
        Weight: "",
        CivilStatis: "",
        Spouse: "",
        Phone: "",
        Mobile: "",
        FatherName: "",
        Foccupation: "",
        MotherName: "",
        Moccupation: "",
      }
    : { ...personalinfo, Birthday: dateFormatter(personalinfo.Birthday) };
  const dependentinfoInitialState = !dependent
    ? {
        Names: "",
        Dependent: "",
        Birthday: "",
        Status: "",
        Relationship: "",
        Covered: 0,
      }
    : {
        ...dependent,
        Birthday: dateFormatter(dependent.Birthday),
      };
  const educinfoInitialState = !educinfo
    ? {
        Institution_Name: "",
        Address: "",
        Level: "",
        Degree: "",
        yrStart: "",
        yrGraduated: "",
        Field_of_Study: "",
        Major: "",
      }
    : educinfo;

  const inputRegExpTest = (inputValue = "", REGEX = new RegExp()) => {
    const isMatch = REGEX.test(inputValue);
    if (isMatch) {
      return inputValue;
    }

    return "";
  };

  /* REDUCER FUNCTIONS */
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
  const personalinfoReducer = (state, action) => {
    switch (action.type) {
      case "birthday": {
        return { ...state, Birthday: action.Birthday };
      }

      case "email": {
        return { ...state, Email: action.Email };
      }

      case "present_address": {
        return { ...state, PresentAddress: action.PresentAddress };
      }

      case "permanent_address": {
        return { ...state, PermanentAddress: action.PermanentAddress };
      }

      case "zip_code": {
        return {
          ...state,
          ZipCode: inputRegExpTest(action.ZipCode, NUMBER_REGEX),
        };
      }

      case "gender": {
        return { ...state, Gender: action.Gender };
      }

      case "height": {
        return {
          ...state,
          Height: inputRegExpTest(action.Height, NUMBERWDECIMAL_REGEX),
        };
      }

      case "weight": {
        return {
          ...state,
          Weight: inputRegExpTest(action.Weight, NUMBERWDECIMAL_REGEX),
        };
      }

      case "civil_status": {
        return { ...state, CivilStatus: action.CivilStatus };
      }

      case "spouse": {
        return { ...state, Spouse: action.Spouse };
      }

      case "phone": {
        return { ...state, Phone: inputRegExpTest(action.Phone, NUMBER_REGEX) };
      }

      case "mobile": {
        return {
          ...state,
          Mobile: inputRegExpTest(action.Mobile, NUMBER_REGEX),
        };
      }

      case "father_name": {
        return {
          ...state,
          FatherName: inputRegExpTest(action.FatherName, ALPHA_REGEX),
        };
      }

      case "foccupation": {
        return {
          ...state,
          Foccupation: inputRegExpTest(action.Foccupation, ALPHA_REGEX),
        };
      }

      case "mother_name": {
        return {
          ...state,
          MotherName: inputRegExpTest(action.MotherName, ALPHA_REGEX),
        };
      }

      case "moccupation": {
        return {
          ...state,
          Moccupation: inputRegExpTest(action.Moccupation, ALPHA_REGEX),
        };
      }

      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };
  const dependentinfoReducer = (state, action) => {
    switch (action.type) {
      case "names": {
        return { ...state, Names: inputRegExpTest(action.Names, ALPHA_REGEX) };
      }
      case "dependent": {
        return {
          ...state,
          Dependent: inputRegExpTest(action.Dependent, ALPHANUM_REGEX),
        };
      }
      case "birthday": {
        return { ...state, Birthday: action.Birthday };
      }
      case "status": {
        return { ...state, Status: action.Status };
      }
      case "relationship": {
        return { ...state, Relationship: action.Relationship };
      }
      case "covered": {
        return { ...state, Covered: action.Covered };
      }

      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };
  const educinfoReducer = (state, action) => {
    switch (action.type) {
      case "institution_name": {
        return {
          ...state,
          Institution_Name: inputRegExpTest(
            action.Institution_Name,
            ALPHA_REGEX
          ),
        };
      }
      case "address": {
        return { ...state, Address: action.Address };
      }
      case "level": {
        return { ...state, Level: action.Level };
      }
      case "degree": {
        return { ...state, Degree: action.Degree };
      }
      case "yr_start": {
        return {
          ...state,
          yrStart: inputRegExpTest(action.yrStart, NUMBER_REGEX),
        };
      }
      case "yr_graduated": {
        return {
          ...state,
          yrGraduated: inputRegExpTest(action.yrGraduated, NUMBER_REGEX),
        };
      }
      case "field_of_study": {
        return {
          ...state,
          Field_of_Study: inputRegExpTest(action.Field_of_Study, ALPHA_REGEX),
        };
      }
      case "major": {
        return {
          ...state,
          Major: inputRegExpTest(action.Major, ALPHA_REGEX),
        };
      }

      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  /* REDUCER HOOKS */
  const [genState, genDispatch] = useReducer(
    geninfoReducer,
    geninfoInitialState
  );
  const [persState, persDispatch] = useReducer(
    personalinfoReducer,
    personalinfoInitialState
  );
  const [depState, depDispatch] = useReducer(
    dependentinfoReducer,
    dependentinfoInitialState
  );
  const [educState, educDispatch] = useReducer(
    educinfoReducer,
    educinfoInitialState
  );

  return {
    genState,
    genDispatch,
    persState,
    persDispatch,
    depState,
    depDispatch,
    educState,
    educDispatch,
  };
};

export default useRecordForm;
