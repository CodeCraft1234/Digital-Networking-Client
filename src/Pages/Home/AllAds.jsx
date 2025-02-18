import { useState } from 'react';
import MetaGoogleAds from './MetaGoogleAds';
import { SiGoogleads, SiMeta } from 'react-icons/si';
import TiktokAds from './TiktokAds';

const AllAds = () => {
  const initialTab = localStorage.getItem("activeTabClientProfile7") || "metaAds";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update the activeTab in state and localStorage
  const changeTab2 = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTabClientProfile7", tab); 
  };

  return (
    <div>
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'metaAds' ? 'active' : ''}`}
          onClick={() => changeTab2('metaAds')}
        >
          <SiMeta className="icon" />
          Meta Ads
        </button>

        <button
          className={`tab-button ${activeTab === 'tiktokAds' ? 'active' : ''}`}
          onClick={() => changeTab2('tiktokAds')}
        >
          <SiGoogleads className="icon" />
          Tiktok Ads
        </button>

        <button
          className={`tab-button ${activeTab === 'googleAds' ? 'active' : ''}`}
          onClick={() => changeTab2('googleAds')}
        >
          <SiGoogleads className="icon" />
          Google Ads
        </button>
      </div>

      {/* Render different components based on the activeTab */}
      {activeTab === 'metaAds' && <MetaGoogleAds />}
      {activeTab === 'tiktokAds' && <TiktokAds data={activeTab} />}
      {activeTab === 'googleAds' && <MetaGoogleAds />} {/* Replace with actual Google Ads component */}
    </div>
  );
};

export default AllAds;
