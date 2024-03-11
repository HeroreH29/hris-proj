import { useReducer } from "react";

const useAuthForm = () => {
  const initialState = {
    username: "",
    password: "",
    showPass: false,
    confirmPassword: "",
    showConfirmPass: false,
    validated: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "input_username": {
        return { ...state, username: action.username };
      }
      case "input_password": {
        return { ...state, password: action.password };
      }
      case "confirm_password": {
        return { ...state, confirmPassword: action.confirmPassword };
      }
      case "show_password": {
        return { ...state, showPass: !state.showPass };
      }
      case "validated": {
        return { ...state, validated: action.validated };
      }

      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch };
};

export default useAuthForm;
