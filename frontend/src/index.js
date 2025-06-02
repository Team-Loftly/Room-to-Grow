import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
import ProtectedRoute from './components/ProtectedRoute';

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
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
  },
  {
    path: '/tasks',
    element: <ProtectedRoute><TaskPage /></ProtectedRoute>
  },
  {
    path: '/stats',
    element: <ProtectedRoute><StatPage /></ProtectedRoute>
  },
  {
    path: '/marketplace',
    element: <ProtectedRoute><MarketPage /></ProtectedRoute>
  },
  {
    path: '/edit',
    element: <ProtectedRoute><EditPage /></ProtectedRoute>
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