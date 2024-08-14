import { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useUsers from "../../Hook/useUsers";
import useClients from "../../Hook/useClient";
import {  Link } from "react-router-dom";
import './BalanceCards.css';
import { AuthContext } from "../../Security/AuthProvider";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import { IoIosSearch } from "react-icons/io";

const CampaignTable = ({ email }) => {
  const { user }=useContext(AuthContext)
  const [clients, refetch] = useClients();
  const [employeePayment] = useEmployeePayment();
  console.log(employeePayment)
  const AxiosPublic = UseAxiosPublic();
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    useEffect(() => {
        if (users && email) {
            const fff = users.find(u => u.email === email);
            console.log(fff);
            setDdd(fff || {}); // Update state with found user or an empty object
        }
    }, [users, email]);

    const [payment, setPayment] = useState([]);
    const [totalPayment, setTotalPayment] = useState([]);

    useEffect(() => {
          const realdata = employeePayment.filter(m => m.employeeEmail === email);
          setPayment(realdata);
          console.log(realdata);
          const totalBill = realdata.reduce((acc, campaign) => acc + parseFloat(campaign.payAmount), 0);
          setTotalPayment(totalBill);
    }, [employeePayment, email]);

  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  const [totalRCV, setTotalRCV] = useState(0);
  const [totalbill, setTotalBill] = useState(0);

  useEffect(() => {
    const filtered = clients.filter(
      (campaign) => campaign.employeeEmail === email
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
  }, [clients, email]);

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
          const filtered=da.filter(f=> f.employeeEmail === email) 

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
  },[email])

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

    <div className="my-4 ">
        
     <div className="">
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 mb-3  lg:grid-cols-6 gap-3 mt-4 p-4 ">
 <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center  transition-transform transform hover:scale-105 border-0">
   <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
   <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashMarcent - bkashMarcent2}</p>
 </div>
 <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
   <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
   <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashPersonal - bkashPersonal2}</p>
 </div>
 <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
   <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />

   <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {nagadPersonal - nagadPersonal2}</p>
 </div>
 <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
   <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />

   <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {rocketPersonal - rocketPersonal2}</p>
 </div>

 <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
   <div>
     <img className="balance-card-img w-56 h-auto mt-5 " src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
     <span className="balance-card-text text-4xl flex items-center justify-center gap-2">
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> </p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold text-green-600">$ </span> {totalSpent.toFixed(2)}</p>
     </span>

   </div>
 </div>

 
 <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 mr-4 text-center transition-transform transform hover:scale-105 border-0">
   <img className="balance-card-img" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
   <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal - bankTotal2}</p>
 </div>


</div>
    
   
    <div className=" p-2  sm:p-4 ">
     
      <div className="overflow-x-auto  ">

      
    <div className="flex justify-between items-center ">


    <div className="flex justify-end mb-6">
              <input
                type="text"
                placeholder=" Client Phone Number"
                className=" rounded-l-lg w-20 placeholder-black border-2 border-black p-2 font-bold text-black sm:w-2/3 text-sm bg-blue-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                className=" w-10 p-2 font-semibold rounded-r-lg sm:w-1/3 bg-[#FF9F0D] dark:bg-[#FF9F0D] text-white"
              >
                <IoIosSearch className="mx-auto font-bold w-6 h-6" />
              </button>
    </div>
</div>


<table className="min-w-full bg-white">
<thead className="bg-[#05a0db] text-white">
<tr>
<th className="p-3 text-center">SL</th>
<th className="p-3 text-center">Client Name</th>
<th className="p-3 text-center">Client Phone</th>
{/* <th className="p-3 text-center">Client Email</th> */}
<th className="p-3 text-center">T.Budget</th>
<th className="p-3 text-center">T.Spent</th>
<th className="p-3 text-center">Total Bill</th>
<th className="p-3 text-center">Total Payment Rcv</th>
<th className="p-3 text-center">Total Due</th>

</tr>
</thead>
<tbody>
{filteredByCategory.map((campaign, index) => (
<tr
  key={campaign._id}
  className={`${
    index % 2 === 0
      ? "text-gray-500 border-b border-opacity-20 hover:text-blue-600"
      : "text-gray-500 border-b border-opacity-20 hover:text-blue-600"
  }`}
>
  <td className="p-3 border-r border-gray-400 border-l text-center">{index + 1}</td>

  <Link to={`/dashboard/client/${campaign.clientEmail}`}>
    <td className="p-3 border-r border-gray-400 flex justify-center text-center">{campaign.clientName}</td>
  </Link>
  <td className="p-3 border-r border-gray-400 text-center">{campaign.clientPhone}</td>
  <td className="p-3 border-r border-gray-400 text-center">$ {campaign.tBudged}</td>
  <td className="p-3 border-r border-gray-400 text-center">$ {campaign.tSpent}</td>
  <td className="p-3 border-r border-gray-400 text-center">৳ {campaign.tBill}</td>
  <td className="p-3 border-r border-gray-400 text-center">৳ {campaign.tPayment}</td>
  <td className="p-3 border-r border-gray-400 text-center">
          ৳ {
            !isNaN(Number(campaign.tBill)) && !isNaN(Number(campaign.tPaid)) 
            ? Number(campaign.tBill) - Number(campaign.tPayment) 
            : 'Invalid Data'
          }
        </td>


</tr>
))}
<tr className="bg-[#05a0db] text-sm text-white font-bold">
<td className="p-3 text-center"></td>

<td className="p-3  text-right" colSpan="1">
  Total :
</td>
<td className="p-3  text-center">$ {totalBudged}</td>
<td className="p-3  text-center">$ {totalSpent}</td>
<td className="p-3  text-center">৳ {totalbill}</td>
<td className="p-3  text-center">৳ {totalRCV}</td>
<td className="p-3 ">Total Due : ৳ {totalDue}</td>
<td className="p-3 ">Total Due : ৳ {totalDue}</td>
</tr>
</tbody>
</table>

      </div>
    </div>






    {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
    <h6 className="text-center  font-bold text-3xl md:text-5xl text-green-600">
                  Payment History
              </h6>


    <div className="overflow-x-auto mt-6 mx-4">
                  <table className="min-w-full bg-white">
                      <thead className="bg-[#05a0db] text-white">
                          <tr>
                              <th className="p-3 ">SL</th>
                              <th className="p-3">Payment Date</th>
                              <th className="p-3">Payment Amount</th>
                              <th className="p-3">Payment Method</th>
                              <th className="p-3"> Note</th>
                          </tr>
                      </thead>
                      <tbody>
                          {payment.map((payment, index) => (
                              <tr
                                  key={index}
                                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                              >
                                  <td className="p-3  border-r-2 border-l-2 border-gray-200 text-center">{index + 1}</td>
                                  <td className="p-3 border-r-2 border-gray-200 text-center">{payment.date}</td>
                                  <td className="p-3 border-r-2 border-gray-200 text-center">৳ {payment.payAmount}</td>
                                
                                  <td className="p-3 border-r-2 border-gray-200 text-center">


                                  
                                      {payment.paymentMethod === 'bkashMarchent' && <img className="h-10 w-24 flex mx-auto my-auto items-center justify-center" src='https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png' alt="" />
                                      }
                                      {payment.paymentMethod === 'bkashPersonal' && <img className="h-10 w-24 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/520Py6s/bkash-1.png' alt="" />
                                      }
                                      {payment.paymentMethod === 'rocketPersonal' && <img className="h-10 w-24 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/QkTM4M3/rocket.png' alt="" />
                                      }
                                      {payment.paymentMethod === 'nagadPersonal' && <img className="h-10 w-24 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/JQBQBcF/nagad-marchant.png' alt="" /> 
                                      }
                                      {payment.paymentMethod === 'bank' && <img className="h-12 w-13 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/kS0jD01/bank-3d-render-icon-illustration-png.webp' alt="" />
                                      }
                                      </td>
                                      <td className="p-3 border-r-2 border-gray-200 text-center"> {payment.note}</td>
                              </tr>
                          ))}
                          <tr className="bg-[#05a0db] text-white font-bold">
                              <td className="p-3 text-center" colSpan="2">
                                  Total Amount =
                              </td>
                              <td className="p-3 text-center">৳ {totalPayment}</td>
                              <td className="p-3 text-center"></td>
                              <td className="p-3 text-center"></td>
                              
                             
                          </tr>
                      </tbody>
                  </table>
              </div>
              <ToastContainer />
  </div>
    </div>
  );
};
export default CampaignTable;