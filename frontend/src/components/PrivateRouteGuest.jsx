import { Navigate } from "react-router-dom";

const PrivateRouteGuest = ({ children }) => {
  const isGuest = localStorage.getItem("guest");
  if (isGuest) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

export default PrivateRouteGuest;
