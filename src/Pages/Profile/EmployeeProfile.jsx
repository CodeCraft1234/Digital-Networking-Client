import "./profile.css";
import { useLoaderData } from "react-router-dom";
import useUsers from "../../Hook/useUsers";
import { useEffect, useState } from "react";
import CampaignTable from "../Home/CampaignTable";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import UserAdAccount from "../../Components/UserAdAccount/MyAdsAccount";
import EmployeerSellery from "../DashboardRoot/EmployeerSellery";
import { Helmet } from "react-helmet-async";
import EmployeeAdminPay from "../Home/EmployeeAdminPay";
import EmployeeClientPay from "../DashboardRoot/EmployeeClientPay";
import EmployeeCampaign from "../Home/EmployeeCampaign";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import EmployeeMyHistory from "../Home/EmployeeMyHistory";
import EmployeeMySummery from "../DashboardRoot/EmployeeMySummery";

const EmployeeProfile = () => {
  const [users] = useUsers(); 
  const userr = useLoaderData();
  const AxiosPublic = UseAxiosPublic();


  const initialTab = localStorage.getItem("activeTabProfile") || "adsAccount";
  const [activeTab, setActiveTab] = useState(initialTab); // Default to 'userAdAccount'


  const getButtonClass = (tab) => 
    `px-1 py-2 rounded ${activeTab === tab ? ' text-blue-700 font-bold' : ' text-black font-md'}`;


  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTabProfile", tab); // Store the active tab in local storage
  };


  const [employeePayment] = useEmployeePayment();

    const [ddd, setDdd] = useState(null);
    useEffect(() => {
        if (users && userr.email) {
            const fff = users.find(u => u.email === userr.email);
            console.log(fff);
            setDdd(fff || {}); // Update state with found user or an empty object
        }
    }, [users, userr.email]);

    const [payment, setPayment] = useState([]);

    useEffect(() => {
          const realdata = employeePayment.filter(m => m.employeeEmail === userr.email);
          setPayment(realdata);
    }, [employeePayment, userr.email]);

  const [bkashMarcent,setBkashMarcentTotal]=useState(0)
  const [nagadPersonal,setNagadPersonalTotal]=useState(0)
  const [bkashPersonal,setBkashPersonalTotal]=useState(0)
  const [rocketPersonal,setRocketPersonalTotal]=useState(0)
  const [bankTotal,setBankTotal]=useState(0)

  useEffect(()=>{
      AxiosPublic.get(`https://digital-networking-server.vercel.app/Mpayment`)
      .then(res => {
          const da=res.data
          const filtered=da.filter(f=> f.employeeEmail === userr?.email) 

          const filter2=filtered.filter(d=>d.paymentMethod === 'bkashMarchent')
          const total = filter2.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setBkashMarcentTotal(total)

          const filter3=filtered.filter(d=>d.paymentMethod === 'nagadPersonal')
          const total3 = filter3.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setNagadPersonalTotal(total3)

          const filter4=filtered.filter(d=>d.paymentMethod === 'bkashPersonal')
          const total4 = filter4.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setBkashPersonalTotal(total4)

          const filter5=filtered.filter(d=>d.paymentMethod === 'rocketPersonal')
          const total5 = filter5.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setRocketPersonalTotal(total5)

          const filter6=filtered.filter(d=>d.paymentMethod === 'bank')
          const total6 = filter6.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setBankTotal(total6)
      })
  },[userr?.email,])

  const [bkashMarcent2,setBkashMarcentTotal2]=useState(0)
  const [nagadPersonal2,setNagadPersonalTotal2]=useState(0)
  const [bkashPersonal2,setBkashPersonalTotal2]=useState(0)
  const [rocketPersonal2,setRocketPersonalTotal2]=useState(0)
  const [bankTotal2,setBankTotal2]=useState(0)

  useEffect(()=>{
          const filter2=payment.filter(d=>d.paymentMethod === 'bkashMarchent')
          const total = filter2.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setBkashMarcentTotal2(total)

          const filter3=payment.filter(d=>d.paymentMethod === 'nagadPersonal')
          const total3 = filter3.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setNagadPersonalTotal2(total3)

          const filter4=payment.filter(d=>d.paymentMethod === 'bkashPersonal')
          const total4 = filter4.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setBkashPersonalTotal2(total4)

          const filter5=payment.filter(d=>d.paymentMethod === 'rocketPersonal')
          const total5 = filter5.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setRocketPersonalTotal2(total5)
          const filter6=payment.filter(d=>d.paymentMethod === 'bank')
          const total6 = filter6.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setBankTotal2(total6)
  },[payment])

  return (
    <div className="my-5">
      <Helmet>
        <title>Digital Network | Employee Profile</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      
      <div className="">
        <img 
          className="rounded-full border-2 p-2 border-black mx-auto sm:w-20 h-20 lg:w-32 lg:h-32" 
          src={userr?.photo} 
          alt="" 
        />
        <h1 className="lg:text-4xl mt-4 text-black sm:text-2xl md:text-3xl font-bold text-center">
          {userr?.name}
        </h1>
      </div>
      

      {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6   lg:grid-cols-6 gap-3 lg:gap-5 mt-5 px-5 ">
 <div className="balance-card bg-white rounded-2xl shadow-xl p-5 text-center  transition-transform transform hover:scale-105 border-0">
   <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
   <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashMarcent - bkashMarcent2}</p>
 </div>
 <div className="balance-card bg-white rounded-2xl shadow-xl p-5 text-center transition-transform transform hover:scale-105 border-0">
   <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
   <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashPersonal - bkashPersonal2}</p>
 </div>
 <div className="balance-card bg-white rounded-2xl shadow-xl p-5 text-center transition-transform transform hover:scale-105 border-0">
   <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />

   <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {nagadPersonal - nagadPersonal2}</p>
 </div>
 <div className="balance-card bg-white rounded-2xl shadow-xl p-5 text-center transition-transform transform hover:scale-105 border-0">
   <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />

   <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {rocketPersonal - rocketPersonal2}</p>
 </div>

 <div className="balance-card bg-white rounded-2xl shadow-xl p-5 text-center transition-transform transform hover:scale-105 border-0">
   <div>
     <img className="balance-card-img w-56 h-auto mt-5 " src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
     <span className="balance-card-text text-4xl flex items-center justify-center gap-2">
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> </p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold text-green-600">$ </span> {ddd?.payoneer || 0}</p>
     </span>

   </div>
 </div>

 
 <div className="balance-card bg-white rounded-2xl shadow-xl p-5  text-center transition-transform transform hover:scale-105 border-0">
   <img className="balance-card-img" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
   <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal - bankTotal2}</p>
 </div>


</div> */}

      <div className="lg:flex lg:justify-center grid grid-cols-3 px-3  mb-3 lg:mb-0  items-center gap-5 mt-5">
      <button 
          className={getButtonClass('adsAccount')}
          onClick={() => changeTab('adsAccount')}
        >
          Ads Account
        </button>
        <p className='font-extrabold hidden lg:visible text-blue text-2xl'>|</p>
      <button 
          className={getButtonClass('client')}
          onClick={() => changeTab('client')}
        >
          Clients
        </button>
        <p className='font-extrabold hidden lg:visible text-blue text-2xl'>|</p>

        <button 
          className={getButtonClass('campaign')}
          onClick={() => changeTab('campaign')}
        >
          Campaigns
        </button>
        <p className='font-extrabold hidden lg:visible text-blue text-2xl'>|</p>
        <button 
          className={getButtonClass('adminPay')}
          onClick={() => changeTab('adminPay')}
        >
          Admin Pay
        </button>
        <p className='font-extrabold hidden lg:visible text-blue text-2xl'>|</p>
        <button 
          className={getButtonClass('clientPay')}
          onClick={() => changeTab('clientPay')}
        >
          Client Pay
        </button>
        <p className='font-extrabold hidden lg:visible text-blue text-2xl'>|</p>
    
        <button 
          className={getButtonClass('history')}
          onClick={() => changeTab('history')}
        >
          History
        </button>
        <button 
          className={getButtonClass('summery')}
          onClick={() => changeTab('summery')}
        >
          Summery
        </button>
        <button 
          className={getButtonClass('sellery')}
          onClick={() => changeTab('sellery')}
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
      {activeTab === 'history' && <EmployeeMyHistory email={userr?.email} />}
      {activeTab === 'summery' && <EmployeeMySummery email={userr?.email} />}
    </div>
  );
};

export default EmployeeProfile;
