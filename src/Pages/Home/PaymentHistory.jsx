import { useState } from 'react';
import EmployeePayments from './EmployeePayments';
import AllClientsPayments from './AllClientsPayments';
import AllAdsPayments from '../DashboardRoot/AllAdsPayments';
import { Helmet } from 'react-helmet-async';
import SalaryPayments from './SalaryPayment';
import ClientPayments from '../DashboardRoot/ClientPayments';
import AdminPayments from '../DashboardRoot/AdminPayments';

const PaymentHistory = () => {

    const initialTab = localStorage.getItem("activeTabPayment") || "employeerPay";
    const [activeTab, setActiveTab] = useState(initialTab);

    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabPayment", tab); // Store the active tab in local storage
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
                <title>Payments History | Digital Network</title>
                <link rel="canonical" href="https://www.example.com/" />
            </Helmet>

            <div className="px-2 mx-5   mt-5 rounded-lg" >
                <div className="flex justify-center items-center gap-5 my-5">
                    {/* Employeer Pay Button */}
                    <button
                        className={getButtonClass('employeerPay')}
                        onClick={() => changeTab('employeerPay')}
                    >
                        Employer Pay
                    </button>

                    {/* Clients Pay Button */}
                    <button
                        className={getButtonClass('clientsPay')}
                        onClick={() => changeTab('clientsPay')}
                    >
                        Clients Pay
                    </button>

                    {/* Contributor Pay Button */}
                    <button
                        className={getButtonClass('contributorPay')}
                        onClick={() => changeTab('contributorPay')}
                    >
                        Contributor Pay
                    </button>
                    <button
                        className={getButtonClass('salaryPay')}
                        onClick={() => changeTab('salaryPay')}
                    >
                        Salary Pay
                    </button>
                </div>
            </div>

            {activeTab === 'contributorPay' && <AllAdsPayments />}
            {activeTab === 'employeerPay' && <AdminPayments />}
            {activeTab === 'clientsPay' && <ClientPayments />}
            {activeTab === 'salaryPay' && <SalaryPayments />}
        </div>
    );
};

export default PaymentHistory;
