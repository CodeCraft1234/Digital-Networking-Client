import { useContext, useState } from 'react';
import MetaAdsAccount from './MetaAdsAccount';
import { SiMeta } from "react-icons/si";
import { SiGoogleads } from "react-icons/si";
import { FaDraftingCompass } from 'react-icons/fa';
import useUserr from '../../Hook/useUser';
import { AuthContext } from '../../Security/AuthProvider';

const AdsAccount = () => {

    const initialTab = localStorage.getItem("activeTabPayment6") || "meta";
    const [activeTab, setActiveTab] = useState(initialTab || 'meta');
    const { user } = useContext(AuthContext);
    const {userr}=useUserr(user?.email)

    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabPayment6", tab); 
    };

    const getButtonClass = (tab) => 
        `px-3 py-1 lg:px-4 lg:py-2 text-md flex justify-start gap-2 items-center lg:text-md rounded-lg transition duration-300 ease-in-out ${
            activeTab === tab 
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'  // Active tab styles
                : 'bg-red-400 text-white hover:bg-gray-300 hover:shadow-md' // Inactive tab styles
        }`;

    return (
        <div>


            <div className=" rounded-lg" >
            <div className="flex justify-center items-center gap-5 mb-5">
  {/* Show 'Meta' and 'Google' buttons for 'admin' and 'employee' roles */}
  {(userr?.role === 'admin' || userr?.role === 'employee') && (
    <>
      <button
        className={getButtonClass('meta')}
        onClick={() => changeTab('meta')}
      >
        <SiMeta /> Meta Ads Account
      </button>

      <button
        className={getButtonClass('google')}
        onClick={() => changeTab('google')}
      >
        <SiGoogleads /> Google Ads Account
      </button>
    </>
  )}

  {/* Show 'Contributor' button for 'admin' and 'contributor' roles */}
  {(userr?.role === 'admin' || userr?.role === 'contributor') && (
    <button
      className={getButtonClass('contributor')}
      onClick={() => changeTab('contributor')}
    >
      <FaDraftingCompass /> Contributor Ads Account
    </button>
  )}
</div>

            </div>

            <MetaAdsAccount data1={activeTab} />
        </div>
    );
};

export default AdsAccount;
