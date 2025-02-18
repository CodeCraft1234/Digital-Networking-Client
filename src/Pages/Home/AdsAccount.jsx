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
  const { userr } = useUserr(user?.email);

  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTabPayment6", tab);
  };

  return (
    <div>
      <div className="tab-container flex ">
        {(userr?.role === 'admin' || userr?.role === 'employee') && (
          <>
            <button
              className={`tab-button mr-2 ${activeTab === 'meta' ? 'active' : ''}`}
              onClick={() => changeTab('meta')}
            >
              <SiMeta className="icon text-2xl" />
              <span className="  "> Meta Ads Account</span>
            </button>

            <button
              className={`tab-button ${activeTab === 'google' ? 'active' : ''}`}
              onClick={() => changeTab('google')}
            >
              <SiGoogleads className="icon text-2xl" />
              <span className=""> Google Ads Account</span>
            </button>
          </>
        )}

        {(userr?.role === 'admin' || userr?.role === 'contributor') && (
          <button
            className={`tab-button ${activeTab === 'contributor' ? 'active' : ''}`}
            onClick={() => changeTab('contributor')}
          >
            <FaDraftingCompass className="icon text-2xl" />
            <span className=""> Contributor Ads Account</span>
          </button>
        )}
      </div>

      <MetaAdsAccount data1={activeTab} />
    </div>
  );
};

export default AdsAccount;
