import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { Link, useLoaderData, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import useUsers from "../../Hook/useUsers";
import PaymentHistry from "./ClientPaymentHistry";
import { Helmet } from "react-helmet-async";
import ClientHistory from "../DashboardRoot/ClientHistory";
import ClientPageSetup from "./ClientPageSetup";
import useFindClient from "./useFindClient";
import ClientMetaAds from "./ClientMetaAds";
import { FaPhoneAlt, FaRegCopy } from "react-icons/fa";
import useAllEmployee from "../../Hook/useAllEmployee";
import { LuCopyCheck } from "react-icons/lu";
import SummaryCard from "./SummeryCard";
import ClientTiktokAds from "./ClientTiktokAds";
import { MdContentCopy, MdSearch, MdTune } from "react-icons/md";

const ClientProfile = () => {
  const { user } = useContext(AuthContext);
  const userr = useLoaderData();
  const param = useParams();
  const { findClients } = useFindClient(param?.email);
  const [users] = useUsers();
  const [copiedBankId, setCopiedBankId] = useState(false);
  const [allEmployees] = useAllEmployee();

  const initialTab = localStorage.getItem("activeTabClientProfile") || "clientCampaign";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (users && user) {
      const fff = users.find((u) => u.email === user?.email);

    }
  }, [users, user]);

  const getButtonClass = (tab) =>
    `px-3 py-1 lg:px-4 lg:py-2 text-md lg:text-lg rounded-lg transition duration-300 ease-in-out ${
      activeTab === tab
        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
        : 'bg-red-400 text-white hover:bg-gray-300 hover:shadow-md'
    }`;

  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTabClientProfile", tab);
  };

  const handleCopy = () => {
    if (param?.email) {
      navigator.clipboard.writeText(param.email)
        .then(() => setCopiedBankId(true))
        .catch((error) => console.error("Failed to copy:", error));
    }
  };

  const totalSpent = findClients?.campaings?.reduce((acc, campaign) => acc + parseFloat(campaign?.tSpent || 0), 0).toFixed(2) || 0;

  const totalBill = (findClients?.campaings?.reduce((acc, campaign) => acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0), 0) || 0) +
    (findClients?.pageService?.reduce((acc, service) => acc + parseFloat(service?.totalBill || 0), 0) || 0);

  const totalPaid = findClients?.payments?.reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(0);

  const tabs = [
    { id: 'paymentHistory', label: 'Payment', component: <PaymentHistry email={userr?.email} /> },
    { id: 'metaAds', label: 'Meta Ads', component: <ClientMetaAds data1={activeTab} email={userr?.email} /> },
    { id: 'tiktokAds', label: 'Tiktok Ads', component: <ClientTiktokAds data1={activeTab} email={userr?.email} /> },
    { id: 'googleAds', label: 'Google Ads', component: <ClientMetaAds data1={activeTab} email={userr?.email} /> },
    { id: 'clientPageSetup', label: 'Service', component: <ClientPageSetup email={userr?.email} /> },
    { id: 'clientHistory', label: 'Summary', component: <ClientHistory email={userr?.email} /> },
  ];

  console.log(findClients);

  return (
    <div className="">
      <Helmet>
        <title>{`${findClients?.clientName} | ${user?.displayName}`}</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="rounded-t-lg lg:block hidden">
        <div className="bg-gradient-to-r from-[#092d77] via-[#0d4691] to-[#0c236b] text-white px-6 py-10 md:px-10 rounded-lg space-y-8 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-6">
            <img
              src={findClients?.image || allEmployees.find(f => f.email === findClients.employeeEmail)?.photo}
              alt={`Profile picture of ${findClients?.clientName}`}
              className="w-40 h-40 md:w-[400px] object-cover md:h-[350px] rounded-2xl shadow-2xl"
            />
            <div className="text-start w-full">
              <div className="justify-between items-center flex">
              <h1 className="text-2xl md:text-3xl font-bold uppercase text-yellow-300">{findClients?.clientName}</h1>
              <Link to={`/client-profile-update/${findClients?.id}`} className="btn">
                Update Info
              </Link>
              </div>
              <h3 className="text-md md:text-lg font-bold">{findClients?.companyName}</h3>
              <p className="mt-2 text-sm md:text-lg flex items-center gap-2"><FaPhoneAlt /> +88{findClients?.clientPhone}</p>
              <p className="mt-2 text-sm md:text-lg flex items-center gap-2">
                {findClients?.id}
                <button className={`py-2 px-4 rounded-lg text-white hover:bg-green-600`} onClick={handleCopy}>
                  {copiedBankId ? <LuCopyCheck /> : <FaRegCopy />}
                </button>
              </p>
              <div className="grid grid-cols-2 mt-5 gap-5 rounded-lg lg:grid-cols-4 text-black">
                <SummaryCard title="Total Spend" value={totalSpent} />
                <SummaryCard title="Total Bill" value={totalBill.toFixed(0)} />
                <SummaryCard title="Total Paid" value={totalPaid} />
                
                <SummaryCard 
  title={`Total ${(totalBill || 0) - (totalPaid || 0) >= 0 ? "Due" : "Advance"}`} 
  value={Math.abs((totalBill || 0) - (totalPaid || 0)).toFixed(0)} 
/>


              </div>
              <div className="flex lg:justify-start mt-5 rounded-md gap-3 p-2 justify-start items-center">
                {tabs.map(tab => (
                  <button key={tab.id} className={getButtonClass(tab.id)} onClick={() => changeTab(tab.id)}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>



      <div>
        <div className="text-xs text-gray-700 mb-5 lg:hidden">
        
        
        <div className="fixed top-0 left-0 right-0 z-50">
          {/* Pink Top Bar */}
          <div className="bg-[#f3a62b] text-white flex items-center justify-between px-4 py-4 shadow-md rounded-lg">
  {/* Profile Image - Left Side */}
  <img
    src={allEmployees.find(f => f.email === findClients?.employeeEmail)?.photo}
    alt={`Profile of ${findClients?.clientName}`}
    className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-md mr-4"
  />

  {/* Info - Right Side */}
  <div className="flex-1">
    <h1 className="text-lg font-bold uppercase text-yellow-100">
      {findClients?.clientName}
    </h1>
    <h3 className="text-sm font-semibold">{findClients?.companyName}</h3>

    {/* Phone Number */}
    <p className="mt-1 text-sm flex items-center gap-1">
      <FaPhoneAlt className="text-white" /> +88{findClients?.clientPhone}
    </p>

    {/* ID Number + Copy Button */}
    <div className="mt-1 text-xs flex items-center gap-2">
      <span>ID: {findClients?._id}</span>
      <button
        onClick={() => {
          navigator.clipboard.writeText(findClients?._id);
          alert("ID copied!");
        }}
        className="text-white hover:text-yellow-300"
        title="Copy ID"
      >
        <MdContentCopy className="text-sm" />
      </button>
    </div>
  </div>
</div>
        
          {/* White Tabs + Search Section */}
          <div className="bg-white shadow-md pt-2">
            {/* Tabs */}
        
            <div className="flex justify-around items-center relative">
  
  {/* পেমেন্ট হিস্টোরি */}
  <button
    onClick={() => changeTab('paymentHistory')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'paymentHistory' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    পেমেন্ট
    {activeTab === 'paymentHistory' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* মেটা বিজ্ঞাপন */}
  <button
    onClick={() => changeTab('metaAds')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'metaAds' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    মেটা
    {activeTab === 'metaAds' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* টিকটক বিজ্ঞাপন */}
  <button
    onClick={() => changeTab('tiktokAds')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'tiktokAds' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    টিকটক
    {activeTab === 'tiktokAds' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* গুগল বিজ্ঞাপন */}
  <button
    onClick={() => changeTab('googleAds')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'googleAds' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    গুগল
    {activeTab === 'googleAds' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

</div>

        
          </div>
        </div>
        
        
            </div>
      </div>

      {tabs.find(tab => tab.id === activeTab)?.component}
    </div>
  );
};

export default ClientProfile;