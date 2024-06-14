import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useUsers from "../../Hook/useUsers";
import useClients from "../../Hook/useClient";
import {  Link, useLocation,  } from "react-router-dom";
import useAdsAccount from "../../Hook/useAdAccount";
import Swal from 'sweetalert2'
import './BalanceCards.css';
import { AuthContext } from "../../Security/AuthProvider";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import { IoIosSearch } from "react-icons/io";

const CampaignTable2 = () => {
  
  const { user }=useContext(AuthContext)
  const [clients, refetch] = useClients();
  const [employeePayment] = useEmployeePayment();
  console.log(employeePayment)
  const [adsAccount] = useAdsAccount();
  const AxiosPublic = UseAxiosPublic();
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [data, setUserData] = useState([]);

  console.log("kjhgfaklhgklagshkl", clients, adsAccount);


    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);

    useEffect(() => {
        if (users && user) {
            const fff = users.find(u => u.email === user?.email);
            console.log(fff);
            setDdd(fff || {}); // Update state with found user or an empty object
        }
    }, [users, user]);

    console.log(ddd?.name);


    const [payment, setPayment] = useState([]);
    const [totalPayment, setTotalPayment] = useState([]);

    useEffect(() => {
          const realdata = employeePayment.filter(m => m.employeeEmail === user?.email);
          setPayment(realdata);
          console.log(realdata);
          const totalBill = realdata.reduce((acc, campaign) => acc + parseFloat(campaign.payAmount), 0);
          setTotalPayment(totalBill);
    
    }, [employeePayment, user?.email]);
    console.log(payment,totalPayment);

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

    setFilteredCampaigns(filtered);
  }, [clients, user?.email]);


  const handlePayment = (e) => {

    e.preventDefault();
    const employeeEmail = user?.email;
    const payAmount = e.target.payAmount.value;
    const paymentMethod = e.target.paymentMethod.value;
    const note= e.target.note.value;
    const date = e.target.date.value;

    const data = {
      employeeEmail, payAmount,note, paymentMethod, date
    };
    console.log(data);
    AxiosPublic.post("https://digital-networking-server.vercel.app/employeePayment", data)
    .then((res) => {
      // toast.success("Client Added successfully");
      console.log(res.data);
      refetch();
      Swal.fire({
        title: "Good job!",
        text: "Cashout success!",
        icon: "success"
      });
      
  })
  .catch(error => {
      console.error("Error adding cashout:", error);
      // toast.error("Failed to update campaign");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add cashout!",
      });
    });
  };




  const handleaddblog = (e) => {
    e.preventDefault();
    const clientName = e.target.clientName.value;
    const clientPhone = e.target.clientPhone.value;
    const clientEmail = e.target.clientEmail.value;
    const employeeEmail = user?.email;
    const tBudged = 0;
    const tSpent = 0;
    const tBill = 0;
    const tDue = 0;
    const tPaid = 0;
    const date = new Date()
    const data = {
      clientName,
      clientEmail,
      clientPhone,
      tBudged,
      employeeEmail,
      tSpent,
      tBill,
      date,
      tDue,
      tPaid,
    };
    console.log(data);

    AxiosPublic.post("https://digital-networking-server.vercel.app/clients", data)
    .then((res) => {
      // toast.success("Client Added successfully");
      console.log(res.data);
      refetch();
      toast.success("Client add successfully");
      
  })
  .catch(error => {
      console.error("Error adding client:", error);
      // toast.error("Failed to update campaign");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add client!",
      });
 
   })
   
  };


  const [bkashMarcent,setBkashMarcentTotal]=useState(0)
  const [nagadPersonal,setNagadPersonalTotal]=useState(0)
  const [bkashPersonal,setBkashPersonalTotal]=useState(0)
  const [rocketPersonal,setRocketPersonalTotal]=useState(0)
  const [bankTotal,setBankTotal]=useState(0)
  console.log(bkashMarcent,rocketPersonal,nagadPersonal,bkashPersonal)

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
  console.log(bkashMarcent2,rocketPersonal2,nagadPersonal2,bkashPersonal2)

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


    const handleUpdate = (e, id) => {
      e.preventDefault();
    
      const clientName = e.target.clientName.value;
      const clientPhone = e.target.clientPhone.value;
      const data = { clientName, clientPhone };
    
      AxiosPublic.patch(`https://digital-networking-server.vercel.app/clients/${id}`, data)
        .then(res => {
          console.log(res.data);
          refetch(); // Ensure this function is defined and correct
          toast.success("Client updated successfully");
        })
        .catch(error => {
          console.error("Error updating client:", error);
          toast.error("Failed to update client");
        });
    };


const location=useLocation()

    const handleUpdatePayment = (e, id) => {
      e.preventDefault();
      const payAmount = parseFloat(e.target.payAmount.value);
      const date = e.target.date.value;
      const note = e.target.note.value;
      const paymentMethod = e.target.paymentMethod.value;
      const body = { note, payAmount, date, paymentMethod };
      AxiosPublic.patch(`https://digital-networking-server.vercel.app/employeePayment/${id}`, body)
          .then(res => {
              console.log(res.data);
              window.location.reload();
              refetch();
              toast.success("Campaign updated successfully");
          })
          .catch(error => {
              console.error("Error updating campaign:", error);
              toast.error("Failed to update campaign");
          });
  };

  const handleSort = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const filtered = clients.filter(c => c.employeeEmail === email);
    setFilteredClients(filtered);
  };
    
  return (

    <div className="my-4 mb-24">
      
        <div className="">
        <img className="rounded-full border-2 p-2 border-black mx-auto sm:w-44 h-44 lg:w-72 lg:h-72" src={user?.photoURL} alt=""/>
        <h1 className="lg:text-4xl mt-4 sm:text-2xl md:text-3xl font-bold text-center">{user?.displayName}</h1>
     </div>
      
     
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 mb-3  lg:grid-cols-4 gap-8 mt-4 p-4">
   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center  transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold">Received : ৳</span> {bkashMarcent}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold">Cashout : ৳</span> {bkashMarcent2}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold">Ballence : ৳</span> {bkashMarcent - bkashMarcent2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold">Received : ৳</span> {bkashPersonal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold">Cashout : ৳</span> {bkashPersonal2}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold">Ballence : ৳</span> {bkashPersonal - bkashPersonal2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Received : ৳</span> {nagadPersonal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Cashout : ৳</span> {nagadPersonal2}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Ballence : ৳</span> {nagadPersonal - nagadPersonal2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Received : ৳</span> {rocketPersonal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Cashout : ৳</span> {rocketPersonal2}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Ballence : ৳</span> {rocketPersonal - rocketPersonal2}</p>
   </div>

   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
     <div>
       <img className="balance-card-img w-56 h-auto mt-5 " src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
       <span className="balance-card-text text-4xl flex items-center justify-center gap-2">
       <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold text-red-600">$</span>4000</p>
       <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold text-blue-600">/</span></p>
       <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold text-green-600">$</span>{totalSpent}</p>
       </span>
      

     
     
     </div>
   </div>

   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
   <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700">Total Bill: <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalbill}</p>

     <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700 ">Total Received: <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalRCV}</p>
     <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700">Total Due: <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalbill - totalRCV}</p>

   </div>


   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">

     <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700 ">Total Received: <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalRCV}</p>
     <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700">Total Cashout: <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalPayment}</p>

     <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700">Total Due: <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalRCV - totalPayment}</p>
    
   </div>

  
  
   <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/kS0jD01/bank-3d-render-icon-illustration-png.webp" alt="Rocket" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Received : ৳</span> {bankTotal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Cashout : ৳</span> {bankTotal2}</p>
   </div>

  
 </div>
      
     
      <div className=" p-2  sm:p-4 ">
       
        <div className="overflow-x-auto  ">

        
      <div className="flex justify-between items-center ">

      <div className="flex justify-start mb-5 text-gray-500 border-b border-opacity-20 mx-2 pb-1 items-center gap-3">
{
  ddd?.role === 'admin' ? <></> : <div>
  <button
    className="font-avenir px-3 mx-auto py-1 bg-green-800 ml-5 rounded-lg text-white"
    onClick={() => document.getElementById("my_modal_2").showModal()}
  >
    Add Client
  </button>
  <dialog id="my_modal_2" className="modal">
    <div className="modal-box text-black font-bold">
      <form o onSubmit={handleaddblog}>
        <div className="flex justify-center items-center gap-3">
          <div className="mb-4">
            <label className="block text-black">Client Name</label>
            <input
              id="name"
              name="clientName"
              type="text"
              required
              className="w-full border-2 border-black rounded p-2 mt-1 "
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-3">
          <div className="mb-4">
            <label className="block text-black">Client Phone</label>
            <input
              id="clientPhone"
              name="clientPhone"
              type="number"
              required
              className="w-full  border-2 border-black rounded p-2 mt-1 "
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Client Email</label>
            <input
              id="clientEmail"
              name="clientEmail"
              type="email"
              required

              className="w-full  border-2 border-black rounded p-2 mt-1 "
            />
          </div>
        </div>
        <button type="submit" className="font-avenir  flex justify-center px-3 mx-auto py-1 bg-green-800 rounded text-white">
          Submit
        </button>
      </form>
      <div className="modal-action flex justify-end">
        <form method="dialog">
          <button className="p-2 rounded-lg bg-red-600 text-white text-center">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</div>

}
 
</div>
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
  <thead className="bg-red-800 text-white">
    <tr>
      <th className="p-3 text-center">SL</th>
    
      <th className="p-3 text-center">Client Name</th>
      <th className="p-3 text-center">Client Phone</th>
      {/* <th className="p-3 text-center">Client Email</th> */}
      <th className="p-3 text-center">T.Budget</th>
      <th className="p-3 text-center">T.Spent</th>
      <th className="p-3 text-center">Total Bill</th>
      <th className="p-3 text-center">Total Payment Rcv</th>
      {/* <th className="p-3">Edit</th> */}
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
        <td className="p-3 text-center">{index + 1}</td>
      
        <Link to={`/client/${campaign.clientEmail}`}>
          <td className="p-3 flex justify-center text-center">{campaign.clientName}</td>
        </Link>
        <td className="p-3 text-center">{campaign.clientPhone}</td>
        <td className="p-3 text-center">$ {campaign.tBudged}</td>
        <td className="p-3 text-center">$ {campaign.tSpent}</td>
        <td className="p-3 text-center">৳ {campaign.tBill}</td>
        <td className="p-3 text-center">৳ {campaign.tPayment}</td>
        {/* <td className="p-3">

        <button
            className="font-avenir px-3  mx-auto py-1 bg-green-800 ml-10 rounded-lg text-white"
            onClick={() => document.getElementById("my_modal_7").showModal()}
          >
            Edit
          </button>
          <dialog id="my_modal_7" className="modal">
            <div className="modal-box">
              <form onSubmit={(e) => handleUpdate(e, campaign._id)}>
                <div className="flex justify-center items-center gap-3">
                  <div className="mb-4">
                    <label className="block text-gray-250">
                      Client Name
                    </label>
                    <input
                      required
                      type="text"
                      defaultValue={campaign.clientName}
                      name="clientName"
                      placeholder="type here...."
                      className="w-full border rounded p-2 mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-250">Client Phone</label>
                    <input
                    required
                      type="number"
                      name="clientPhone"
                      defaultValue={campaign.clientPhone}
                      placeholder="type here...."
                      className="w-full border rounded p-2 mt-1"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="font-avenir px-3 mx-auto py-1 rounded-lg flex justify-center text-white bg-green-800"
                >
                  Update
                </button>
              </form>
              <div className="modal-action">
                <form method="dialog">
                  <button className="p-2 rounded-lg bg-red-600 text-white text-center">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </td> */}
      </tr>
    ))}
    <tr className="bg-green-800  text-sm text-white font-bold">
      <td className="p-3 text-center"></td>
      <td className="p-3 text-center"></td>
      <td className="p-3 text-right" colSpan="1">
        Total :
      </td>
      <td className="p-3 text-center">$ {totalBudged}</td>
      <td className="p-3 text-center">$ {totalSpent}</td>
      <td className="p-3 text-center">৳ {totalbill}</td>
      <td className="p-3 text-center">৳ {totalRCV}</td>
      {/* <td className="p-3"></td> */}
    </tr>
  </tbody>
</table>

        </div>
      </div>






      {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
      <h6 className="text-center  font-bold text-3xl md:text-5xl text-green-600">
                    Payment History
                </h6>

                <div>
          <button
            className="font-avenir px-3  mx-auto py-1 bg-green-800 ml-10 rounded-lg text-white"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Cashout
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box text-black font-bold">
              <form onSubmit={(e) => handlePayment(e)}>
                <div className="flex justify-center items-center gap-3">
                  <div className="mb-4">
                    <label className="block text-gray-250">Pay Amount</label>
                    <input
                    required
                      type="number"
                      name="payAmount"
                      defaultValue={0}
                      className="w-full border-2 border-black rounded p-2 mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-250">Note</label>
                    <input
                      type="text"
                      name="note" 
                      required 
                      placeholder="type note..." 
                      className="w-full border-2 border-black rounded p-2 mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-250">
                      Payment Method
                    </label>
                    <select
                     required
                      name="paymentMethod"
                      className="w-full border-2 border-black rounded p-2 mt-1"
                    >
                      <option value="bkashMarchent">Bkash Marchent</option>
                      <option value="bkashPersonal">Bkash Personal</option>
                      <option value="nagadPersonal">Nagad Personal</option>
                      <option value="rocketPersonal">Rocket Personal</option>
                      <option value="bank">Bank</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-250">Date</label>
                    <input
                     required
                      type="date"
                      name="date"
                      className="w-full border-2 border-black rounded p-2 mt-1"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="font-avenir px-3 mx-auto py-1 rounded-lg flex justify-center text-white bg-green-800"
                >
                  Send
                </button>
              </form>
              <div className="modal-action">
                <form method="dialog">
                  <button className="p-2 rounded-lg bg-red-600 text-white text-center">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      <div className="overflow-x-auto mt-6 mx-4">
                    <table className="min-w-full bg-white">
                        <thead className="bg-green-800 text-white">
                            <tr>
                                <th className="p-3 ">SL</th>
                                <th className="p-3">Payment Date</th>
                                <th className="p-3">Payment Amount</th>
                                <th className="p-3">Payment Method</th>
                                <th className="p-3"> Note</th>
                                <th className="p-3">Edit</th>
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
                                           <td className="p-3 border-r-2 border-gray-200 text-center">

                                           <button className="font-avenir px-3  mx-auto py-1 bg-green-800 ml-10 rounded-lg text-white" onClick={() => document.getElementById(`modal_${payment._id}`).showModal()}>
                                            Edit
                                            </button>

                                          <dialog id={`modal_${payment._id}`} className="modal">
                                              <div className="modal-box text-black font-bold">
                                                  <form onSubmit={(e) => handleUpdatePayment(e, payment._id)}>
                                                      <div className="flex justify-center items-center gap-3">
                                                      
                                                          <div className="mb-4">
                                                              <label className="block text-gray-700"> Previous Amount</label>
                                                              <input type="number" name="previousAmount" disabled   defaultValue={payment?.payAmount} className="w-full border-2 border-black rounded p-2 mt-1" />
                                                          </div>
                                                          <div className="mb-4">
                                                              <label className="block text-gray-700"> New Amount</label>
                                                              <input required type="number" name="payAmount"   defaultValue={payment?.payAmount} className="w-full border-2 border-black rounded p-2 mt-1" />
                                                          </div>
                                                          
                                                      </div>
                                                      <div className="flex justify-center items-center gap-3">
                                                      <div className="mb-4">
                                                              <label className="block text-gray-700"> Date</label>
                                                              <input type="date" defaultValue={payment.date} name='date'  className="w-full border-2 border-black rounded p-2 mt-1" />
                                                          </div>
                                                     
                                                      <div className="mb-4">
                                                          <label className="block text-gray-700">Method</label>
                                                          <select required name="paymentMethod" defaultValue={payment.paymentMethod} className="w-full border-2 border-black rounded p-2 mt-1">
                                                          <option value="bkashMarchent">Bkash Marchent</option>
                                                             <option value="bkashPersonal">Bkash Personal</option>
                                                             <option value="nagadPersonal">Nagad Personal</option>
                                                             <option value="rocketPersonal">Rocket Personal</option>
                                                             <option value="bank">Bank</option>
                                                          </select>
                                                      </div>
                                                      </div>
                                                      <div className="mb-4">
                                                              <label className="block text-gray-700">Note</label>
                                                              <input required type="text" name="note" defaultValue={payment?.note} className="w-full border-2 border-black rounded p-2 mt-1" />
                                                          </div>
                                                      <button onClick={() => document.getElementById(`modal_${payment._id}`).close()} type="submit"  className="font-avenir px-3 mx-auto py-1 rounded-lg flex justify-center text-white bg-green-800">Update</button>
                                                  </form>
                                                  <div className="modal-action">
                                                      <button className="p-2 rounded-lg bg-red-600 text-white text-center" onClick={() => document.getElementById(`modal_${payment._id}`).close()}>Close</button>
                                                  </div> 
                                               </div>
                                          </dialog>
                                      </td> 
                                </tr>
                            ))}
                            <tr className="bg-green-800 text-white font-bold">
                                <td className="p-3 text-center" colSpan="2">
                                    Total Amount =
                                </td>
                                <td className="p-3 text-center">৳ {totalPayment}</td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-center"></td>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
                <ToastContainer />
    </div>
  );
};
export default CampaignTable2;