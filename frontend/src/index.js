import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './store';

import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import StatPage from './components/StatPage';
import MarketPage from './components/MarketPage';
import EditPage from './components/EditPage';
import TaskPage from './components/TaskPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/tasks',
    element: <TaskPage />
  },
  {
    path: '/stats',
    element: <StatPage />
  },
  {
    path: '/marketplace',
    element: <MarketPage />
  },
  {
    path: '/edit',
    element: <EditPage />
  }
  // TODO: Add other routes as needed
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>

)