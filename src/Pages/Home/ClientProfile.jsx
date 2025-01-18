import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { useLoaderData, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import useUsers from "../../Hook/useUsers";
import PaymentHistry from "./ClientPaymentHistry";
import { Helmet } from "react-helmet-async";
import ClientHistory from "../DashboardRoot/ClientHistory";
import ClientPageSetup from "./ClientPageSetup";
import useFindClient from "./useFindClient";
import ClientMetaAds from "./ClientMetaAds";
import { FaRegCopy } from "react-icons/fa";

const ClientProfile = () => {
  const { user } = useContext(AuthContext);
  const userr = useLoaderData();
  const param = useParams();
  const {findClients}=useFindClient(param?.email)

  const [users] = useUsers();
  const [ddd, setDdd] = useState(null);

  useEffect(() => {
    if (users && user) {
      const fff = users.find((u) => u.email === user?.email);
      console.log(fff);
      setDdd(fff || {}); 
    }
  }, [users, user]);


  const initialTab = localStorage.getItem("activeTabClientProfile") || "clientCampaign";
  const [activeTab, setActiveTab] = useState(initialTab)
  console.log(activeTab);

  const getButtonClass = (tab) => 
    `px-3 py-1 lg:px-4 lg:py-2 text-md lg:text-lg rounded-lg transition duration-300 ease-in-out ${
        activeTab === tab 
            ? 'bg-blue-600 text-white shadow-lg transform scale-105'  // Active tab styles
            : 'bg-red-400 text-white hover:bg-gray-300 hover:shadow-md' // Inactive tab styles
    }`;

  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTabClientProfile", tab); // Store the active tab in local storage
  };
  
  const [copiedBankId, setCopiedBankId] = useState(false); 
  const handleCopy = () => {
    if (param?.email) {
      navigator.clipboard.writeText(param.email).then(() => {
        setCopiedBankId(true)
      }).catch((error) => {
        console.error("Failed to copy:", error);
      });
    }
  };

  return (
    <div className="">
       <Helmet>
       <title>{`${findClients?.clientName} | ${user?.displayName}`}</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div   className=" rounded-lg">

        <img 
          className="rounded-full border-2 p-2 border-black mx-auto w-20 h-20 lg:w-32 lg:h-32" 
          src={ddd?.photo} 
          alt="" 
        />
        <h1 style={{ color: 'var(--text-color2)'}} className="lg:text-2xl mt-4 uppercase sm:text-2xl md:text-3xl font-bold text-center">
          {findClients?.clientName} 
        </h1>
        <h1 style={{ color: 'var(--text-color2)'}} className="lg:text-2xl mt-4  sm:text-2xl md:text-3xl font-bold text-center">
        {findClients?.clientPhone}
        </h1>
        <div className="text-center">
      <button
        className={` py-2 px-4 mt-5 bg-green-400 rounded-lg text-black hover:bg-green-600`}
        onClick={handleCopy}
      >
        {copiedBankId === true ? 'Copied' : 'Copy Client Id'}
      </button>
    </div>

      

        <div className="flex lg:justify-center rounded-md gap-3 p-2 justify-center items-center px-5 lg:mt-5 mt-5 mx-3">
        <button 
     
     className={getButtonClass('paymentHistory')}
     onClick={() => changeTab('paymentHistory')}
   >
     Payment
   </button>
      <button 
       
          className={getButtonClass('metaAds')}
          onClick={() => changeTab('metaAds')}
        >
          Meta Ads
        </button>

        <button 
       
       className={getButtonClass('googleAds')}
       onClick={() => changeTab('googleAds')}
     >
       Google Ads
     </button>
     
        
     

        <button 
     
     className={getButtonClass('clientPageSetup')}
     onClick={() => changeTab('clientPageSetup')}
   >
     Page Setup 
   </button>
      <button 
     
          className={getButtonClass('clientHistory')}
          onClick={() => changeTab('clientHistory')}
        >
          Summery
        </button>
    
      
      </div>
      </div>



  
      {activeTab === 'paymentHistory' && <PaymentHistry email={userr?.email} />}
      {activeTab === 'clientPageSetup' && <ClientPageSetup email={userr?.email} />}
      {activeTab === 'clientHistory' && <ClientHistory email={userr?.email} />}
      {activeTab === 'PageMonetization' && <ClientHistory email={userr?.email} />}
      {activeTab === 'metaAds' && <ClientMetaAds data1={activeTab} email={userr?.email} />}
      {activeTab === 'googleAds' && <ClientMetaAds data1={activeTab} email={userr?.email} />}
    </div>
  );
};

export default ClientProfile;
