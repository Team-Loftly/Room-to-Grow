import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../util";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    return <Navigate to="/" />;
  }

  return children;
}
