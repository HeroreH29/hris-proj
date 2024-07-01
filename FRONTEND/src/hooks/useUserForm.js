import { useReducer } from "react";

const useUserForm = ({ user }) => {
  const initialState = !user
    ? {
        username: "",
        password: "",
        userGroup: "",
        userLevel: "",
        active: false,
        showPass: false,
        online: false,
        employee: "",
      }
    : user;

  const reducer = (state, action) => {
    switch (action.type) {
      case "username": {
        return { ...state, username: action.username };
      }
      case "password": {
        return { ...state, password: action.password };
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
      case "online": {
        return { ...state, online: !state.online };
      }
      case "showpass": {
        return { ...state, showPass: !state.showPass };
      }
      case "employeeSelect": {
        return {
          ...state,
          employee: action.employee,
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
