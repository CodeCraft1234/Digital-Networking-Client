import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SiMeta } from "react-icons/si";
import { SiGoogleads } from "react-icons/si";
import MetaMonthlySpend from './MetaMonthlySpend';
import GoogleMonthlySpend from './GoogleMonthlySpend';

const MonthlySpend = () => {

    const initialTab = localStorage.getItem("activeTabPayment") || "employeerPay";
    const [activeTab, setActiveTab] = useState(initialTab);

    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabPayment", tab); // Store the active tab in local storage
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
                <title>Monthly Spend | Digital Network</title>
                <link rel="canonical" href="https://www.example.com/" />
            </Helmet>

            <div className=" rounded-lg" >
                <div className="f-center mt-2 mb-5">
                    <button
                        className={getButtonClass('metaSpend')}
                        onClick={() => changeTab('metaSpend')}
                    >
                      <SiMeta />  Meta Spend
                    </button>

                    <button
                        className={getButtonClass('googleSpend')}
                        onClick={() => changeTab('googleSpend')}
                    >
                    <SiGoogleads /> Google Spend
                    </button>
                </div>
            </div>
             <MetaMonthlySpend data={activeTab}/>
        </div>
    );
};

export default MonthlySpend;
