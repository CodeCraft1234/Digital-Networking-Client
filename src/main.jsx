import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Home from "./Pages/Home/Home";
import Login from "./Security/Login";
import AuthProvider from "./Security/AuthProvider";
import Register from "./Security/Register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AllEmployee from "./Pages/AllEmployee/AllEmployee";
import UpdateProfile from "./Pages/Profile/UpdateProfile";
import Profile from "./Pages/Profile/Profile";
import PrivateRoute from "./Security/PrivateRoute";
import SalarySheet from "./Components/SalarySheet/SalarySheet";
import AddClient from "./Pages/Home/AddClient";
import UserProfile from "./Pages/Home/UserProfile";
import Profile2 from "./Pages/Home/Profile2";
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
import CampaignTable2 from "./Pages/Home/CampaignTable2";

import Settings from "./Pages/DashboardRoot/Routes/Settings";
import Users from "./Pages/DashboardRoot/Users";
import AddClientTwo from "./Pages/DashboardRoot/AddClient";
import AddEmployee from "./Pages/DashboardRoot/AddEmployee";
import AddLogos from "./Pages/DashboardRoot/Routes/AddLogos";
import AdminPayments from "./Pages/DashboardRoot/AdminPayments";
import ClientPayments from "./Pages/DashboardRoot/ClientPayments";
import Summery from "./Pages/DashboardRoot/Summery";
import AllClientsPayments from "./Pages/Home/AllClientsPayments";
import AdsAccountCenter from "./Pages/DashboardRoot/Routes/AdsAccountCenter";
import AdsPayments from "./Pages/DashboardRoot/AdsPayments";
import AdsDashboardHome from "./Pages/DashboardRoot/AdsHome";
import AllAdsPayments from "./Pages/DashboardRoot/AllAdsPayments";
import AdsUser from "./Pages/DashboardRoot/AdsUser";
import AdsProfile from "./Pages/DashboardRoot/AdsProfile";
import MySellery from "./Pages/DashboardRoot/MySellery";
import Sellery from "./Pages/DashboardRoot/Sellery";
import History from "./Pages/DashboardRoot/History";
import MyHistory from "./Pages/DashboardRoot/MyHistory";
import EmployeerSellery from "./Pages/DashboardRoot/EmployeerSellery";
import { ToastContainer } from "react-toastify";
import Activity from "./Pages/DashboardRoot/Activity";

const router = createBrowserRouter([
  {
    path:'/login',
    element:<Login></Login>
   },
   {
    path:'/signup',
    element:<Register></Register>
   },
  
  {
    path: "/",
    element:<PrivateRoute><DashboardRoot></DashboardRoot></PrivateRoute>,
    children: [
      {
        path:'/',
        element:<PrivateRoute><Home></Home></PrivateRoute>
      },
      {
        path:'/dashboard/admin/home',
        element:<Banner></Banner>
       },
      {
        path:'/dashboard/ads/home',
        element:<AdsDashboardHome></AdsDashboardHome>
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
        path:'dashboard/summery',
        element:<Summery></Summery>
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
        path:'/dashboard/adminPayments',
        element:<AdminPayments></AdminPayments>
       },
       {
        path:'/dashboard/AllClientsPayments',
        element:<AllClientsPayments></AllClientsPayments>
       },
       {
        path:'/dashboard/clientPayments',
        element:<ClientPayments></ClientPayments>
       },
       {
        path:'/dashboard/AllAdsPayments',
        element:<AllAdsPayments></AllAdsPayments>
       },

       {
        path:'/dashboard/adsPayments',
        element:<AdsPayments></AdsPayments>
       },
       {
        path:'/dashboard/adsUser',
        element:<AdsUser></AdsUser>
       },
       {
        path:'/dashboard/client/:email',
        element:<UserProfile></UserProfile>,
        loader: ({ params }) => fetch(`https://digital-networking-server.vercel.app/users/${params.email}`)
       },
       {
        path:'/dashboard/userInfo/:email',
        element:<Profile></Profile>,
        loader: ({ params }) => fetch(`https://digital-networking-server.vercel.app/users/${params.email}`)
       },
       {
        path:'/dashboard/adsuserInfo/:email',
        element:<AdsProfile></AdsProfile>,
        loader: ({ params }) => fetch(`https://digital-networking-server.vercel.app/users/${params.email}`)
       },
       {
        path:'/dashboard/payments/:email',
        element:<UserProfile></UserProfile>,
        loader: ({ params }) => fetch(`https://digital-networking-server.vercel.app/users/${params.email}`)
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
        path:'dashboard/updateProfile',
        element:<UpdateProfile></UpdateProfile>
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
        path:'dashboard/history',
        element:<History></History>
       },
       {
        path:'dashboard/employeerSellery/:email',
        element:<EmployeerSellery></EmployeerSellery>
       },
       {
        path:'dashboard/myActivity',
        element:<Activity></Activity>
       },
       {
        path:'dashboard/sellery',
        element:<Sellery></Sellery>
       },
       {
        path:'dashboard/mySellery',
        element:<MySellery></MySellery>
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
       {
        path:'dashboard/adsAccountCenter/:email',
        element:<AdsAccountCenter></AdsAccountCenter>,
        loader: ({ params }) => fetch(`https://digital-networking-server.vercel.app/users/${params.email}`)
       },
    ]
   }
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