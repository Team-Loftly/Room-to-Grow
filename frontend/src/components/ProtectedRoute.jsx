import { Navigate } from "react-router-dom";
// check if we are logged in before allowing users to continue to other pages
export default function ProtectedRoute({ children }) {
  const currentUser = localStorage.getItem("currentUser");
  return currentUser ? children : <Navigate to="/" />;
}
