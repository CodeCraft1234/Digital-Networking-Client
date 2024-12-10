import { useState } from "react";
import AdminPayments from "../DashboardRoot/AdminPayments";
import ClientPayments from "../DashboardRoot/ClientPayments";


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

      <div  className="flex lg:justify-center gap-3 rounded-md p-2 justify-center items-center   mt-3 mx-5">


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