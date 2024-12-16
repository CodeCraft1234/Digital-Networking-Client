import { useContext, useState } from 'react';
import AllAdsPayments from '../DashboardRoot/ContributorPayments';
import { Helmet } from 'react-helmet-async';
import SalaryPayments from './SalaryPayment';
import ClientPayments from '../DashboardRoot/ClientPayments';
import AdminPayments from '../DashboardRoot/AdminPayments';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import ContributorPayments from '../DashboardRoot/ContributorPayments';

const PaymentHistory = () => {

    const { user } = useContext(AuthContext);
    const {userr}=useUserr(user?.email)

    const initialTab = localStorage.getItem("activeTabP") || "employeerPay";
    const [activeTab, setActiveTab] = useState(initialTab);

    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabP", tab); 
    };

    const getButtonClass = (tab) => 
        `px-3 py-1 lg:px-4 lg:py-2 text-md lg:text-lg rounded-lg transition duration-300 ease-in-out ${
            activeTab === tab 
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'  // Active tab styles
                : 'bg-red-400 text-white hover:bg-gray-300 hover:shadow-md' // Inactive tab styles
        }`;

    return (
        <div>
            <Helmet>
                <title>Payment | Digital Network</title>
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
                    {
                        userr?.role === 'admin' &&  <button
                        className={getButtonClass('contributorPay')}
                        onClick={() => changeTab('contributorPay')}
                    >
                        Contributor Pay
                    </button>
                    }
                   
                    <button
                        className={getButtonClass('salaryPay')}
                        onClick={() => changeTab('salaryPay')}
                    >
                        Salary Pay
                    </button>
                </div>
            </div>

            {activeTab === 'contributorPay' && <ContributorPayments />}
            {activeTab === 'employeerPay' && <AdminPayments />}
            {activeTab === 'clientsPay' && <ClientPayments />}
            {activeTab === 'salaryPay' && <SalaryPayments />}
        </div>
    );
};

export default PaymentHistory;
