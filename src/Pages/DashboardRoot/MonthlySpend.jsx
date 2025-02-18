import { useContext, useState } from 'react';
import { SiMeta } from 'react-icons/si';
import { SiGoogleads } from 'react-icons/si';
import MetaMonthlySpend from './MetaMonthlySpend';
import { FaDraftingCompass } from 'react-icons/fa';
import useUserr from '../../Hook/useUser';
import { AuthContext } from '../../Security/AuthProvider';
import ContributorMonthlySpend from './ContributorMonthlySpend';
import GoogleMonthlySpend from './GoogleMonthlySpend';

const MonthlySpend = () => {
  const initialTab = localStorage.getItem('activeTabPayment') || 'metaSpend';
  const [activeTab, setActiveTab] = useState(initialTab);

  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email);

  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTabPayment', tab);
  };

  return (
    <div className="dashboard-container">
      <div className="rounded-lg">
        <div className="f-center space-x-2 mb-5">
          {/* Render different tab buttons based on user role */}
          {userr?.role === 'admin' && (
            <>
              <button
                className={`tab-button ${activeTab === 'metaSpend' ? 'active' : ''}`}
                onClick={() => changeTab('metaSpend')}
              >
                <SiMeta /> <span className='ml-2'> Meta Spend</span>
              </button>
              <button
                className={`tab-button ${activeTab === 'googleSpend' ? 'active' : ''}`}
                onClick={() => changeTab('googleSpend')}
              >
                <SiGoogleads /> <span className='ml-2'>Google Spend</span> 
              </button>
              <button
                className={`tab-button ${activeTab === 'contributorSpend' ? 'active' : ''}`}
                onClick={() => changeTab('contributorSpend')}
              >
                <FaDraftingCompass /> <span className='ml-2'> Contributor Spend</span> 
              </button>
            </>
          )}

          {userr?.role === 'employee' && (
            <>
              <button
                className={`tab-button ${activeTab === 'metaSpend' ? 'active' : ''}`}
                onClick={() => changeTab('metaSpend')}
              >
                <SiMeta /> Meta Spend
              </button>
              <button
                className={`tab-button ${activeTab === 'googleSpend' ? 'active' : ''}`}
                onClick={() => changeTab('googleSpend')}
              >
                <SiGoogleads /> Google Spend
              </button>
            </>
          )}

          {userr?.role === 'contributor' && (
            <button
              className={`tab-button ${activeTab === 'contributorSpend' ? 'active' : ''}`}
              onClick={() => changeTab('contributorSpend')}
            >
              <FaDraftingCompass /> Contributor Spend
            </button>
          )}
        </div>
      </div>

      {/* Render the selected tab's content */}
      {activeTab === 'contributorSpend' && <ContributorMonthlySpend />}
      {activeTab === 'metaSpend' && <MetaMonthlySpend />}
      {activeTab === 'googleSpend' && <GoogleMonthlySpend />}
    </div>
  );
};

export default MonthlySpend;
