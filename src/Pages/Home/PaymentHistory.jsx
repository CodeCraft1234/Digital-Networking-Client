import { useContext, useState } from 'react';
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
                <title>{activeTab} | Digital Network</title>
                <link rel="canonical" href="https://www.example.com/" />
            </Helmet>

            <div className="px-2 mx-5   rounded-lg" >
                <div className="flex justify-center items-center gap-5 mb-5">
                    {/* Employeer Pay Button */}
                    <button
                        className={getButtonClass('Digital Marketer Pay')}
                        onClick={() => changeTab('Digital Marketer Pay')}
                    >
                       Digital Marketer Pay
                    </button>

                    {/* Clients Pay Button */}
                    <button
                        className={getButtonClass('Clients Pay')}
                        onClick={() => changeTab('Clients Pay')}
                    >
                        Clients Pay
                    </button>

                    {/* Contributor Pay Button */}
                    {
                        userr?.role === 'admin' &&  <button
                        className={getButtonClass('Contributor Pay')}
                        onClick={() => changeTab('Contributor Pay')}
                    >
                        Contributor Pay
                    </button>
                    }
                   
                    <button
                        className={getButtonClass('Salary Pay')}
                        onClick={() => changeTab('Salary Pay')}
                    >
                        Salary Pay
                    </button>
                </div>
            </div>

            {activeTab === 'Contributor Pay' && <ContributorPayments />}
            {activeTab === 'Digital Marketer Pay' && <AdminPayments />}
            {activeTab === 'Clients Pay' && <ClientPayments />}
            {activeTab === 'Salary Pay' && <SalaryPayments />}
        </div>
    );
};

export default PaymentHistory;
