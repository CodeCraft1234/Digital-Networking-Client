import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import MarketerSummery from './MarketerSummery';
import ContributorSummery from './ContributorSummery';

const Summery = () => {

    const { user } = useContext(AuthContext);
    const {userr}=useUserr(user?.email)

    const initialTab = localStorage.getItem("activeTabP6") || "employeerPay";
    const [activeTab, setActiveTab] = useState(initialTab);

    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabP6", tab); 
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

            {
                userr?.role !== 'admin' ? <MarketerSummery></MarketerSummery> :
                <div className="   rounded-lg" >
                <div className="flex justify-center items-center gap-5 mb-5">
                    {/* Employeer Pay Button */}
                    <button
                        className={getButtonClass('employeerPay')}
                        onClick={() => changeTab('employeerPay')}
                    >
                        Marketer Summery
                    </button>

                    {/* Clients Pay Button */}


                    {/* Contributor Pay Button */}
                    {
                        userr?.role === 'admin' &&  <button
                        className={getButtonClass('contributorPay')}
                        onClick={() => changeTab('contributorPay')}
                    >
                        Contributor Summery
                    </button>
                    }
                   

                </div>
                {activeTab === 'contributorPay' && <ContributorSummery></ContributorSummery>}
                {activeTab === 'employeerPay' && <MarketerSummery></MarketerSummery>}
            </div>
            }

           

          

        </div>
    );
};

export default Summery;
