import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import StatPage from "./components/StatPage";
import MarketPage from "./components/MarketPage";
import EditPage from "./components/EditPage";
import TaskPage from "./components/TaskPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/tasks",
        element: <TaskPage />,
      },
      {
        path: "/stats",
        element: <StatPage />,
      },
      {
        path: "/marketplace",
        element: <MarketPage />,
      },
      {
        path: "/edit",
        element: <EditPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
