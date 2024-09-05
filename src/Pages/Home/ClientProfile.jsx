import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { useLoaderData, useParams } from "react-router-dom";
import useCampaings from "../../Hook/useCampaign";
import "react-toastify/dist/ReactToastify.css";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import PaymentHistry from "./ClientPaymentHistry";
import { Helmet } from "react-helmet-async";
import ClientCampaign from "./ClientCampaign";
import useMpayment from "../../Hook/UseMpayment";

const ClientProfile = () => {
  const { user } = useContext(AuthContext);
  const userr = useLoaderData();
  const param = useParams();
  const [clients]=useClients()
  const [datas,setdatas]=useState()
  const [MPayment]=useMpayment()

  useEffect(() => {
  if (param?.email) {
      const realdata = clients.find((m) => m.clientEmail === param?.email);
      setdatas(realdata)
    }
  }, [param?.email, clients]);

  const [campaign] = useCampaings();
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [totalPaymeent, setTotalPayment] = useState([]);
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
    `px-1 py-2 rounded ${activeTab === tab ? ' text-blue-700 font-bold' : ' text-black font-md'}`;

  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTabClientProfile", tab); // Store the active tab in local storage
  };

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
       <title>{`User Profile | ${user?.displayName}`}</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="">
        <img 
          className="rounded-full border-2 p-2 border-black mx-auto w-20 h-20 lg:w-32 lg:h-32" 
          src={ddd?.photo} 
          alt="" 
        />
        <h1 className="lg:text-4xl mt-4 text-black sm:text-2xl md:text-3xl font-bold text-center">
          {datas?.clientName}
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-3 lg:gap-5 justify-around p-5">
        <div className="px-5 py-10 rounded-2xl  bg-[#91a33a] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total Spent</h2>
          <p className="lg:text-4xl text-xl font-bold mt-2"> $ {totalSpent.toFixed(2)}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total Bill</h2>
          <p className="lg:text-4xl text-xl font-bold mt-2">
             <span className="lg:text-4xl text-xl font-extrabold">৳</span> {totalBills.toFixed(2)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total Paid</h2>
          <p className="lg:text-4xl text-xl font-bold mt-2"> <span className="lg:text-4xl text-xl font-extrabold">৳</span> {parseInt(totalPaymeent).toFixed(2)}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#ce1a38] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total <span>
  {((totalBills - totalPaymeent).toFixed(2))  >= 0 ? 'Due' : 'Advance'}
</span>
</h2>
          <p className="lg:text-4xl text-xl font-bold mt-2">
          <span className="lg:text-4xl text-xl font-extrabold">৳</span> {Math.abs((totalBills - totalPaymeent).toFixed(2))}
          </p>
        </div>
      </div>



      

      <div className="flex justify-center items-center gap-1 lg:mt-5 mt-0 mx-5">
      <button 
          className={getButtonClass('clientCampaign')}
          onClick={() => changeTab('clientCampaign')}
        >
          Campaign
        </button>
        <p className='font-extrabold text-blue text-2xl'>|</p>
      <button 
          className={getButtonClass('paymentHistory')}
          onClick={() => changeTab('paymentHistory')}
        >
          Payment
        </button>
      </div>

      {activeTab === 'paymentHistory' && <PaymentHistry email={userr?.email} />}
      {activeTab === 'clientCampaign' && <ClientCampaign email={userr?.email} />}
    </div>
  );
};

export default ClientProfile;
