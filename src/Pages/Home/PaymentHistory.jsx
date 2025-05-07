import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SalaryPayments from './SalaryPayment';
import ClientPayments from '../DashboardRoot/ClientPayments';
import AdminPayments from '../DashboardRoot/AdminPayments';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import ContributorPayments from '../DashboardRoot/ContributorPayments';

// Lucide icons
import { Users, CreditCard, DollarSign, BadgeDollarSign } from 'lucide-react';
import { MdSearch, MdTune } from 'react-icons/md';

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
    <div className="relative">
      <Helmet>
        <title>{activeTab} | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      {/* Tabs */}
      <div className="px-2 mx-5 mb-5">
        <div className="hidden md:flex flex-wrap justify-center items-center gap-4">

          {userr?.role === 'admin' && (
            <button
              className={`tab-button ${activeTab === 'Digital Marketer Pay' ? 'active' : ''}`}
              onClick={() => changeTab('Digital Marketer Pay')}
            >
              <Users className="w-4 h-4 mr-1" /> Marketer Pay
            </button>
          )}

          <button
            className={`tab-button ${activeTab === 'Clients Pay' ? 'active' : ''}`}
            onClick={() => changeTab('Clients Pay')}
          >
            <CreditCard className="w-4 h-4 mr-1" /> Client Pay
          </button>

          {userr?.role === 'admin' && (
            <button
              className={`tab-button ${activeTab === 'Contributor Pay' ? 'active' : ''}`}
              onClick={() => changeTab('Contributor Pay')}
            >
              <BadgeDollarSign className="w-4 h-4 mr-1" /> Contributor Pay
            </button>
          )}

          <button
            className={`tab-button ${activeTab === 'Salary Pay' ? 'active' : ''}`}
            onClick={() => changeTab('Salary Pay')}
          >
            <DollarSign className="w-4 h-4 mr-1" /> Salary Pay
          </button>

        </div>
      </div>

      {/* Mobile Fixed Tabs */}
      {/* <div className="fixed top-0 left-0 right-0 z-50  text-blackrounded-b-2xl backdrop-blur-md border-b md:hidden flex justify-around items-center py-2 shadow-md">
  {userr?.role === 'admin' && (
    <button
      className={`flex flex-col items-center text-xs font-sans ${activeTab === 'Digital Marketer Pay' ? 'font-extrabold' : 'font-thin'}`}
      onClick={() => changeTab('Digital Marketer Pay')}
    >
      Marketer
    </button>
  )}

  <button
    className={`flex flex-col items-center text-xs font-sans ${activeTab === 'Clients Pay' ? 'font-extrabold' : 'font-thin'}`}
    onClick={() => changeTab('Clients Pay')}
  >

    Clients
  </button>

  {userr?.role === 'admin' && (
    <button
      className={`flex flex-col items-center text-xs font-sans ${activeTab === 'Contributor Pay' ? 'font-extrabold' : 'font-thin'}`}
      onClick={() => changeTab('Contributor Pay')}
    >

      Contributor
    </button>
  )}

  <button
    className={`flex flex-col items-center text-xs font-sans ${activeTab === 'Salary Pay' ? 'font-extrabold' : 'font-thin'}`}
    onClick={() => changeTab('Salary Pay')}
  >

    Salary
  </button>
</div> */}


<div className="text-xs text-gray-700 mb-5 lg:hidden">


<div className="fixed top-0 left-0 right-0 z-50">
  {/* Pink Top Bar */}
  <div className="bg-[#f3a62b]  text-white flex items-center justify-between px-4 py-3 shadow-md">
    <p></p>
    <h1 className="text-lg text-center font-bold">পেমেন্টস</h1>
    <div className="relative">
      <img
        src="https://i.ibb.co.com/20gdNM8h/Digital-Network-White-1.png"
        alt="Icon"
        className="w-6 h-6"
      />
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
    </div>
  </div>

  {/* White Tabs + Search Section */}
  <div className="bg-white shadow-md pt-2">
    {/* Tabs */}

    <div className="flex justify-around items-center relative">

  {/* পেমেন্ট */}
  <button
    onClick={() => changeTab('Clients Pay')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'Clients Pay' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    পেমেন্ট
    {activeTab === 'Clients Pay' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* কন্ট্রিবিউটর */}
  <button
    onClick={() => changeTab('Contributor Pay')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'Contributor Pay' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    কন্ট্রিবিউটর
    {activeTab === 'Contributor Pay' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* বেতন */}
  <button
    onClick={() => changeTab('Salary Pay')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'Salary Pay' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    বেতন
    {activeTab === 'Salary Pay' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>
</div>



    {/* Search and Filter Section */}
    <div className="flex items-center gap-3 px-4 py-3 bg-white">
  {/* Search Box */}
  <div className="flex items-center gap-2 bg-gray-100 rounded-full flex-1 px-4 py-2 shadow-sm">
    <MdSearch className="text-gray-400 text-xl" />
    <input
      type="text"
      placeholder="TrxID বা নাম্বার দিয়ে খুঁজুন"
      className="bg-transparent outline-none text-sm w-full placeholder-gray-400"
      value={'searchTerm'}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {/* Filter Button */}
  <button className="flex items-center gap-2 text-pink-600 border border-pink-600 hover:bg-pink-600 hover:text-white transition-all rounded-full px-4 py-2 text-sm shadow-sm">
    <MdTune className="text-lg" />
    ফিল্টার
  </button>
</div>
  </div>
</div>


    </div>



      {/* Content Section */}
      <div className=" md:pt-0"> {/* Padding top on mobile for fixed tab */}
        {activeTab === 'Contributor Pay' && <ContributorPayments />}
        {activeTab === 'Digital Marketer Pay' && <AdminPayments />}
        {activeTab === 'Clients Pay' && <ClientPayments />}
        {activeTab === 'Salary Pay' && <SalaryPayments />}
      </div>
    </div>
  );
};

export default PaymentHistory;
