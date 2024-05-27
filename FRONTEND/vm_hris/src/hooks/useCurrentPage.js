import { useLocation } from "react-router-dom";

const useCurrentPage = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  return currentPage;
};

export default useCurrentPage;
