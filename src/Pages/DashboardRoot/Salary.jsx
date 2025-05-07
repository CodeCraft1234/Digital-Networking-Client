import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import MarketerSalary from './MarketerSalary';
import DevGraphicSalary from './DevGraphicsSalary';
import MonthlySalary from './MonthlySelary';
import DeveloperSalary from './DeveloperSellery';
import { MdSearch, MdTune } from 'react-icons/md';

const Salary = () => {

    const { user } = useContext(AuthContext);
    const { userr } = useUserr(user?.email);

    const initialTab = localStorage.getItem("activeTabP66") || "Digital Marketer";
    const [activeTab, setActiveTab] = useState(initialTab);

    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabP66", tab); // Store the active tab in local storage
    };

    return (
        <div>
            <Helmet>
                <title>{activeTab} | Digital Network</title>
                <link rel="canonical" href="https://www.example.com/" />
            </Helmet>

            <div className='hidden lg:block'>

            <div className="flex  justify-center items-center gap-5 mb-5">
                {/* Tab Buttons */}
                <button
                    className={`tab-button ${activeTab === 'Digital Marketer' ? 'active' : ''}`}
                    onClick={() => changeTab('Digital Marketer')}
                >
                    Digital Marketer
                </button>
                <button
                    className={`tab-button ${activeTab === 'Monthly Salary' ? 'active' : ''}`}
                    onClick={() => changeTab('Monthly Salary')}
                >
                    Monthly Salary
                </button>

                {/* Admin-only tab for Graphic & Web Designer */}
                {userr?.role === 'admin' && (
                    <button
                        className={`tab-button ${activeTab === 'Web Designer' ? 'active' : ''}`}
                        onClick={() => changeTab('Web Designer')}
                    >
                        Web Designer
                    </button>
                )}
                {userr?.role === 'admin' && (
                    <button
                        className={`tab-button ${activeTab === 'Graphic Designer' ? 'active' : ''}`}
                        onClick={() => changeTab('Graphic Designer')}
                    >
                        Graphic Designer
                    </button>
                )}
            </div>

            </div>

            <div className="text-xs text-gray-700 mb-5 lg:hidden">
  <div className="fixed top-0 left-0 right-0 z-50">
    {/* Orange Top Bar */}
    <div className="bg-[#f3a62b] text-white flex items-center justify-between px-4 py-3 shadow-md">
      <p></p>
      <h1 className="text-lg text-center font-bold">বেতন তথ্য</h1>
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
        {/* ডিজিটাল মার্কেটার */}
        <button
          onClick={() => changeTab('Digital Marketer')}
          className={`relative py-3 text-sm font-sans ${activeTab === 'Digital Marketer' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
        >
          মার্কেটার
          {activeTab === 'Digital Marketer' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
          )}
        </button>

        {/* ওয়েব ডিজাইনার */}
        <button
          onClick={() => changeTab('Web Designer')}
          className={`relative py-3 text-sm font-sans ${activeTab === 'Web Designer' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
        >
          ওয়েব 
          {activeTab === 'Web Designer' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
          )}
        </button>

        {/* গ্রাফিক ডিজাইনার */}
        <button
          onClick={() => changeTab('Graphic Designer')}
          className={`relative py-3 text-sm font-sans ${activeTab === 'Graphic Designer' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
        >
          গ্রাফিক 
          {activeTab === 'Graphic Designer' && (
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




            {/* Render content based on the selected tab */}
            {activeTab === 'Graphic Designer' && <DevGraphicSalary />}
            {activeTab === 'Web Designer' && <DeveloperSalary />}
            {activeTab === 'Digital Marketer' && <MonthlySalary />}
            {activeTab === 'Monthly Salary' && <MarketerSalary />}
        </div>
    );
};

export default Salary;
