import { useReducer } from "react";
import { useGetGeninfosQuery } from "../features/employeerecords/recordsApiSlice";
import DateFormatter from "../xtra_functions/DateFormatter";

const ALPHA_REGEX = /^[a-zA-Z\s]+$/;
const ALPHANUM_REGEX = /^[a-zA-Z0-9]+$/;
const NUMBERWDECIMAL_REGEX = /^\d+\.?\d*$/;
const NUMBER_REGEX = /^\d+$/;
//const IDNUMS_REGEX = /^\d+-?\d*-?\d*$/;

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

  // Number splitter
  const idNumberSplitter = (str = "") => {
    const splitStr = str?.split("-");
    return splitStr;
  };

  /* // Number joined
  const idNumberJoiner = (str) => {
    const joinStr = str.join("-");
    return joinStr;
  }; */

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
        TINnumber: [],
        SSSnumber: [],
        PHnumber: [],
        PInumber: [],
        ATMnumber: [],
      }
    : {
        ...geninfo,
        RegDate: DateFormatter(geninfo?.RegDate),
        DateEmployed: DateFormatter(geninfo?.DateEmployed),
        DateProbationary: DateFormatter(geninfo?.DateProbationary),
        DateLeaved: DateFormatter(geninfo?.DateLeaved),
        ContractDateEnd: DateFormatter(geninfo?.ContractDateEnd),
        PInumber: idNumberSplitter(geninfo?.PInumber) ?? "",
        ATMnumber: idNumberSplitter(geninfo?.ATMnumber) ?? "",
        TINnumber: idNumberSplitter(geninfo?.TINnumber) ?? "",
        SSSnumber: idNumberSplitter(geninfo?.SSSnumber) ?? "",
        PHnumber: idNumberSplitter(geninfo?.PHnumber) ?? "",
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
    : { ...personalinfo, Birthday: DateFormatter(personalinfo.Birthday) };
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
        Birthday: DateFormatter(dependent.Birthday),
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
  const workinfoInitialState = !workinfo
    ? {
        Position_Title: "",
        Company_Name: "",
        JoinedFR_M: "",
        JoinedFR_Y: 0,
        JoinedTO_M: "",
        JoinedTO_Y: 0,
        Specialization: "",
        Role: "",
        Country: "",
        State: "",
        Industry: "",
        Position: "",
        Salary: "",
        Work_Description: "",
        ToPresent: 0,
      }
    : workinfo;

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
        // Apply the updated part to the current one
        state.TINnumber[action.index] = action.TINnumber;
        return {
          ...state,
        };
      }
      case "sss_number": {
        // Apply the updated part to the current one
        state.SSSnumber[action.index] = action.SSSnumber;
        return {
          ...state,
        };
      }
      case "ph_number": {
        // Apply the updated part to the current one
        state.PHnumber[action.index] = action.PHnumber;
        return {
          ...state,
        };
      }
      case "pi_number": {
        // Apply the updated part to the current one
        state.PInumber[action.index] = action.PInumber;

        return {
          ...state,
        };
      }
      case "atm_number": {
        // Apply the updated part to the current one
        state.ATMnumber[action.index] = action.ATMnumber;
        return {
          ...state,
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

  const workinfoReducer = (state, action) => {
    switch (action.type) {
      case "position_title": {
        return {
          ...state,
          Position_Title: inputRegExpTest(action.Position_Title, ALPHA_REGEX),
        };
      }
      case "company_name": {
        return {
          ...state,
          Company_Name: inputRegExpTest(action.Company_Name, ALPHA_REGEX),
        };
      }
      case "joinedFR_M": {
        return {
          ...state,
          JoinedFR_M: inputRegExpTest(action.JoinedFR_M, ALPHA_REGEX),
        };
      }
      case "joinedFR_Y": {
        return {
          ...state,
          JoinedFR_Y: inputRegExpTest(action.JoinedFR_Y, NUMBER_REGEX),
        };
      }
      case "joinedTO_M": {
        return {
          ...state,
          JoinedTO_M: inputRegExpTest(action.JoinedTO_M, ALPHA_REGEX),
        };
      }
      case "joinedTO_Y": {
        return {
          ...state,
          JoinedTO_Y: inputRegExpTest(action.JoinedTO_Y, NUMBER_REGEX),
        };
      }
      case "specialization": {
        return {
          ...state,
          Specialization: inputRegExpTest(action.Specialization, ALPHA_REGEX),
        };
      }
      case "role": {
        return {
          ...state,
          Role: inputRegExpTest(action.Role, ALPHA_REGEX),
        };
      }
      case "country": {
        return {
          ...state,
          Country: inputRegExpTest(action.Country, ALPHA_REGEX),
        };
      }
      case "state": {
        return {
          ...state,
          State: action.State,
        };
      }
      case "industry": {
        return {
          ...state,
          Industry: inputRegExpTest(action.Industry, ALPHA_REGEX),
        };
      }
      case "position": {
        return {
          ...state,
          Position: inputRegExpTest(action.Position, ALPHA_REGEX),
        };
      }
      case "salary": {
        return {
          ...state,
          Salary: inputRegExpTest(action.Salary, ALPHANUM_REGEX),
        };
      }
      case "work_description": {
        return {
          ...state,
          Work_Description: inputRegExpTest(
            action.Work_Description,
            ALPHA_REGEX
          ),
        };
      }
      case "toPresent": {
        return {
          ...state,
          ToPresent: inputRegExpTest(action.ToPresent ? 1 : 0, NUMBER_REGEX),
        };
      }

      default:
        throw Error("Unknown action: " + action.type);
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
  const [workState, workDispatch] = useReducer(
    workinfoReducer,
    workinfoInitialState
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
    workState,
    workDispatch,
  };
};

export default useRecordForm;
