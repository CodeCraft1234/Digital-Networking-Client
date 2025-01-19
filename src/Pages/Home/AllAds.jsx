import { useState} from 'react';
import { Helmet } from 'react-helmet-async';
import MetaGoogleAds from './MetaGoogleAds';
import { SiGoogle, SiGoogleads, SiMeta } from 'react-icons/si';

const AllAds = () => {

    const initialTab = localStorage.getItem("activeTabClientProfile") || "metaAds";
    const [activeTab, setActiveTab] = useState(initialTab);

    // Update the activeTab in state and localStorage
    const changeTab2 = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabClientProfile", tab); 
    };

    // Button styles based on activeTab
    const getButtonClass = (tab) => 
        `px-3 py-1 lg:px-4 flex justify-center items-center lg:py-2 text-md lg:text-lg rounded-lg transition duration-300 ease-in-out ${
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

            <div className="px-2 mx-5 rounded-lg">
                <div className="flex justify-center items-center gap-5 mb-5">
                    <button
                        className={getButtonClass('metaAds')}
                        onClick={() => changeTab2('metaAds')}
                    >
                        <SiMeta className="w-6 h-6 mr-2" />
                       Meta Ads
                    </button>

                    <button
                        className={getButtonClass('googleAds')}
                        onClick={() => changeTab2('googleAds')}
                    >
                         <SiGoogleads className="w-6 h-6 mr-2" />
                        Google Ads
                    </button>
                </div>
            </div>

            {/* Render different components based on the activeTab */}
            {activeTab === 'metaAds' && <MetaGoogleAds />}
            {activeTab === 'googleAds' && <MetaGoogleAds />} {/* Replace with actual Google Ads component */}
        </div>
    );
};

export default AllAds;
