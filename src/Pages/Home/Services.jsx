import { useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { SiGoogleads, SiMeta } from 'react-icons/si';
import Monitization from './Monitization';

const Services = () => {

    const initialTab = localStorage.getItem("activeTabClientProfile5") || "pageSetup";
    const [activeTab, setActiveTab] = useState(initialTab);

    const changeTab2 = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabClientProfile5", tab); 
    };

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
                        className={getButtonClass('pageSetup')}
                        onClick={() => changeTab2('pageSetup')}
                    >
                        <SiMeta className="w-6 h-6 mr-2" />
                       Page Setup
                    </button>

                    <button
                        className={getButtonClass('pageMonitization')}
                        onClick={() => changeTab2('pageMonitization')}
                    >
                         <SiGoogleads className="w-6 h-6 mr-2" />
                        Page Monitization
                    </button>
                    <button
                        className={getButtonClass('graphicDesign')}
                        onClick={() => changeTab2('graphicDesign')}
                    >
                         <SiGoogleads className="w-6 h-6 mr-2" />
                        Graphic Design
                    </button>
                    <button
                        className={getButtonClass('webDesign')}
                        onClick={() => changeTab2('webDesign')}
                    >
                         <SiGoogleads className="w-6 h-6 mr-2" />
                        Web Design
                    </button>
                </div>
                </div>
           
             <Monitization data={activeTab} />
        </div>
    );
};

export default Services;
