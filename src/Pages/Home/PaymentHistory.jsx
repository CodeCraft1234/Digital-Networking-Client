import  { useState } from 'react';

import EmployeePayments from './EmployeePayments';
import AllClientsPayments from './AllClientsPayments';
import AllAdsPayments from '../DashboardRoot/AllAdsPayments';
import useEmployeePayment from '../../Hook/useEmployeePayment';
import useAdsPayment from '../../Hook/useAdsPayment';
import useMpayment from '../../Hook/UseMpayment';
import { Helmet } from 'react-helmet-async';

const PaymentHistory = () => {
    const [employeePayment]=useEmployeePayment()
    const [adsPayment]=useAdsPayment()
    const [MPayment] = useMpayment();
    const initialTab = localStorage.getItem("activeTabPayment") || "employeerPay";
    const [activeTab, setActiveTab] = useState(initialTab);
  
    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabPayment", tab); // Store the active tab in local storage
      };

    const getButtonClass = (tab) => 
        `px-1 py-2 rounded ${activeTab === tab ? ' text-blue-700 font-bold' : ' text-black font-md'}`;
    
    return (
        <div>
                  <Helmet>
        <title>Payment History | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
             <div className="flex justify-start items-center gap-1 my-5 mx-5">
      <button 
          className={getButtonClass('employeerPay')}
          onClick={() => changeTab('employeerPay')}
        >
          Employeer Pay ({employeePayment.length})
        </button>
        <p className='font-extrabold text-blue text-2xl'>|</p>
      <button 
          className={getButtonClass('clientsPay')}
          onClick={() => changeTab('clientsPay')}
        >
          Clients Pay ({MPayment.length})
        </button>
        <p className='font-extrabold text-blue text-2xl'>|</p>
        <button 
          className={getButtonClass('contributorPay')}
          onClick={() => changeTab('contributorPay')}
        >
          Contributor Pay ({adsPayment.length})
        </button>

       
      </div>

      {activeTab === 'contributorPay' && <AllAdsPayments></AllAdsPayments>}
      {activeTab === 'employeerPay' && <EmployeePayments></EmployeePayments>}
      {activeTab === 'clientsPay' && <AllClientsPayments></AllClientsPayments>}

        </div>
    );
};

export default PaymentHistory;