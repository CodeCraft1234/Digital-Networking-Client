import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import MarketerSummery from './MarketerSummery';
import ContributorSummery from './ContributorSummery';
import MonthlyCast from './MonthlyCast';
import MonthlyTarget from './MonthlyTarget';
import TotalSummery from './TotalSummery';
import YearlySummery from './YearlySummery';
import ClientSummery from './ClientSummery';

const Summery = () => {
  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email);

  const initialTab = localStorage.getItem('activeTabP6') || 'employeerPay';
  const [activeTab, setActiveTab] = useState(initialTab);

  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTabP6', tab);
  };

  return (
    <div>
      <Helmet>
        <title>Payment | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="rounded-lg">
        <div className="flex justify-center items-center gap-5 mb-5">
      
          
          {userr?.role === 'admin' && ( <>
            <button
            className={`tab-button ${activeTab === 'totalSummery' ? 'active' : ''}`}
            onClick={() => changeTab('totalSummery')}
            >
              Summery
            </button>
            <button
              className={`tab-button ${activeTab === 'employeerPay' ? 'active' : ''}`}
              onClick={() => changeTab('employeerPay')}
            >
              Monthly Summery
            </button>

            <button
              className={`tab-button ${activeTab === 'clientSummery' ? 'active' : ''}`}
              onClick={() => changeTab('clientSummery')}
            >
              Client Summery
            </button>
          </>
             
          )}
 

          {userr?.role === 'admin' && (
            <button
              className={`tab-button ${activeTab === 'contributorPay' ? 'active' : ''}`}
              onClick={() => changeTab('contributorPay')}
            >
              Contributor Summery
            </button>
          )}
        </div>

        {userr?.role === 'admin' ? (
  <>
    {activeTab === 'contributorPay' && <ContributorSummery />}
    {activeTab === 'monthlyTarget' && <MonthlyTarget />}
    {activeTab === 'totalSummery' && <TotalSummery />}
    {activeTab === 'clientSummery' && <ClientSummery />}
    {activeTab === 'yearlySummery' && <YearlySummery />}
    {activeTab === 'employeerPay' && <MarketerSummery />}
  </>
) : (
  <MarketerSummery />
)}

       
      
      </div>
    </div>
  );
};

export default Summery;
