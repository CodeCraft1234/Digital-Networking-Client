import { useState } from 'react';
import EmployeePayments from './EmployeePayments';
import AllClientsPayments from './AllClientsPayments';
import AllAdsPayments from '../DashboardRoot/AllAdsPayments';
import { Helmet } from 'react-helmet-async';
import Sellery from '../DashboardRoot/Salary.jsx';
import DeveloperSellery from '../DashboardRoot/DeveloperSellery';
import DesignersSellery from '../DashboardRoot/DesignerSellery.jsx';

const AllSellery = () => {

    const initialTab = localStorage.getItem("activeTabPaymentd") || "employeerPay";
    const [activeTab, setActiveTab] = useState(initialTab);

    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabPaymentd", tab); // Store the active tab in local storage
    };

    // Dynamic classes for active and inactive buttons
    const getButtonClass = (tab) => 
        `px-3 py-1 lg:px-4 lg:py-2 text-md lg:text-lg rounded-lg transition duration-300 ease-in-out ${
            activeTab === tab 
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'  // Active tab styles
                : 'bg-red-400 text-white hover:bg-gray-300 hover:shadow-md' // Inactive tab styles
        }`;

    return (
        <div>
            <Helmet>
                <title>Payment History | Digital Network</title>
                <link rel="canonical" href="https://www.example.com/" />
            </Helmet>

            <div className="px-2 mx-5   mt-5 rounded-lg" >
                <div className="flex justify-center items-center gap-5 my-5">
                    {/* Employeer Pay Button */}
                    <button
                        className={getButtonClass('marketerSellery')}
                        onClick={() => changeTab('marketerSellery')}
                    >
                        Marketers
                    </button>

                    {/* Clients Pay Button */}
                    <button
                        className={getButtonClass('developerSellery')}
                        onClick={() => changeTab('developerSellery')}
                    >
                        Developers
                    </button>

                    {/* Contributor Pay Button */}
                    <button
                        className={getButtonClass('designerSellery')}
                        onClick={() => changeTab('designerSellery')}
                    >
                        Designers
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'marketerSellery' && <Sellery />}
            {activeTab === 'developerSellery' && <DeveloperSellery />}
            {activeTab === 'designerSellery' && <DesignersSellery/>}
        </div>
    );
};

export default AllSellery;
