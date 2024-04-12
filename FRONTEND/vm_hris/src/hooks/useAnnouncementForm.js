import { useReducer } from "react";

const useAnnouncementForm = ({ announcement = null }) => {
  const initialState = !announcement
    ? {
        title: "",
        message: "",
        validated: false,
      }
    : announcement;

  const reducer = (state, action) => {
    switch (action.type) {
      case "input_title": {
        return { ...state, title: action.title };
      }
      case "input_message": {
        return { ...state, message: action.message };
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

export default useAnnouncementForm;
