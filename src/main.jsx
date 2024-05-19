
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./Root";
import Home from "./Pages/Home/Home";
<<<<<<< HEAD
import Login from "./Security/Login";
import AuthProvider from "./Security/AuthProvider";
import PrivateRoute from "./Security/PrivateRoute";
import Register from "./Security/Register";
import Profile from "./Pages/Profile/Profile";

=======
import AdAccountTable from "./Pages/Home/AdAccountTable";
>>>>>>> 7d71186e59fcf05180af6e295010c5e4af72c265

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children:[
      {
        path:'/',
        element:<Home></Home>
      },
      {
<<<<<<< HEAD
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: "/signup",
        element: <Register></Register>
=======
        path:'/adAccountTable',
        element:<AdAccountTable></AdAccountTable>
>>>>>>> 7d71186e59fcf05180af6e295010c5e4af72c265
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);