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
import UserProfile from "./Pages/Home/ClientProfile";
import { HelmetProvider } from "react-helmet-async";
import EmployeePayments from "./Pages/Home/EmployeePayments";
import DashboardRoot from "./Pages/DashboardRoot/DashboardRoot";
import Banner from "./Pages/Home/Banner";
import AllUsers from "./Pages/Home/AllUsers";
import CampaignTable2 from "./Pages/Home/EmployeeHome";
import Users from "./Pages/DashboardRoot/Users";
import Summery from "./Pages/DashboardRoot/Summery";
import AdsDashboardHome from "./Pages/DashboardRoot/AdsHome";
import AdsUser from "./Pages/DashboardRoot/AdsUser";
import AdsProfile from "./Pages/DashboardRoot/AdsProfile";
import MySellery from "./Pages/DashboardRoot/MySellery";
import History from "./Pages/DashboardRoot/MonthlySpend";
import EmployeeClients from "./Pages/Home/EmployeeClients";
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
import DeveloperSalary2 from "./Pages/Home/DeveloperSalary2";
import MetaAds from "./Pages/Home/MetaGoogleAds";
import PageSetup from "./Pages/Home/PageSetup";
import Clients from "./Pages/Home/Clients";
import Salary from "./Pages/DashboardRoot/Salary";
import MonthlySpend from "./Pages/DashboardRoot/MonthlySpend";
import AdsUserAdsAccount from "./Pages/DashboardRoot/AdsUserAdsAccount";
import ClientProfile from "./Pages/Home/ClientProfile";
import ClientLogin from "./Pages/Home/ClientLogin";
import ClientMetaAds from "./Pages/Home/ClientMetaAds";
import ClientPageSetup from "./Pages/Home/ClientPageSetup";
import ClientPaymentHistry from "./Pages/Home/ClientPaymentHistry";
import MetaAdsAccount from "./Pages/Home/MetaAdsAccount";
import Monitization from "./Pages/Home/Monitization";
import ContributorPayments from "./Pages/DashboardRoot/ContributorPayments";
import ContributorMonthlySpend from "./Pages/DashboardRoot/ContributorMonthlySpend";
import ContributorSummery from "./Pages/DashboardRoot/ContributorSummery";
import WebDesign from "./Pages/Home/WebDesign";
import GraphicDesign from "./Pages/Home/GraphicDesign";
import SalaryPayments from "./Pages/Home/SalaryPayment";
import DevGraphicSalary from "./Pages/DashboardRoot/DevGraphicsSalary";
import NoticePad from "./Pages/DashboardRoot/NoticePad";
import AllAds from "./Pages/Home/AllAds";
import MonthlyCast from "./Pages/DashboardRoot/MonthlyCast";

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
    path:'/clientLogin',
    element:<ClientLogin></ClientLogin>
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
        path:'/',
        element:<AdsDashboardHome></AdsDashboardHome>
       },
      {
        path:'/employee/home',
        element:<CampaignTable2></CampaignTable2>
       },
      {
        path:'/campaigns',
        element:<AllAds></AllAds>
       },
      {
        path:'/monthly-cast',
        element:<MonthlyCast></MonthlyCast>
       },
      {
        path:'/googleAds',
        element:<MetaAds></MetaAds>
       },
      {
        path:'/pageSetup',
        element:<PageSetup></PageSetup>
       },
      {
        path:'/monitization',
        element:<Monitization></Monitization>
       },
      {
        path:'/client/metaAds/:email',
        element:<ClientMetaAds></ClientMetaAds>
       },
      {
        path:'/client/googleAds/:email',
        element:<ClientMetaAds></ClientMetaAds>
       },
      {
        path:'/client/pageSetup/:email',
        element:<ClientPageSetup></ClientPageSetup>
       },
      {
        path:'/client/payments/:email',
        element:<ClientPaymentHistry></ClientPaymentHistry>
       },
      {
        path:'/client/summery/:email',
        element:<ClientHistory></ClientHistory>
       },
      {
        path:'/monthlySpend',
        element:<MonthlySpend></MonthlySpend>
       },
      {
        path:'/contributorAdsAccount',
        element:<MetaAdsAccount></MetaAdsAccount>
       },
      {
        path:'/contributorMonthlySpend',
        element:<ContributorMonthlySpend></ContributorMonthlySpend>
       },
      {
        path:'/webdesign',
        element:<WebDesign></WebDesign>
       },
      {
        path:'/graphicsdesign',
        element:<GraphicDesign></GraphicDesign>
       },
      {
        path:'/salaryPayments',
        element:<SalaryPayments></SalaryPayments>
       },
      {
        path:'/mySalary',
        element:<DevGraphicSalary></DevGraphicSalary>
       },
      {
        path:'/contributorSummery',
        element:<ContributorSummery></ContributorSummery>
       },
       {
        path:'/contributorPayments',
        element:<ContributorPayments></ContributorPayments>
       },
       {
        path:'/clients',
        element:<Clients></Clients>
      },
      {
        path:'/bankInfo',
        element:<BankInfo></BankInfo>
       },
      {
        path:'/noticePad',
        element:<NoticePad></NoticePad>
       },
       {
        path:'/summery',
        element:<Summery></Summery>
       },
       {
        path:'/salary',
        element:<Salary></Salary>
       },

       {
        path:'/AdsAccount',
        element:<AdsAccount></AdsAccount>
      },
      {
        path:'/allUsers',
        element:<AllUsers></AllUsers>
      },
      {
        path:'/payoneer',
        element:<Payoneer></Payoneer>
       },
      {
        path:'/myPayments',
        element:<MyPayments></MyPayments>
       },
       {
        path:'/allPayments',
        element:<PaymentHistory></PaymentHistory>
       },

       {
        path:'/contributorSummery',
        element:<ContriSummery></ContriSummery>
       },
       {
        path:'/contributorHistory',
        element:<ContriHistory></ContriHistory>
       },
       {
        path:'/notification',
        element:<Notification></Notification>
       },

       {
        path:'/adsUser',
        element:<AdsUser></AdsUser>
       },
       {
        path:'/client/:email',
        element:<ClientProfile></ClientProfile>,
       },
       {
        path:'/userInfo/:email',
        element:<Profile></Profile>,
       },
       {
        path:'/adsuserInfo/:email',
        element:<AdsProfile></AdsProfile>,
       },
       {
        path:'/payments/:email',
        element:<UserProfile></UserProfile>,
       },
       {
        path:'/employeePayment',
        element:<EmployeePayments></EmployeePayments>
       },
       {
        path:'/allEmployee',
        element:<AllEmployee></AllEmployee>
       },
       {
        path:'/allAdSAccount',
        element:<AdsAccount></AdsAccount>
      },



      {
        path:'dashboard',
        element:<ClientHome></ClientHome>
      },
      {
        path:'/clientCampaigns',
        element:<ClientCampaign2></ClientCampaign2>
      },
      {
        path:'/paymentsClient',
        element:<ClientPaymentHistry2></ClientPaymentHistry2>
      },
      {
        path:'/Users',
        element:<Users></Users>
      },
      {
        path:'/updateProfile',
        element:<UpdateProfile></UpdateProfile>
      },
       {
        path:'/history',
        element:<History></History>
       },


       {
        path:'/allEmployeeClients/:email',
        element:<EmployeeClients></EmployeeClients>
       },

       {
        path:'/mySellery',
        element:<MySellery></MySellery>
       },
       {
        path:'/myPayments',
        element:<MyPayments></MyPayments>
       },

       {
        path:'/notification',
        element:<Notification></Notification>
       },
       {
        path:'/clientHistory',
        element:<ClientHistory></ClientHistory>
       },

       {
        path:'/myAdsAccount',
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
        path:'/adsAccountCenter',
        element:<AdsUserAdsAccount></AdsUserAdsAccount>,
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