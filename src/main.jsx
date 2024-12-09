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
import Profile from "./Pages/Profile/EmployeeProfile";
import PrivateRoute from "./Security/PrivateRoute";
import SalarySheet from "./Components/SalarySheet/SalarySheet";
import AddClient from "./Pages/Home/AddClient";
import UserProfile from "./Pages/Home/ClientProfile";
import Profile2 from "./Pages/Home/Profile2";
import EmployeeMonthlySalary from "./Pages/Home/EmployeerMouthlySelery";
import MyCampaigns from "./Pages/Home/MetaAds";
import { HelmetProvider } from "react-helmet-async";
import MyClients from "./Pages/Home/Clients";
import EmployeePayments from "./Pages/Home/EmployeePayments";
import DashboardRoot from "./Pages/DashboardRoot/DashboardRoot";
import Banner from "./Pages/Home/Banner";
import AllUsers from "./Pages/Home/AllUsers";
import CampaignTable2 from "./Pages/Home/EmployeeHome";
import Users from "./Pages/DashboardRoot/Users";
import AddEmployee from "./Pages/DashboardRoot/AddEmployee";
import Summery from "./Pages/DashboardRoot/Summery";
import AdsAccountCenter from "./Pages/DashboardRoot/Routes/AdsAccountCenter";
import AdsPayments from "./Pages/DashboardRoot/AdsPayments";
import AdsDashboardHome from "./Pages/DashboardRoot/AdsHome";
import AdsUser from "./Pages/DashboardRoot/AdsUser";
import AdsProfile from "./Pages/DashboardRoot/AdsProfile";
import MySellery from "./Pages/DashboardRoot/MySellery";
import History from "./Pages/DashboardRoot/MonthlySpend";
import EmployeerSellery from "./Pages/DashboardRoot/EmployeerSellery";
import EmployeeClients from "./Pages/Home/EmployeeClients";
import AllSummery from "./Pages/DashboardRoot/Summery";
import PaymentHistory from "./Pages/Home/PaymentHistory";
import AdsAccount from "./Pages/Home/AdsAccount";
import MyPayments from "./Pages/Home/MyPayments";
import Notification from "./Pages/DashboardRoot/Notification";
import BankInfo from "./Pages/Home/BankInfo";
import ClientHome from "./Pages/Home/ClientHome";
import ClientCampaign2 from "./Pages/Home/ClientCampaign2";
import ClientPaymentHistry2 from "./Pages/Home/ClientPaymentHistry2";
import Payoneer from "./Pages/DashboardRoot/Payoneer";
import ContriHistory from "./Pages/DashboardRoot/ContriHistory";
import ContriSummery from "./Pages/DashboardRoot/ContriSummery";
import ClientHistory from "./Pages/DashboardRoot/ClientHistory";
import OthersSellery from "./Pages/DashboardRoot/OthersSellery";
import AllSellery from "./Pages/Home/AllSellery";
import DeveloperSalary2 from "./Pages/Home/DeveloperSalary2";
import MetaAds from "./Pages/Home/MetaAds";
import GoogleAds from "./Pages/Home/GoogleAds";
import PageSetup from "./Pages/Home/PageSetup";
import Clients from "./Pages/Home/Clients";
import Salary from "./Pages/DashboardRoot/Salary";
import MonthlySpend from "./Pages/DashboardRoot/MonthlySpend";

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
        path:'dashboard/metaAds',
        element:<MetaAds></MetaAds>
       },
      {
        path:'dashboard/googleAds',
        element:<GoogleAds></GoogleAds>
       },
      {
        path:'dashboard/pageSetup',
        element:<PageSetup></PageSetup>
       },
      {
        path:'dashboard/monthlySpend',
        element:<MonthlySpend></MonthlySpend>
       },

       {
        path:'dashboard/clients',
        element:<Clients></Clients>
      },
      {
        path:'/dashboard/bankInfo',
        element:<BankInfo></BankInfo>
       },
       {
        path:'dashboard/summery',
        element:<Summery></Summery>
       },
       {
        path:'dashboard/salary',
        element:<Salary></Salary>
       },


       {
        path:'/dashboard/adsPayments',
        element:<AdsPayments></AdsPayments>
       },
       {
        path:'/dashboard/contributorSummery',
        element:<ContriSummery></ContriSummery>
       },
       {
        path:'/dashboard/contributorHistory',
        element:<ContriHistory></ContriHistory>
       },
       {
        path:'/dashboard/notification',
        element:<Notification></Notification>
       },

       {
        path:'/dashboard/adsUser',
        element:<AdsUser></AdsUser>
       },
       {
        path:'/dashboard/client/:email',
        element:<UserProfile></UserProfile>,
       },
       {
        path:'/dashboard/userInfo/:email',
        element:<Profile></Profile>,
       },
       {
        path:'/dashboard/adsuserInfo/:email',
        element:<AdsProfile></AdsProfile>,
       },
       {
        path:'/dashboard/payments/:email',
        element:<UserProfile></UserProfile>,
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
        element:<AdsAccount></AdsAccount>
      },
      {
        path:'dashboard/allAdSAccount',
        element:<AdsAccount></AdsAccount>
      },

      {
        path:'dashboard/allUsers',
        element:<AllUsers></AllUsers>
      },
      {
        path:'dashboard',
        element:<ClientHome></ClientHome>
      },
      {
        path:'dashboard/clientCampaigns',
        element:<ClientCampaign2></ClientCampaign2>
      },
      {
        path:'dashboard/paymentsClient',
        element:<ClientPaymentHistry2></ClientPaymentHistry2>
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
        path:'dashboard/history',
        element:<History></History>
       },
       {
        path:'dashboard/allPayments',
        element:<PaymentHistory></PaymentHistory>
       },

       {
        path:'dashboard/allEmployeeClients/:email',
        element:<EmployeeClients></EmployeeClients>
       },

       {
        path:'dashboard/mySellery',
        element:<MySellery></MySellery>
       },
       {
        path:'dashboard/myPayments',
        element:<MyPayments></MyPayments>
       },
       {
        path:'dashboard/payoneer',
        element:<Payoneer></Payoneer>
       },
       {
        path:'dashboard/notification',
        element:<Notification></Notification>
       },
       {
        path:'dashboard/clientHistory',
        element:<ClientHistory></ClientHistory>
       },
       {
        path:'dashboard/employeeMonthlySelary',
        element:<EmployeeMonthlySalary></EmployeeMonthlySalary>
       },
    
       {
        path:'dashboard/myAdsAccount',
        element:<AdsAccount />,
       },
       {
        path:'dashboard/myDevSalary',
        element:<DeveloperSalary2></DeveloperSalary2>,
       },
       {
        path:'dashboard/othersSellery',
        element:<OthersSellery></OthersSellery>,
       },
       {
        path:'dashboard/adsAccountCenter/:email',
        element:<AdsAccountCenter></AdsAccountCenter>,
        loader: ({ params }) => fetch(`https://hishab-2025.vercel.app/users/${params.email}`)
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