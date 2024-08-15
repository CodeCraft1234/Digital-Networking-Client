import "./profile.css";
import { useLoaderData } from "react-router-dom";
import useUsers from "../../Hook/useUsers";
import { useContext, useEffect, useState } from "react";
import CampaignTable from "../Home/CampaignTable";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { AuthContext } from "../../Security/AuthProvider";
import UserAdAccount from "../../Components/UserAdAccount/UserAdAccount";
import EmployeerSellery from "../DashboardRoot/EmployeerSellery";
import { Helmet } from "react-helmet-async";
import EmployeeAdminPay from "../Home/EmployeeAdminPay";
import EmployeeClientPay from "../DashboardRoot/EmployeeClientPay";
import EmployeeCampaign from "../Home/EmployeeCampaign";

const Profile = () => {
  const [users] = useUsers(); 
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});
  const userr = useLoaderData();
  const AxiosPublic = UseAxiosPublic();
  const [data, setData] = useState([]);
  
  // State to control which component to show
  const [activeTab, setActiveTab] = useState('client'); // Default to 'userAdAccount'

  useEffect(() => {
    const filtered = users.find(e => e.email === user?.email);
    setCurrentUser(filtered || {});
  }, [users, user]);

  useEffect(() => {
    AxiosPublic.get(`https://digital-networking-server.vercel.app/users/${userr.email}`)
      .then(res => {
        setData(res.data);
      });
  }, [userr.email, AxiosPublic]);

  // Utility function to get button class
  
  const getButtonClass = (tab) => 
    `px-4 py-2 rounded ${activeTab === tab ? 'bg-[#05a0db] text-white font-bold' : 'bg-[#f89320] text-black font-bold'}`;

  return (
    <div className="my-5">
      <Helmet>
        <title>Digital Network | Employee Profile</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      
      <div className="">
        <img 
          className="rounded-full border-2 p-2 border-black mx-auto sm:w-24 h-24 lg:w-52 lg:h-52" 
          src={userr?.photo} 
          alt="" 
        />
        <h1 className="lg:text-4xl mt-4 text-black sm:text-2xl md:text-3xl font-bold text-center">
          {userr?.name}
        </h1>
      </div>
      

      <div className="flex justify-center items-center gap-5 mt-5">
      <button 
          className={getButtonClass('client')}
          onClick={() => setActiveTab('client')}
        >
          Client Table
        </button>
      <button 
          className={getButtonClass('adsAccount')}
          onClick={() => setActiveTab('adsAccount')}
        >
          Ads Account
        </button>

        <button 
          className={getButtonClass('campaign')}
          onClick={() => setActiveTab('campaign')}
        >
          Campaign Table
        </button>

        <button 
          className={getButtonClass('adminPay')}
          onClick={() => setActiveTab('adminPay')}
        >
          Admin Pay
        </button>
        <button 
          className={getButtonClass('clientPay')}
          onClick={() => setActiveTab('clientPay')}
        >
          Client Pay
        </button>
        <button 
          className={getButtonClass('sellery')}
          onClick={() => setActiveTab('sellery')}
        >
          Sellery
        </button>
      </div>

      {activeTab === 'client' && <CampaignTable email={userr?.email} />}
      {activeTab === 'campaign' && <EmployeeCampaign email={userr?.email} />}
      {activeTab === 'adsAccount' && <UserAdAccount email={userr?.email} />}
      {activeTab === 'sellery' && <EmployeerSellery />}
      {activeTab === 'adminPay' && <EmployeeAdminPay email={userr?.email} />}
      {activeTab === 'clientPay' && <EmployeeClientPay email={userr?.email} />}
    </div>
  );
};

export default Profile;
