import { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useUsers from "../../Hook/useUsers";
import useClients from "../../Hook/useClient";
import Swal from 'sweetalert2'
import './BalanceCards.css';
import { AuthContext } from "../../Security/AuthProvider";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import { FaEdit, FaTimes } from "react-icons/fa";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const CampaignTable2 = () => {
  const { user }=useContext(AuthContext)
  const [clients] = useClients();

  const AxiosPublic = UseAxiosPublic();
  const [users,refetch] = useUsers();
  const [ddd, setDdd] = useState(null);

    useEffect(() => {
        if (users && user) {
            const fff = users.find(u => u.email === user?.email);
            console.log(fff);
            setDdd(fff || {}); // Update state with found user or an empty object
        }
    }, [users, user]);


    const [employeePayment] = useEmployeePayment();
    const [payment, setPayment] = useState([]);

    useEffect(() => {
          const realdata = employeePayment.filter(m => m.employeeEmail === user?.email);
          setPayment(realdata);
          console.log(realdata);
    }, [employeePayment, user?.email]);

  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  const [totalRCV, setTotalRCV] = useState(0);
  const [totalbill, setTotalBill] = useState(0);

  console.log(totalSpent, totalBudged, totalRCV, totalbill);

  useEffect(() => {
    const filtered = clients.filter(
      (campaign) => campaign.employeeEmail === user?.email
    );
    console.log(filtered);

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

  }, [clients, user?.email]);

  const [bkashMarcent,setBkashMarcentTotal]=useState(0)
  const [nagadPersonal,setNagadPersonalTotal]=useState(0)
  const [bkashPersonal,setBkashPersonalTotal]=useState(0)
  const [rocketPersonal,setRocketPersonalTotal]=useState(0)
  const [bankTotal,setBankTotal]=useState(0)

  useEffect(()=>{
      AxiosPublic.get(`https://digital-networking-server.vercel.app/Mpayment`)
      .then(res => {
          console.log('sdjkhagjijkhgjkhdsajljkhgdsjkajkjkfjldfgjkgjkgd',res.data);
          const da=res.data
          const filtered=da.filter(f=> f.employeeEmail === user?.email) 

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
  },[user?.email])

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

  const [showForm, setShowForm] = useState(false);
  const [newBalance, setNewBalance] = useState('');

  const handleUpdateTotalBudget = (e) => {
    e.preventDefault();
    const body = { payoneer: newBalance };
    console.log(body);

    axios.put(`https://digital-networking-server.vercel.app/users/payoneer/${ddd?._id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch(); 
        setShowForm(false); // Make sure this function correctly refetches the updated data
      })
  };
  return (

    <div className="my-4 mb-24">  

      <Helmet>
        <title> Dashboard | Digital Network</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>

    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 mb-3  lg:grid-cols-3 gap-8 mt-4 p-4">
   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center  transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
     {/* <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold">Received : ৳</span> {bkashMarcent}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold">Cashout : ৳</span> {bkashMarcent2}</p> */}
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashMarcent - bkashMarcent2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
     {/* <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold">Received : ৳</span> {bkashPersonal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold">Cashout : ৳</span> {bkashPersonal2}</p> */}
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashPersonal - bkashPersonal2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
     {/* <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Received : ৳</span> {nagadPersonal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Cashout : ৳</span> {nagadPersonal2}</p> */}
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {nagadPersonal - nagadPersonal2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
     {/* <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Received : ৳</span> {rocketPersonal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Cashout : ৳</span> {rocketPersonal2}</p> */}
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {rocketPersonal - rocketPersonal2}</p>
   </div>

   <div className="balance-card group items-start justify-center bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
      <div>
        <img className="balance-card-img w-56 h-auto ml-8" src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
        <div className="flex justify-center items-center gap-3 ml-10">
          <span className="balance-card-text text-4xl flex items-center justify-center gap-2">
            <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
              <span className="text-lg lg:text-2xl font-extrabold text-green-600">$</span>{ddd?.payoneer || 0}
            </p>
          </span>
          <button 
            className="text-black text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
            onClick={() => setShowForm(true)}
          >
            <FaEdit />
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 shadow-lg relative">
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowForm(false)}
            >
              <FaTimes size={20} />
            </button>
            <form onSubmit={handleUpdateTotalBudget} className="mt-4">
              <div className="mb-4">
                <input
                  type="number"
                  name="tBudged"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                  placeholder="Enter new balance"
                  required
                />
              </div>
              <button type="submit" className="bg-green-600 px-3 py-2 text-white rounded-lg w-full">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>

   {/* <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
   <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700">Total Bill: <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalbill}</p>

     <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700 ">Total Received: <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalRCV}</p>
     <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700">Total Due: <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalbill - totalRCV}</p>

   </div> */}


   {/* <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">

     <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700 ">Total Received: <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalRCV}</p>
     <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700">Total Cashout: <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalPayment}</p>

     <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700">Total Due: <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalRCV - totalPayment}</p>
    
   </div> */}

  
  
   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
     {/* <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Received : ৳</span> {bankTotal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Cashout : ৳</span> {bankTotal2}</p> */}
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal - bankTotal2}</p>
   </div>

  
     </div>
     <ToastContainer />
    </div>
  );
};
export default CampaignTable2;
