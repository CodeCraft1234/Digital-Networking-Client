import "./profile.css";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import CampaignTable from "../Home/EmployeeClient";
import UserAdAccount from "../../Components/UserAdAccount/MyAdsAccount";
import EmployeerSellery from "../DashboardRoot/EmployeerSellery";
import { Helmet } from "react-helmet-async";
import EmployeeAdminPay from "../Home/EmployeeAdminPay";
import EmployeeClientPay from "../DashboardRoot/EmployeeClientPay";
import EmployeeCampaign from "../Home/EmployeeCampaign";
import EmployeeMyHistory from "../Home/EmployeeMyHistory";
import EmployeeMySummery from "../DashboardRoot/EmployeeMySummery";
import EmployeeClient from "../Home/EmployeeClient";

const EmployeeProfile = () => {
  const userr = useLoaderData();

  const initialTab = localStorage.getItem("activeTabProfile") || "adsAccount";
  const [activeTab, setActiveTab] = useState(initialTab); // Default to 'userAdAccount'

  const getButtonClass = (tab) => 
    `px-3 py-1 lg:px-4 lg:py-2 text-md lg:text-lg rounded-lg transition duration-300 ease-in-out ${
        activeTab === tab 
            ? 'bg-blue-600 text-white shadow-lg transform scale-105'  // Active tab styles
            : 'bg-red-400 text-white hover:bg-gray-300 hover:shadow-md' // Inactive tab styles
    }`;

  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTabProfile", tab); // Store the active tab in local storage
  };


  return (
    <div className="my-5">
      <Helmet>
        <title>Digital Network | Employee Profile</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      
      <div className="">
        <img 
          className="rounded-full border-2 p-2 border-black mx-auto sm:w-20 h-20 lg:w-32 lg:h-32" 
          src={userr?.photo} 
          alt="" 
        />
        <h1 style={{ color: 'var(--text-color2)'}} className="lg:text-4xl mt-4 text-gray sm:text-2xl md:text-3xl font-bold text-center">
          {userr?.name}
        </h1>
      </div>
      


    
     {
      userr.role === 'employee' && 
      <div className="lg:flex lg:justify-center grid grid-cols-3 px-3  mb-3 lg:mb-0  items-center gap-5 mt-5">
      <button 
      className={getButtonClass('adsAccount')}
      onClick={() => changeTab('adsAccount')}
    >
      Ads Account
    </button>
    <p className='font-extrabold hidden lg:visible text-blue text-2xl'>|</p>
  <button 
      className={getButtonClass('client')}
      onClick={() => changeTab('client')}
    >
      Clients
    </button>
    <p className='font-extrabold hidden lg:visible text-blue text-2xl'>|</p>

    <button 
      className={getButtonClass('campaign')}
      onClick={() => changeTab('campaign')}
    >
      Campaigns
    </button>
    <p className='font-extrabold hidden lg:visible text-blue text-2xl'>|</p>
    <button 
      className={getButtonClass('adminPay')}
      onClick={() => changeTab('adminPay')}
    >
      Admin Pay
    </button>
    <p className='font-extrabold hidden lg:visible text-blue text-2xl'>|</p>
    <button 
      className={getButtonClass('clientPay')}
      onClick={() => changeTab('clientPay')}
    >
      Client Pay
    </button>
    <p className='font-extrabold hidden lg:visible text-blue text-2xl'>|</p>

    <button 
      className={getButtonClass('history')}
      onClick={() => changeTab('history')}
    >
      History
    </button>
    <button 
      className={getButtonClass('summery')}
      onClick={() => changeTab('summery')}
    >
      Summery
    </button>
    
    <button 
    className={getButtonClass('sellery')}
    onClick={() => changeTab('sellery')}
  >
    Sellery
  </button>
  </div>
     }
       
      <div className="flex justify-center items-center my-5">
         <button 
          className={getButtonClass('sellery')}
          onClick={() => changeTab('sellery')}
        >
          Sellery
        </button>
      </div>

      {activeTab === 'client' && <EmployeeClient email={userr?.email} />}
      {activeTab === 'campaign' && <EmployeeCampaign email={userr?.email} />}
      {activeTab === 'adsAccount' && <UserAdAccount email={userr?.email} />}
      {activeTab === 'sellery' && <EmployeerSellery />}
      {activeTab === 'adminPay' && <EmployeeAdminPay email={userr?.email} />}
      {activeTab === 'clientPay' && <EmployeeClientPay email={userr?.email} />}
      {activeTab === 'history' && <EmployeeMyHistory email={userr?.email} />}
      {activeTab === 'summery' && <EmployeeMySummery email={userr?.email} />}
    </div>
  );
};

export default EmployeeProfile;
