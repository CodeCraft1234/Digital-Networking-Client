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
import { MdSearch, MdTune } from 'react-icons/md';

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

        <div className="lg:flex hidden  justify-center items-center gap-5 mb-5">
      
          
          {userr?.role === 'admin' && ( <>
            <button
            className={`tab-button ${activeTab === 'totalSummery' ? 'active' : ''}`}
            onClick={() => changeTab('totalSummery')}
            >
              All
            </button>
            <button
              className={`tab-button ${activeTab === 'employeerPay' ? 'active' : ''}`}
              onClick={() => changeTab('employeerPay')}
            >
              Summery
            </button>

            <button
              className={`tab-button ${activeTab === 'clientSummery' ? 'active' : ''}`}
              onClick={() => changeTab('clientSummery')}
            >
              Client
            </button>
          </>
             
          )}
 

          {userr?.role === 'admin' && (
            <button
              className={`tab-button ${activeTab === 'contributorPay' ? 'active' : ''}`}
              onClick={() => changeTab('contributorPay')}
            >
              Contributor
            </button>
          )}
        </div>

        <div className="text-xs text-gray-700 mb-5 lg:hidden">
        
        
        <div className="fixed top-0 left-0 right-0 z-50">
          {/* Pink Top Bar */}
          <div className="bg-[#f3a62b]  text-white flex items-center justify-between px-4 py-3 shadow-md">
            <p></p>
            <h1 className="text-lg text-center font-bold">সামারি</h1>
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
  {/* মার্কেটার */}
  <button
    onClick={() => changeTab('totalSummery')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'totalSummery' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    মার্কেটার
    {activeTab === 'totalSummery' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* মাসিক পেমেন্ট */}
  <button
    onClick={() => changeTab('employeerPay')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'employeerPay' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
   মাসিক সামারি 
    {activeTab === 'employeerPay' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>


  {/* কন্ট্রিবিউটর */}
  <button
    onClick={() => changeTab('contributorPay')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'contributorPay' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    কন্ট্রিবিউটর
    {activeTab === 'contributorPay' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>
</div>

        
        
        
            {/* Search and Filter Section */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white">
          {/* Search Box */}
          <div className="flex items-center gap-2  rounded-full flex-1 px-4 py-2 shadow-sm">
            {/* <MdSearch className="text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="TrxID বা নাম্বার দিয়ে খুঁজুন"
              className="bg-transparent outline-none text-sm w-full placeholder-gray-400"
              value={'searchTerm'}
              onChange={(e) => setSearchTerm(e.target.value)}
            /> */}



            {/*/////////////////// drag scrolling system will incude ///////////////////*/}
            {/*/////////////////// drag scrolling system will incude ///////////////////*/}
            {/*/////////////////// drag scrolling system will incude ///////////////////*/}
            {/*/////////////////// drag scrolling system will incude ///////////////////*/}
            {/*/////////////////// drag scrolling system will incude ///////////////////*/}




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
