import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SiGoogleads, SiMeta } from 'react-icons/si';
import Monitization from './Monitization';

const Services = () => {
  const initialTab = localStorage.getItem('activeTabClientProfile5') || 'pageSetup';
  const [activeTab, setActiveTab] = useState(initialTab);

  const changeTab2 = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTabClientProfile5', tab);
  };

  return (
    <div>
      <Helmet>
        <title>{activeTab} | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

     
        <div className="tab-container">
          <button
            className={`tab-button ${activeTab === 'pageSetup' ? 'active' : ''}`}
            onClick={() => changeTab2('pageSetup')}
          >
            <SiMeta className="icon" />
            Page Setup
          </button>

          <button
            className={`tab-button ${activeTab === 'pageMonitization' ? 'active' : ''}`}
            onClick={() => changeTab2('pageMonitization')}
          >
            <SiGoogleads className="icon" />
            Page Monitization
          </button>

          <button
            className={`tab-button ${activeTab === 'graphicDesign' ? 'active' : ''}`}
            onClick={() => changeTab2('graphicDesign')}
          >
            <SiGoogleads className="icon" />
            Graphic Design
          </button>

          <button
            className={`tab-button ${activeTab === 'webDesign' ? 'active' : ''}`}
            onClick={() => changeTab2('webDesign')}
          >
            <SiGoogleads className="icon" />
            Web Design
          </button>
        </div>
    

      <Monitization data={activeTab} />
    </div>
  );
};

export default Services;
