import { useState } from 'react';
import MetaGoogleAds from './MetaGoogleAds';
import { SiGoogleads, SiMeta } from 'react-icons/si';
import TiktokAds from './TiktokAds';
import { MdSearch, MdTune } from 'react-icons/md';

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

      <div className="text-xs text-gray-700 mb-5 lg:hidden">
                <div className="fixed top-0 left-0 right-0 z-50">
                  {/* Orange Top Bar */}
                  <div className="bg-[#f3a62b] text-white flex items-center justify-between px-4 py-3 shadow-md">
                    <p></p>
                    <h1 className="text-lg text-center font-bold">ক্যাম্পেইন</h1>
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
          {/* পেজ সেটআপ */}
          <button
    onClick={() => changeTab2('metaAds')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'metaAds' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    মেটা
    {activeTab === 'metaAds' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* টিকটক অ্যাডস */}
  <button
    onClick={() => changeTab2('tiktokAds')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'tiktokAds' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    টিকটক
    {activeTab === 'tiktokAds' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* গুগল অ্যাডস */}
  <button
    onClick={() => changeTab2('googleAds')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'googleAds' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    গুগল
    {activeTab === 'googleAds' && (
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
              placeholder="TrxID বা নাম্বার দিয়ে অনুসন্ধান করুন"
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

      {/* Render different components based on the activeTab */}
      {activeTab === 'metaAds' && <MetaGoogleAds />}
      {activeTab === 'tiktokAds' && <TiktokAds data={activeTab} />}
      {activeTab === 'googleAds' && <MetaGoogleAds />} {/* Replace with actual Google Ads component */}
    </div>
  );
};

export default AllAds;
