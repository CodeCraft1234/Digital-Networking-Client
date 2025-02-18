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
          <button
            className={`tab-button ${activeTab === 'employeerPay' ? 'active' : ''}`}
            onClick={() => changeTab('employeerPay')}
          >
            Monthly Summery
          </button>

          <button
            className={`tab-button ${activeTab === 'monthlyCost' ? 'active' : ''}`}
            onClick={() => changeTab('monthlyCost')}
          >
            Monthly Cost
          </button>
          <button
            className={`tab-button ${activeTab === 'monthlyTarget' ? 'active' : ''}`}
            onClick={() => changeTab('monthlyTarget')}
          >
            Monthly Target
          </button>
          <button
            className={`tab-button ${activeTab === 'totalSummery' ? 'active' : ''}`}
            onClick={() => changeTab('totalSummery')}
          >
            EM. Summery
          </button>
          <button
            className={`tab-button ${activeTab === 'yearlySummery' ? 'active' : ''}`}
            onClick={() => changeTab('yearlySummery')}
          >
            Yearly Summery
          </button>

          {userr?.role === 'admin' && (
            <button
              className={`tab-button ${activeTab === 'contributorPay' ? 'active' : ''}`}
              onClick={() => changeTab('contributorPay')}
            >
              Contributor Summery
            </button>
          )}
        </div>

        {/* Component rendering based on active tab */}
        {activeTab === 'contributorPay' && <ContributorSummery />}
        {activeTab === 'monthlyCost' && <MonthlyCast />}
        {activeTab === 'monthlyTarget' && <MonthlyTarget />}
        {activeTab === 'totalSummery' && <TotalSummery />}
        {activeTab === 'yearlySummery' && <YearlySummery />}
        {activeTab === 'employeerPay' && <MarketerSummery />}
      </div>
    </div>
  );
};

export default Summery;
