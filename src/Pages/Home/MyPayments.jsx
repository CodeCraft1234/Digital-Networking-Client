import { useState } from "react";
import AdminPayments from "../DashboardRoot/AdminPayments";
import ClientPayments from "../DashboardRoot/ClientPayments";
import { Helmet } from "react-helmet-async";


const MyPayments = () => {
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
        <title>My Payment | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div  className="flex lg:justify-center gap-3 rounded-md  justify-center items-center ">


                   <button
                        className={getButtonClass('adminPay')}
                        onClick={() => changeTab('adminPay')}
                    >
                        Admin Pay
                    </button>

                    {/* Clients Pay Button */}
                    <button
                        className={getButtonClass('clientsPay')}
                        onClick={() => changeTab('clientsPay')}
                    >
                        Clients Pay 
                    </button>

       </div>

 {activeTab === 'adminPay' && <AdminPayments></AdminPayments>}
 {activeTab === 'clientsPay' && <ClientPayments></ClientPayments>}

   </div>

    );
};

export default MyPayments;