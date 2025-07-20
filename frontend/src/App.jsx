import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registeration from "./pages/Registeration";
import Stats from "./pages/Stats";
import Market from "./pages/Market";
import EditRoom from "./pages/EditRoom";
import Tasks from "./pages/Tasks";
import Friends from "./pages/Friends";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { useEffect } from "react";
import { isTokenExpired } from "./util";
import { useNavigate } from "react-router-dom";
import Missions from "./pages/Missions";
function App() {
  const navigate = useNavigate();
  // check the user's token each time they attempt to navigate away
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <main>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registeration />} />

          {/* protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/habits" element={<Tasks />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/marketplace" element={<Market />} />
            <Route path="/edit" element={<EditRoom />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/missions" element={<Missions />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
