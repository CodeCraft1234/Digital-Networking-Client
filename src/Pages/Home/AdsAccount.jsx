import { useContext, useState } from 'react';
import MetaAdsAccount from './MetaAdsAccount';
import { SiMeta } from "react-icons/si";
import { SiGoogleads } from "react-icons/si";
import { FaDraftingCompass } from 'react-icons/fa';
import useUserr from '../../Hook/useUser';
import { AuthContext } from '../../Security/AuthProvider';
import { MdTune } from 'react-icons/md';

const AdsAccount = () => {
  const initialTab = localStorage.getItem("activeTabPayment6") || "meta";
  const [activeTab, setActiveTab] = useState(initialTab || 'meta');
  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email);

  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTabPayment6", tab);
  };

  return (
    <div>
      <div className="tab-container flex ">
        {(userr?.role === 'admin' || userr?.role === 'employee') && (
          <>
            <button
              className={`tab-button  ${activeTab === 'meta' ? 'active' : ''}`}
              onClick={() => changeTab('meta')}
            >
              <SiMeta className="icon text-2xl" />
              <span className="  "> Meta Ads </span>
            </button>

            <button
              className={`tab-button ${activeTab === 'google' ? 'active' : ''}`}
              onClick={() => changeTab('google')}
            >
              <SiGoogleads className="icon text-2xl" />
              <span className=""> Google Ads </span>
            </button>
          </>
        )}

        {(userr?.role === 'admin' || userr?.role === 'contributor') && (
          <button
            className={`tab-button ${activeTab === 'contributor' ? 'active' : ''}`}
            onClick={() => changeTab('contributor')}
          >
            <FaDraftingCompass className="icon text-2xl" />
            <span className=""> Contributor Ads </span>
          </button>
        )}
      </div>

      <div className="text-xs text-gray-700 mb-5 lg:hidden">
  {/* Fixed Header */}
  <div className="fixed top-0 left-0 right-0 z-50">
    
    {/* 🔶 Pink Top Bar */}
    <div className="bg-[#f3a62b] text-white flex items-center justify-between px-4 py-3 shadow-md">
      <p></p>
      <h1 className="text-lg text-center font-bold">এডস একাউন্ট</h1>
      <div className="relative">
        <img
          src="https://i.ibb.co.com/20gdNM8h/Digital-Network-White-1.png"
          alt="Icon"
          className="w-6 h-6"
        />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
      </div>
    </div>

    {/* 🔳 White Tab Section */}
    <div className="bg-white shadow-md pt-2">

      {/* 🔘 Tab Buttons */}
      <div className="flex justify-around items-center relative">
        {/* Meta Ads */}
        <button
          onClick={() => changeTab('meta')}
          className={`relative py-3 text-sm font-sans ${activeTab === 'meta' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
        >
          মেটা 
          {activeTab === 'meta' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
          )}
        </button>

        {/* Google Ads */}
        <button
          onClick={() => changeTab('google')}
          className={`relative py-3 text-sm font-sans ${activeTab === 'google' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
        >
          গুগল 
          {activeTab === 'google' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
          )}
        </button>

        {/* Contributor Ads */}
        <button
          onClick={() => changeTab('contributor')}
          className={`relative py-3 text-sm font-sans ${activeTab === 'contributor' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
        >
          কনট্রিবিউটর 
          {activeTab === 'contributor' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
          )}
        </button>
      </div>

      {/* 🔍 Search & Filter Section */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white">

        {/* Search Box Placeholder */}
        <div className="flex items-center gap-2 rounded-full flex-1 px-4 py-2 shadow-sm">
          {/* You can uncomment this and add back functionality */}
          {/* 
          <MdSearch className="text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="TrxID বা নাম্বার দিয়ে খুঁজুন"
            className="bg-transparent outline-none text-sm w-full placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          */}
          {/* ড্র্যাগ স্ক্রলিং সিস্টেম যুক্ত করা হবে */}
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


      <MetaAdsAccount data1={activeTab} />
    </div>
  );
};

export default AdsAccount;
