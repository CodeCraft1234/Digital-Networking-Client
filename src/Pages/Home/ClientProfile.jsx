import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { useLoaderData, useParams } from "react-router-dom";
import useCampaings from "../../Hook/useCampaign";
import "react-toastify/dist/ReactToastify.css";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import PaymentHistry from "./ClientPaymentHistry";
import { Helmet } from "react-helmet-async";
import ClientCampaign from "./ClientMetaAds";
import useMpayment from "../../Hook/UseMpayment";
import ClientHistory from "../DashboardRoot/ClientHistory";
import ClientPageSetup from "./ClientPageSetup";
import ClientGoogleAds from "./ClientGoogleAds";
import useFindClient from "./useFindClient";

const ClientProfile = () => {
  const { user } = useContext(AuthContext);
  const userr = useLoaderData();
  const [MPayment]=useMpayment()
  const param = useParams();
  const [clients]=useClients()
  const [datas,setdatas]=useState()
  const {findClients , refetch}=useFindClient(param?.email)

  useEffect(() => {
  if (param?.email) {
      const realdata = clients.find((m) => m.clientEmail === param?.email);
      setdatas(realdata)
    }
  }, [param?.email, clients]);

  const [campaign] = useCampaings();
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBills, setTotalBills] = useState(0);

  const [users] = useUsers();
  const [ddd, setDdd] = useState(null);

  useEffect(() => {
    if (users && user) {
      const fff = users.find((u) => u.email === user?.email);
      console.log(fff);
      setDdd(fff || {}); 
    }
  }, [users, user]);

  useEffect(() => {
    const filtered = campaign.filter(
      (campaign) => campaign.clientEmail === param?.email
    );
    const totalBill = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
      0
    );
    setTotalBills(totalBill);
  
    const totalSpent = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tSpent),
      0
    );
    setTotalSpent(totalSpent);
  }, [campaign, param?.email]);
  
  const initialTab = localStorage.getItem("activeTabClientProfile") || "clientCampaign";
  const [activeTab, setActiveTab] = useState(initialTab)

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
  
  const [totalPaymeent, setTotalPayment] = useState([]);

  useEffect(() => {
        const realdata = MPayment.filter((m) => m.clientEmail === param?.email);
        const totalBill = realdata.reduce(
          (acc, campaign) => acc + parseFloat(campaign.amount),
          0
        );
        setTotalPayment(totalBill);
  }, [param?.email,MPayment]);



  return (
    <div className="mt-5">
       <Helmet>
       <title>{`${findClients?.clientName} | ${user?.displayName}`}</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div  style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className="mx-5 p-5 rounded-lg">

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

        <div className="flex lg:justify-center rounded-md gap-3 p-2 justify-center items-center px-5 lg:mt-5 mt-5 mx-3">
        <button 
     
     className={getButtonClass('paymentHistory')}
     onClick={() => changeTab('paymentHistory')}
   >
     Payment
   </button>
      <button 
       
          className={getButtonClass('clientCampaign')}
          onClick={() => changeTab('clientCampaign')}
        >
          Meta Ads
        </button>

        <button 
       
       className={getButtonClass('clientgoogleAds')}
       onClick={() => changeTab('clientgoogleAds')}
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
      {activeTab === 'clientCampaign' && <ClientCampaign email={userr?.email} />}
      {activeTab === 'clientPageSetup' && <ClientPageSetup email={userr?.email} />}
      {activeTab === 'clientHistory' && <ClientHistory email={userr?.email} />}
      {activeTab === 'PageMonetization' && <ClientHistory email={userr?.email} />}
      {activeTab === 'clientgoogleAds' && <ClientGoogleAds email={userr?.email} />}
    </div>
  );
};

export default ClientProfile;
