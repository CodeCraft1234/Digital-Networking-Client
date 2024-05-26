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
import AddCampaign from "./Pages/AddCampain/AddCampaign";
import PrivateRoute from "./Security/PrivateRoute";
import SalarySheet from "./Components/SalarySheet/SalarySheet";
import UserCampaign from "./Pages/UserCampain/UserCampain";
import UserAdAccount from "./Components/UserAdAccount/UserAdAccount";
import MonthlyAdAccount from "./Pages/Home/MonthlyAddAccount";
import AddClient from "./Pages/Home/AddClient";
import UserProfile from "./Pages/Home/UserProfile";
import AddAdsAccount from "./Pages/AddAdsAccount/AddAdsAccount";

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
        path: '/login',
        element: <Login></Login>
      },
      {
        path: "/signup",
        element: <Register></Register>
      },
      {
        path:'/adAccountAds',
        element:<AddAdsAccount></AddAdsAccount>
      },
      {
        path:'/adAccountTable',
        element:<UserAdAccount></UserAdAccount>
      },
      {
        path:'/monthlyadAccountTable',
        element:<MonthlyAdAccount></MonthlyAdAccount>
      },
      {
        path:'/updateProfile',
        element:<UpdateProfile></UpdateProfile>
       },
      {
        path:'/userInfo/:email',
        element:<Profile></Profile>,
        loader: ({ params }) => fetch(`https://digital-networking-server.vercel.app/users/${params.email}`)
       },
       {
        path:'/addCampaign',
        element:<AddCampaign></AddCampaign>
       },
       {
        path:'/addClient',
        element:<AddClient></AddClient>
       },
       {
        path:'/salary',
        element:<SalarySheet></SalarySheet>,
       },
       {
        path:'/client/:email',
        element:<UserProfile></UserProfile>,
        loader: ({ params }) => fetch(`http://localhost:5000/users/${params.email}`)
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