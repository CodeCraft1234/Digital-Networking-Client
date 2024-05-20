
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./Root";
import Home from "./Pages/Home/Home";
import Login from "./Security/Login";
import AuthProvider from "./Security/AuthProvider";

import Register from "./Security/Register";


import AdAccountTable from "./Pages/Home/AdAccountTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AllEmployee from "./Pages/AllEmployee/AllEmployee";

import UpdateProfile from "./Pages/Profile/UpdateProfile";
import NavBar from "./Components/Navber/Navber";
import Profile from "./Pages/Profile/Profile";
import ProfileRoot from "./Pages/Profile/ProfileRoot";


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
        path: "/gk/:email",
        element: <NavBar></NavBar>,
        loader: ({ params }) => fetch(`http://localhost:5000/users/${params.email}`)
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: "/signup",
        element: <Register></Register>
      },
      {
        path:'/adAccountTable',
        element:<AdAccountTable></AdAccountTable>
      },
      {

        path:'/allEmployee',
        element:<AllEmployee></AllEmployee>
      },
      {
        path:'/updateProfile',
        element:<UpdateProfile></UpdateProfile>
       },
      {
        path:'/userInfo/:id',
        element:<Profile></Profile>,
        loader: ({ params }) => fetch(`http://localhost:5000/users/${params.id}`)
       },
    ]
  },
]);

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);