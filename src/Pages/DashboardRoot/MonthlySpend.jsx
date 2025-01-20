import { useContext, useState } from 'react';
import { SiMeta } from "react-icons/si";
import { SiGoogleads } from "react-icons/si";
import MetaMonthlySpend from './MetaMonthlySpend';
import { FaDraftingCompass } from 'react-icons/fa';
import useUserr from '../../Hook/useUser';
import { AuthContext } from '../../Security/AuthProvider';
import ContributorMonthlySpend from './ContributorMonthlySpend';

const MonthlySpend = () => {

    const initialTab = localStorage.getItem("activeTabPayment") || "employeerPay";
    const [activeTab, setActiveTab] = useState(initialTab || 'metaSpend');

    const { user } = useContext(AuthContext);
    const {userr}=useUserr(user?.email)

    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabPayment", tab); // Store the active tab in local storage
    };

    const getButtonClass = (tab) => 
        `px-3 py-1  lg:px-4 lg:py-2 text-md flex justify-start gap-2 items-center lg:text-lg rounded-lg transition duration-300 ease-in-out ${
            activeTab === tab 
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'  // Active tab styles
                : 'bg-red-400 text-white hover:bg-gray-300 hover:shadow-md' // Inactive tab styles
        }`;

    return (
        <div className="dashboard-container">
        <div className="rounded-lg">
            <div className="f-center space-x-2 mb-5">
                {userr?.role === 'admin' && (
                    <>
                        <button
                            className={getButtonClass('metaSpend')}
                            onClick={() => changeTab('metaSpend')}
                        >
                            <SiMeta /> Meta Spend
                        </button>
                        <button
                            className={getButtonClass('googleSpend')}
                            onClick={() => changeTab('googleSpend')}
                        >
                            <SiGoogleads /> Google Spend
                        </button>
                        <button
                            className={getButtonClass('pageSpend') }
                            onClick={() => changeTab('pageSpend')}
                        >
                            <FaDraftingCompass  /> Page Spend
                        </button>
                        <button
                            className={getButtonClass('contributorSpend') }
                            onClick={() => changeTab('contributorSpend')}
                        >
                            <FaDraftingCompass  /> Contributor Spend
                        </button>
                     
                    </>
                )}

                {userr?.role === 'employee' && (
                    <>
                        <button
                            className={getButtonClass('metaSpend')}
                            onClick={() => changeTab('metaSpend')}
                        >
                            <SiMeta /> Meta Spend
                        </button>
                        <button
                            className={getButtonClass('googleSpend')}
                            onClick={() => changeTab('googleSpend')}
                        >
                            <SiGoogleads /> Google Spend
                        </button>
                        <button
                            className={getButtonClass('pageSpend') }
                            onClick={() => changeTab('pageSpend')}
                        >
                            <FaDraftingCompass  /> Page Spend
                        </button>
                    </>
                )}

                {userr?.role === 'contributor' && (
                    <button
                        className={getButtonClass('contributorSpend')}
                        onClick={() => changeTab('contributorSpend')}
                    >
                        <FaDraftingCompass /> Contributor Spend
                    </button>
                )}
            </div>
        </div>

        {/* Conditional Rendering for Components */}
        {activeTab === 'contributorSpend' && <ContributorMonthlySpend data={activeTab} />}
        {(activeTab === 'metaSpend' || activeTab === 'googleSpend' || activeTab === 'pageSpend') && (
            <MetaMonthlySpend data={activeTab} />
        )}
    </div>
    );
};

export default MonthlySpend;
