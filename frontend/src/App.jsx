import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registeration from "./pages/Registeration";
import Stats from "./pages/Stats";
import Market from "./pages/Market";
import EditRoom from "./pages/EditRoom";
import Tasks from "./pages/Tasks";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
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
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/marketplace" element={<Market />} />
            <Route path="/edit" element={<EditRoom />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
