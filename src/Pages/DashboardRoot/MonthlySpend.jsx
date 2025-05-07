import { useContext, useState } from 'react';
import { SiMeta } from 'react-icons/si';
import { SiGoogleads } from 'react-icons/si';
import MetaMonthlySpend from './MetaMonthlySpend';
import { FaDraftingCompass } from 'react-icons/fa';
import useUserr from '../../Hook/useUser';
import { AuthContext } from '../../Security/AuthProvider';
import ContributorMonthlySpend from './ContributorMonthlySpend';
import GoogleMonthlySpend from './GoogleMonthlySpend';
import { MdSearch, MdTune } from 'react-icons/md';

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


      <div className="rounded-lg hidden lg:block">
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
                <SiMeta /> <span className='ml-2'> Meta Spend</span>
              </button>
              <button
                className={`tab-button ${activeTab === 'googleSpend' ? 'active' : ''}`}
                onClick={() => changeTab('googleSpend')}
              >
                 <SiGoogleads /> <span className='ml-2'>Google Spend</span> 
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

      <div className="text-xs text-gray-700 mb-5 lg:hidden">
              
              
              <div className="fixed top-0 left-0 right-0 z-50">
                {/* Pink Top Bar */}
                <div className="bg-[#f3a62b]  text-white flex items-center justify-between px-4 py-3 shadow-md">
                  <p></p>
                  <h1 className="text-lg text-center font-bold">মাসিক স্পিন্ড</h1>
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
  {/* মেটা স্পেন্ড (Meta Spend) */}
  <button
    onClick={() => changeTab('metaSpend')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'metaSpend' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    মেটা ব্যয়
    {activeTab === 'metaSpend' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* গুগল স্পেন্ড (Google Spend) */}
  <button
    onClick={() => changeTab('googleSpend')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'googleSpend' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    গুগল ব্যয়
    {activeTab === 'googleSpend' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* কন্ট্রিবিউটর */}
  <button
    onClick={() => changeTab('contributorSpend')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'contributorSpend' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    কন্ট্রিবিউটর
    {activeTab === 'contributorSpend' && (
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

      {/* Render the selected tab's content */}
      {activeTab === 'contributorSpend' && <ContributorMonthlySpend />}
      {activeTab === 'metaSpend' && <MetaMonthlySpend />}
      {activeTab === 'googleSpend' && <GoogleMonthlySpend />}
    </div>
  );
};

export default MonthlySpend;
