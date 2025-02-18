import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SalaryPayments from './SalaryPayment';
import ClientPayments from '../DashboardRoot/ClientPayments';
import AdminPayments from '../DashboardRoot/AdminPayments';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import ContributorPayments from '../DashboardRoot/ContributorPayments';

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email);

  const initialTab = localStorage.getItem('activeTabP') || 'Digital Marketer Pay';
  const [activeTab, setActiveTab] = useState(initialTab);

  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTabP', tab);
  };

  return (
    <div>
      <Helmet>
        <title>{activeTab} | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="px-2 mx-5 rounded-lg">
        <div className="flex justify-center items-center gap-5 mb-5">
          {/* Employeer Pay Button */}
          <button
            className={`tab-button ${activeTab === 'Digital Marketer Pay' ? 'active' : ''}`}
            onClick={() => changeTab('Digital Marketer Pay')}
          >
            Digital Marketer Pay
          </button>

          {/* Clients Pay Button */}
          <button
            className={`tab-button ${activeTab === 'Clients Pay' ? 'active' : ''}`}
            onClick={() => changeTab('Clients Pay')}
          >
            Clients Pay
          </button>

          {/* Contributor Pay Button */}
          {userr?.role === 'admin' && (
            <button
              className={`tab-button ${activeTab === 'Contributor Pay' ? 'active' : ''}`}
              onClick={() => changeTab('Contributor Pay')}
            >
              Contributor Pay
            </button>
          )}

          {/* Salary Pay Button */}
          <button
            className={`tab-button ${activeTab === 'Salary Pay' ? 'active' : ''}`}
            onClick={() => changeTab('Salary Pay')}
          >
            Salary Pay
          </button>
        </div>
      </div>

      {activeTab === 'Contributor Pay' && <ContributorPayments />}
      {activeTab === 'Digital Marketer Pay' && <AdminPayments />}
      {activeTab === 'Clients Pay' && <ClientPayments />}
      {activeTab === 'Salary Pay' && <SalaryPayments />}
    </div>
  );
};

export default PaymentHistory;
