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
import useClients from "../../Hook/useClient";
import useEmployeePayment from "../../Hook/useEmployeePayment";

const Profile = () => {
  const [users] = useUsers(); 
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});
  const userr = useLoaderData();
  const AxiosPublic = UseAxiosPublic();
  const [data, setData] = useState([]);
  
  // State to control which component to show
  const [activeTab, setActiveTab] = useState('adsAccount'); // Default to 'userAdAccount'

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


  const [clients, refetch] = useClients();
  const [employeePayment] = useEmployeePayment();
  console.log(employeePayment)
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [ddd, setDdd] = useState(null);
    useEffect(() => {
        if (users && userr.email) {
            const fff = users.find(u => u.email === userr.email);
            console.log(fff);
            setDdd(fff || {}); // Update state with found user or an empty object
        }
    }, [users, userr.email]);

    const [payment, setPayment] = useState([]);
    const [totalPayment, setTotalPayment] = useState([]);

    useEffect(() => {
          const realdata = employeePayment.filter(m => m.employeeEmail === userr.email);
          setPayment(realdata);
          console.log(realdata);
          const totalBill = realdata.reduce((acc, campaign) => acc + parseFloat(campaign.payAmount), 0);
          setTotalPayment(totalBill);
    }, [employeePayment, userr.email]);

  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  const [totalRCV, setTotalRCV] = useState(0);
  const [totalbill, setTotalBill] = useState(0);

  useEffect(() => {
    const filtered = clients.filter(
      (campaign) => campaign.employeeEmail === userr.email
    );

    const totalRcv = filtered.reduce((acc, campaign) => {
      const payment = parseFloat(campaign.tPayment);
      return acc + (isNaN(payment) ? 0 : payment);
    }, 0);
    setTotalRCV(totalRcv);

    const tspent = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tSpent),
      0
    );
    setTotalSpent(tspent);

    const total = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tBudged),
      0
    );
    setTotalBudged(total);

    const totalBill = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tBill),
      0
    );
    setTotalBill(totalBill);

    setFilteredCampaigns(filtered);
  }, [clients, userr.email]);

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
  },[userr?.email])

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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredItems = filteredCampaigns.filter((item) =>
    item.clientPhone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;

    const totalDue = totalbill - totalRCV;
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
      

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6   lg:grid-cols-6 gap-5 mt-5 px-5 ">
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
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold text-green-600">$ </span> {totalSpent.toFixed(2)}</p>
     </span>

   </div>
 </div>

 
 <div className="balance-card bg-white rounded-2xl shadow-xl p-5  text-center transition-transform transform hover:scale-105 border-0">
   <img className="balance-card-img" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
   <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal - bankTotal2}</p>
 </div>


</div>

      <div className="flex justify-center items-center gap-5 mt-5">
      <button 
          className={getButtonClass('adsAccount')}
          onClick={() => setActiveTab('adsAccount')}
        >
          Ads Account
        </button>
      <button 
          className={getButtonClass('client')}
          onClick={() => setActiveTab('client')}
        >
          Client Table
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
