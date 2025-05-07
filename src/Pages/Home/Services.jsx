import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SiGoogleads, SiMeta } from 'react-icons/si';
import Monitization from './Monitization';
import { MdSearch, MdTune } from 'react-icons/md';

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

     <div className='lg:block hidden'>

     
        <div className="tab-container ">
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
        </div>


         <div className="text-xs text-gray-700 mb-5 lg:hidden">
          <div className="fixed top-0 left-0 right-0 z-50">
            {/* Orange Top Bar */}
            <div className="bg-[#f3a62b] text-white flex items-center justify-between px-4 py-3 shadow-md">
              <p></p>
              <h1 className="text-lg text-center font-bold">সার্ভিস</h1>
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
      onClick={() => changeTab2('pageSetup')}
      className={`relative py-3 text-sm font-sans ${activeTab === 'pageSetup' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
    >
      সেটআপ
      {activeTab === 'pageSetup' && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
      )}
    </button>

    {/* পেজ মনিটাইজেশন */}
    <button
      onClick={() => changeTab2('pageMonitization')}
      className={`relative py-3 text-sm font-sans ${activeTab === 'pageMonitization' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
    >
      মনিটাইজেশন
      {activeTab === 'pageMonitization' && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
      )}
    </button>

    {/* গ্রাফিক ডিজাইন */}
    <button
      onClick={() => changeTab2('graphicDesign')}
      className={`relative py-3 text-sm font-sans ${activeTab === 'graphicDesign' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
    >
      গ্রাফিক 
      {activeTab === 'graphicDesign' && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
      )}
    </button>

    {/* ওয়েব ডিজাইন */}
    <button
      onClick={() => changeTab2('webDesign')}
      className={`relative py-3 text-sm font-sans ${activeTab === 'webDesign' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
    >
      ওয়েব 
      {activeTab === 'webDesign' && (
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

      <Monitization data={activeTab} />
    </div>
  );
};

export default Services;
