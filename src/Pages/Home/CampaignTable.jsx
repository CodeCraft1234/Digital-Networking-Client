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
import { Helmet } from "react-helmet-async";

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

    <div className="my-5 ">
         <Helmet>
        <title>Client Table | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
     <div className="">


    
   
    <div className=" p-5  ">
     
      <div className="overflow-x-auto  ">

      
  


    <div className="flex justify-end mb-5">
              <input
                type="text"
                placeholder=" Client Phone Number..."
                className=" rounded-lg w-auto  placeholder-black border border-gray-700 p-2  text-black  bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

    </div>


<div className="overflow-x-auto rounded-lg border-black">
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
<th className="p-3 text-center">Payment Rcv</th>
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
  <td className="p-3 border-r border-gray-400 text-center">$ {parseFloat(campaign.tBudged).toFixed(2)}</td>
  <td className="p-3 border-r border-gray-400 text-center">$ {parseFloat(campaign.tSpent).toFixed(2)}</td>
  <td className="p-3 border-r border-gray-400 text-center">৳ {parseFloat(campaign.tBill).toFixed(2)}</td>
  <td className="p-3 border-r border-gray-400 text-center">৳ {parseFloat(campaign.tPayment).toFixed(2)}</td>
  <td className="p-3 border-r border-gray-400 text-center">
  ৳ {
    !isNaN(Number(campaign.tBill)) && !isNaN(Number(campaign.tPaid))
    ? (Number(campaign.tBill) - Number(campaign.tPayment)).toFixed(2)
    : 'Invalid Data'
  }
</td>



</tr>
))}
<tr className="bg-[#05a0db] text-sm text-white font-bold">
<td className="p-3 text-center"></td>

<td className="p-3  text-right" colSpan="2">
  Total :
</td>
<td className="p-3  text-center">$ {totalBudged.toFixed(2)}</td>
<td className="p-3  text-center">$ {totalSpent.toFixed(2)}</td>
<td className="p-3  text-center">৳ {totalbill.toFixed(2)}</td>
<td className="p-3  text-center">৳ {totalRCV.toFixed(2)}</td>
<td className="p-3 ">Total Due : ৳ {totalDue.toFixed(2)}</td>
</tr>
</tbody>
</table>

      </div>
      </div>
    </div>






    {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
    
              <ToastContainer />
  </div>
    </div>
  );
};
export default CampaignTable;