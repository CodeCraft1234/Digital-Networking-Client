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
import EmployeeAdAccount from "./Components/EmployeeAdAccount/EmployeeAdAccount";
import Profile1 from "./Pages/Home/Profile1";
import Profile2 from "./Pages/Home/Profile2";
import Profile3 from "./Pages/Home/Profile3";
import AllClients from "./Pages/Home/AllClients";
import AllAdsAccount from "./Pages/Home/AllAdsAccount";
import EmployeeMonthlySalary from "./Pages/Home/EmployeerMouthlySelery";
import AllCampaign from "./Pages/Home/AllCampaign";
import MyCampaigns from "./Pages/Home/Mycampaigns";
import { HelmetProvider } from "react-helmet-async";
import MyClients from "./Pages/Home/MyClients";
import EmployeePayments from "./Pages/Home/EmployeePayments";
import DashboardRoot from "./Pages/DashboardRoot/DashboardRoot";
import Banner from "./Pages/Home/Banner";
import AllUsers from "./Pages/Home/AllUsers";
import Dashboard from "./Pages/DashboardRoot/Dashboard";
import CampaignTable2 from "./Pages/Home/CampaignTable2";

import Settings from "./Pages/DashboardRoot/Routes/Settings";
import Users from "./Pages/DashboardRoot/Users";
import AddClientTwo from "./Pages/DashboardRoot/AddClient";
import AddEmployee from "./Pages/DashboardRoot/AddEmployee";
import AddLogos from "./Pages/DashboardRoot/Routes/AddLogos";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children:[
      {
        path:'/',
        element:<PrivateRoute><Home></Home></PrivateRoute>
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
        path:'/employeeAdAccount/:id',
        element:<EmployeeAdAccount></EmployeeAdAccount>
      },
      {
        path:'/allAdSAccount',
        element:<AllAdsAccount></AllAdsAccount>
      },
      {
        path:'/allClients',
        element:<AllClients></AllClients>
      },
      {
        path:'/updateProfile',
        element:<UpdateProfile></UpdateProfile>
       },
      {
        path:'/allEmployee',
        element:<AllEmployee></AllEmployee>
       },
      {
        path:'/userInfo/:email',
        element:<Profile></Profile>,
        loader: ({ params }) => fetch(`https://digital-networking-server.vercel.app/users/${params.email}`)
       },
       {
        path:'/allCampaign',
        element:<AllCampaign></AllCampaign>
       },
       {
        path:'/employeePayment',
        element:<EmployeePayments></EmployeePayments>
       },
       {
        path:'/myCampaigns',
        element:<MyCampaigns></MyCampaigns>
       },
       {
        path:'/myClients',
        element:<MyClients></MyClients>
       },
       {
        path:'/addClient',
        element:<AddClient></AddClient>
       },
       {
        path:'/salerySheet',
        element:<SalarySheet></SalarySheet>
       },
       {
        path:'/employeeMonthlySelary',
        element:<EmployeeMonthlySalary></EmployeeMonthlySalary>
       },
       {
        path:'/selary/:email',
        element:<Profile1></Profile1>,
        loader: ({ params }) => fetch(`https://digital-networking-server.vercel.app/users/${params.email}`)

       },
       {
        path:'/adsAccount/:email',
        element:<Profile2></Profile2>,
        loader: ({ params }) => fetch(`https://digital-networking-server.vercel.app/users/${params.email}`)
       },
       {
        path:'/myProfile/:email',
        element:<Profile3></Profile3>,
        loader: ({ params }) => fetch(`https://digital-networking-server.vercel.app/users/${params.email}`)

       },
       {
        path:'/client/:email',
        element:<UserProfile></UserProfile>,
        loader: ({ params }) => fetch(`https://digital-networking-server.vercel.app/users/${params.email}`)
       },
       {
        path: "dashboard",
        element:<DashboardRoot></DashboardRoot>,
        children: [
          {
            path:'dashboard',
            element:<Banner></Banner>
           },
          {
            path:'/dashboard/employee/home',
            element:<CampaignTable2></CampaignTable2>
           },
          {
            path:'dashboard/allCampaign',
            element:<AllCampaign></AllCampaign>
           },
          {
            path:'dashboard/addEmployee',
            element:<AddEmployee></AddEmployee>
           },
          {
            path:'/dashboard/addLogos',
            element:<AddLogos></AddLogos>
           },
           {
            path:'/dashboard/settings',
            element:<Settings></Settings>
           },
           {
            path:'dashboard/employeePayment',
            element:<EmployeePayments></EmployeePayments>
           },
           {
            path:'dashboard/allEmployee',
            element:<AllEmployee></AllEmployee>
           },
           {
            path:'dashboard/allAdSAccount',
            element:<AllAdsAccount></AllAdsAccount>
          },
          {
            path:'dashboard/allClients',
            element:<AllClients></AllClients>
          },
          {
            path:'dashboard/allUsers',
            element:<AllUsers></AllUsers>
          },
          {
            path:'dashboard/AddClients',
            element:<AddClientTwo></AddClientTwo>
          },
          {
            path:'dashboard/Users',
            element:<Users></Users>
          },
          {
            path:'dashboard/myCampaigns',
            element:<MyCampaigns></MyCampaigns>
           },
           {
            path:'dashboard/myClients',
            element:<MyClients></MyClients>
           },
           {
            path:'dashboard/addClient',
            element:<AddClient></AddClient>
           },
           {
            path:'dashboard/salerySheet',
            element:<SalarySheet></SalarySheet>
           },
           {
            path:'dashboard/employeeMonthlySelary',
            element:<EmployeeMonthlySalary></EmployeeMonthlySalary>
           },
        
           {
            path:'dashboard/adsAccount/:email',
            element:<Profile2></Profile2>,
            loader: ({ params }) => fetch(`https://digital-networking-server.vercel.app/users/${params.email}`)
           },
        ]
       }
    ]
  },
]);

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <HelmetProvider>
    <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
    </HelmetProvider> 
    </QueryClientProvider>
  </React.StrictMode>
);