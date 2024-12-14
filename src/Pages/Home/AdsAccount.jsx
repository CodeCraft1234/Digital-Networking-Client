import { useState } from 'react';
import AllAdsPayments from '../DashboardRoot/AllAdsPayments';
import { Helmet } from 'react-helmet-async';
import SalaryPayments from './SalaryPayment';
import ClientPayments from '../DashboardRoot/ClientPayments';
import AdminPayments from '../DashboardRoot/AdminPayments';
import MetaAdsAccount from './MetaAdsAccount';
import GoogleAdsAccount from './GoogleAdsAccount';
import { SiMeta } from "react-icons/si";
import { SiGoogleads } from "react-icons/si";

const AdsAccount = () => {

    const initialTab = localStorage.getItem("activeTabPayment6") || "employeerPay";
    const [activeTab, setActiveTab] = useState(initialTab);

    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabPayment6", tab); 
    };

    const getButtonClass = (tab) => 
        `px-3 py-1 lg:px-4 lg:py-2 text-md flex justify-start gap-2 items-center lg:text-lg rounded-lg transition duration-300 ease-in-out ${
            activeTab === tab 
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'  // Active tab styles
                : 'bg-red-400 text-white hover:bg-gray-300 hover:shadow-md' // Inactive tab styles
        }`;

    return (
        <div>
            <Helmet>
                <title>Ads Account | Digital Network</title>
                <link rel="canonical" href="https://www.example.com/" />
            </Helmet>

            <div className=" rounded-lg" >
                <div className="flex justify-center items-center gap-5 my-5">
                    {/* Employeer Pay Button */}
                    <button
                        className={getButtonClass('MetaAdsAccount')}
                        onClick={() => changeTab('MetaAdsAccount')}
                    >
                      <SiMeta />  Meta AdsAccount
                    </button>

                    {/* Clients Pay Button */}
                    <button
                        className={getButtonClass('GoogleAdsAccount')}
                        onClick={() => changeTab('GoogleAdsAccount')}
                    >
                    <SiGoogleads /> Google AdsAccount
                    </button>

                </div>
            </div>

            {activeTab === 'MetaAdsAccount' && <MetaAdsAccount />}
            {activeTab === 'GoogleAdsAccount' && <GoogleAdsAccount />}
        </div>
    );
};

export default AdsAccount;
