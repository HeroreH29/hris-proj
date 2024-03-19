import { useReducer } from "react";

const useUserForm = ({ user }) => {
  const initialState = !user
    ? {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        branch: "",
        userGroup: "",
        userLevel: "",
        active: false,
        showPass: false,
        employeeId: undefined,
      }
    : user;

  const reducer = (state, action) => {
    switch (action.type) {
      case "employeeId": {
        return { ...state, employeeId: action.employeeId };
      }
      case "username": {
        return { ...state, username: action.username };
      }
      case "password": {
        return { ...state, password: action.password };
      }
      case "firstName": {
        return { ...state, firstName: action.firstName };
      }
      case "lastName": {
        return { ...state, lastName: action.lastName };
      }
      case "branch": {
        return { ...state, branch: action.branch };
      }
      case "userGroup": {
        return { ...state, userGroup: action.userGroup };
      }
      case "userLevel": {
        return { ...state, userLevel: action.userLevel };
      }
      case "active": {
        return { ...state, active: !state.active };
      }
      case "showpass": {
        return { ...state, showPass: !state.showPass };
      }
      case "employeeSelect": {
        return {
          ...state,
          firstName: action.firstName,
          lastName: action.lastName,
          branch: action.branch,
          employeeId: action.employeeId,
        };
      }

      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  const [userState, userDispatch] = useReducer(reducer, initialState);

  return { userState, userDispatch };
};

export default useUserForm;
