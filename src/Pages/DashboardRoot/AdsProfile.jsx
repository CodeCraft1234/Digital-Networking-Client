import React, { useContext, useEffect, useState } from 'react';
import AdsAccountCenter from './Routes/AdsAccountCenter';
import { AuthContext } from '../../Security/AuthProvider';
import useUsers from '../../Hook/useUsers';
import { useLoaderData, useParams } from 'react-router-dom';
import useAdsAccountCenter from '../../Hook/useAdsAccountCenter';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { Helmet } from 'react-helmet-async';
import useAdsPayment from '../../Hook/useAdsPayment';
import { IoIosSearch } from 'react-icons/io';
import { MdDelete, MdEditSquare } from 'react-icons/md';

const AdsProfile = () => {
    const { user } = useContext(AuthContext);
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    console.log(ddd);
    const {email}=useParams()
    console.log(email);
  
    useEffect(() => {
        if (users && user) {
            const fff = users.find(u => u.email === email);
            console.log(fff);
            setDdd(fff || {}); // Update state with found user or an empty object
        }
    }, [users, user,email]);
  
    
  
    const [adsAccountCenter, refetch] = useAdsAccountCenter();
    const [adsAccounts, setAdsAccounts] = useState([]);
  
    useEffect(() => {
      const filterdata = adsAccountCenter.filter((m) => m.employeeEmail === email);
      console.log(filterdata);
      setAdsAccounts(filterdata);
  
    }, [adsAccountCenter, user?.email]);
  
    const handleAddAdsAcount = (e) => {
      e.preventDefault();
      const accountName = e.target.accountName.value;
      const paymentDate = e.target.paymentDate.value;
      const employeeEmail = email;
      const employeerName = ddd?.name;
      const currentBallence=0
      const threshold=0
      const totalSpent=0
      const dollerRate=125
      const status='Active'
  
  
      const data = { accountName,dollerRate,totalSpent,currentBallence,threshold, paymentDate,status, employeeEmail,employeerName };
  
      AxiosPublic.post("/adsAccountCenter", data).then((res) => {
        console.log(res.data);
        // toast.success("add successful");
        refetch()
        
      });
    };
  
  const AxiosPublic=UseAxiosPublic()
  
  const [currentTotal,setCurrentTotal]=useState(0)
  const [tSpent,setthreshold]=useState(0)
   const [TSpent,setTSpent]=useState(0)
  
  useEffect(() => {
   
    const total = adsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.currentBallence),
      0
    );
    setCurrentTotal(total);
  
    const totalBill = adsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.threshold),
      0
    );
    setthreshold(totalBill);
  
    const totalBilll = adsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.totalSpent),
      0
    );
    setTSpent(totalBilll);
  
  }, [adsAccounts]);
  
  const [modalData, setModalData] = useState(null);
  const handleUpdate = (e, id) => {
    e.preventDefault();
    const accountName = e.target.accountName.value;
    const currentBallence = e.target.currentBallence.value;
    const threshold = e.target.threshold.value;
    const totalSpent = e.target.totalSpent.value;
    const dollerRate = e.target.dollerRate.value;
    const status = e.target.status.value;
    const paymentDate = e.target.paymentDate.value;
    const body = { accountName,currentBallence,paymentDate,dollerRate, threshold, totalSpent, status };
    AxiosPublic.patch(`/adsAccountCenter/${id}`,body
    )
      .then((res) => {
        console.log(res.body);
        refetch();
        Swal.fire({
          title: "Good job!",
          text: "Add Account success!",
          icon: "success",
        });
  
        setModalData(null);
      })
      .catch((error) => {
        console.error("Error adding account:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add account!",
        });
      });
  };


  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Blog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete blog",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/adsAccountCenter/${id}`).then((res) => {
          refetch();
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your blog has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };


  const [adsPayment] = useAdsPayment();


  const [payment, setPayment] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [sortMonth, setSortMonth] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [totalPayment, setTotalPayment] = useState(0);
  useEffect(() => {
    const realdata = adsPayment.filter(
      (m) => m.employeeEmail === email
    );
    setPayment(realdata);
    const totalBill = realdata.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount),
      0
    );
    setTotalPayment(totalBill);
  }, [adsPayment, email]);


  useEffect(() => {
    if (payment) {
      setFilteredClients(payment);
    }
  }, [payment]);

  useEffect(() => {
    let filtered = payment;

    if (selectedEmployee) {
      filtered = filtered.filter((c) => c.employeeEmail === selectedEmployee);
    }

    if (sortMonth !== "") {
      filtered = filtered.filter((c) => {
        const month = new Date(c.date).getMonth() + 1;
        return month === parseInt(sortMonth);
      });
    }

    if (selectedDate) {
      filtered = filtered.filter((c) => {
        const paymentDate = new Date(c.date);
        const selected = new Date(selectedDate);
        return (
          paymentDate.getDate() === selected.getDate() &&
          paymentDate.getMonth() === selected.getMonth() &&
          paymentDate.getFullYear() === selected.getFullYear()
        );
      });
    }

    setFilteredClients(filtered);
  }, [selectedEmployee, sortMonth, selectedDate, adsPayment]);

  const filteredItems = filteredClients.filter((item) =>
    item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) =>
          item.paymentMethod.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;

  useEffect(() => {
    const totalBill = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount),
      0
    );
    setTotalPayment(totalBill);
  }, [filteredByCategory]);



  const [userdata,setUserData]=useState()
  console.log(userdata);

  useEffect(()=>{
    const finder=users.find(use=>use.email === user?.email)
    setUserData(finder)
  },[users,user?.email])

  const handlePayment =async (e) => {
    e.preventDefault();
    const employeeName=user?.displayName
    const employeeEmail = email;
    const payAmount = e.target.payAmount.value;
    const paymentMethod = e.target.paymentMethod.value;
    const note = e.target.note.value;
    const date = e.target.date.value;

    const data = {
      employeeName,
      employeeEmail,
      payAmount,
      note,
      paymentMethod,
      date,
    };

    AxiosPublic.post(
      "https://digital-networking-server.vercel.app/adsPayment",
      data
    )
      .then((res) => {
        refetch();

      })


      const fields = {
        bkashMarchent: (userdata.bkashMarchent || 0) - payAmount,
        bkashPersonal: (userdata.bkashPersonal || 0) - payAmount,
        nagadPersonal: (userdata.nagadPersonal || 0) - payAmount,
        rocketPersonal: (userdata.rocketPersonal || 0) - payAmount,
      };
    
      if (!fields[paymentMethod]) {
        console.error("Invalid payment method");
        return;
      }
    
      const body2 = { [paymentMethod]: fields[paymentMethod] };
    
      try {
        const res = await axios.put(`https://digital-networking-server.vercel.app/users/${paymentMethod}/${userdata._id}`, body2);
        console.log(res.data);
        refetch();  // Make sure this function correctly refetches the updated data
      } catch (error) {
        console.error("Error updating account:", error);
      }
  };

  const handleUpdatePayment = (e, id) => {
    e.preventDefault();
    const payAmount = parseFloat(e.target.payAmount.value);
    const date = e.target.date.value;
    const note = e.target.note.value;
    const paymentMethod = e.target.paymentMethod.value;
    const body = { note, payAmount, date, paymentMethod };

    AxiosPublic.patch(
      `https://digital-networking-server.vercel.app/adsPayment/${id}`,
      body
    )
      .then((res) => {
        window.location.reload();
        refetch();
        Swal.fire({
          title: "Good job!",
          text: "Payment updated successfully!",
          icon: "success",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to update payment!",
        });
      });
  };

  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (orderId) => {
    setActiveDropdown(activeDropdown === orderId ? null : orderId);
  };

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };
  

  const handleDelete2 = (id) => {
      AxiosPublic.delete(`/employeePayment/${id}`).then((res) => {
          refetch();
        });
      }


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

  const [userss,setUser]=useState([])
  console.log(userss?.email)
  useEffect(()=>{
    const filtered=users.find(e=>e.email === user?.email) 
    console.log('sdahjgj',filtered)
    setUser(filtered)
  },[users,user])

  const userr=useLoaderData()
  console.log(userr)
 const [data,setData]=useState([])
  console.log(data)

    useEffect(()=>{
      AxiosPublic.get(`https://digital-networking-server.vercel.app/users/${userr.email}`)
      .then(res=>{
        console.log(res.data)
        setData(res.data)
      })
    },[])



    const [payment2, setPayment2] = useState([]);
    const [totalPayment2, setTotalPayment2] = useState(0);
    const [adsAccounts2, setAdsAccounts2] = useState([]);
    const [TSpent2, setTSpent2] = useState(0);
    const [averageDollarRate, setAverageDollarRate] = useState(0);
    const [totalBill, setTotalBill] = useState(0);
    const [totalDue, setTotalDue] = useState(0);
  
    useEffect(() => {
      if (user) {
        const realdata = adsPayment.filter(
          (m) => m.employeeEmail === email
        );
        setPayment2(realdata);
        const totalBill = realdata.reduce(
          (acc, campaign) => acc + parseFloat(campaign.payAmount || 0),
          0
        );
        setTotalPayment2(totalBill);
      }
    }, [adsPayment, user]);
  
    useEffect(() => {
      if (user) {
        const filterdata = adsAccountCenter.filter((m) => m.employeeEmail === email);
        setAdsAccounts2(filterdata);
      }
    }, [adsAccountCenter, email]);
  
    useEffect(() => {
      const totalSpent = adsAccounts.reduce(
        (acc, campaign) => acc + parseFloat(campaign.totalSpent || 0),
        0
      );
      setTSpent2(totalSpent);
  
      const totalDollarRate = adsAccounts.reduce(
        (acc, campaign) => acc + parseFloat(campaign.dollerRate), // Convert string to number and add to accumulator
        0 // Initial value of accumulator
      );
      
      console.log(adsAccounts.length, totalDollarRate);
      const averageDollarRate = adsAccounts.length ? totalDollarRate / adsAccounts.length : 0;
      setAverageDollarRate(averageDollarRate);
  
      const totalBill = totalSpent * averageDollarRate;
      setTotalBill(totalBill);
  
      const totalDue = totalBill - totalPayment;
      setTotalDue(totalDue);
  
      // Debugging statements
      console.log('Total Spent:', totalSpent);
      console.log('Average Dollar Rate:', averageDollarRate);
      console.log('Total Bill:', totalBill);
      console.log('Total Payment:', totalPayment);
      console.log('Total Due:', totalDue);
    }, [adsAccounts, totalPayment]);
    
    return (
        <div className='my-5'>
          
        <div className=" p-4 dark:text-green-800">
        <Helmet>
         <title>Ads user profile | Digital Network </title>
         <link rel="canonical" href="https://www.example.com/" />
       </Helmet>

       <div className="grid lg:grid-cols-4 text-white sm:grid-cols-2 gap-5 justify-around p-5">
        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] shadow-lg text-center">
          <h2 className="text-xl">Total Spent</h2>
          <p className="text-4xl font-bold"> $ {TSpent2.toFixed(2)}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] shadow-lg text-center">
          <h2 className="text-xl">Total Bill</h2>
          <p className="text-4xl font-bold"> ৳ {totalBill.toFixed(2)}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] shadow-lg text-center">
          <h2 className="text-xl">Total Paid</h2>
          <p className="text-4xl font-bold"> ৳ {totalPayment2.toFixed(2)}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] shadow-lg text-center">
          <h2 className="text-xl ">Total Due</h2>
          <p className=" text-4xl font-bold"> ৳ {totalDue.toFixed(2)}</p>
        </div>
      </div>


       <div className="flex justify-start mb-5 text-gray-500 border-opacity-20 mx-2 pb-1 items-center gap-3">
  <button
    className="font-avenir px-3 py-1 rounded-lg text-white bg-[#05a0db]"
    onClick={() => document.getElementById("my_modal_3").showModal()}
  >
    Add Ads Account
  </button>
  <dialog id="my_modal_3" className="modal">
    <div className="modal-box bg-white">
      <form onSubmit={(e) => handleAddAdsAcount(e)}>
        <div className="mb-4">
          <label className="block text-black">Payment Date</label>
          <input
            required
            type="date"
            name="paymentDate"
            className="w-full border bg-green-300 border-gray-600 text-black rounded p-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-black">Account Name</label>
          <input
            type="text"
            name="accountName"
            placeholder="type here..."
            className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-3 mt-4">
        
          <form method="dialog">
            <button className="font-avenir px-3 py-1 w-full  rounded-lg  bg-red-600 text-white">
              Close
            </button>
          </form>
          <button
            type="submit"
            className="font-avenir px-3 py-1 rounded-lg w-full  text-white bg-[#05a0db]"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  </dialog>
</div>

   
 
     <div className="overflow-x-auto mt-6">
       <table className="min-w-full bg-white">
         <thead className="bg-[#05a0db] text-white">
           <tr>
             <th className="p-3">SL</th>
             <th className="p-3">Payment Date</th>
             <th className="p-3">Ad Account Name</th>
             <th className="p-3">Current Balance</th>
             <th className="p-3">Threshold</th>
             <th className="p-3">Total Spent</th>
             <th className="p-3">Total Bill</th>
             <th className="p-3">Status</th>
             <th className="p-3">Action</th>
         
           </tr>
         </thead>
         <tbody>
           {adsAccounts.map((account, index) => (
             <tr
             key={account._id}
             className={`${
               index % 2 === 0
                 ? "bg-white text-left text-gray-500 border-b border-opacity-20"
                 : "bg-gray-200  text-left text-gray-500 border-b border-opacity-20"
             }`}
             >
               <td className="p-3 border-r-2 border-l-2 border-gray-300 text-center">{index + 1}</td>
               <td className="p-3 border border-gray-300 text-center"> {new Date(account?.paymentDate).toLocaleDateString("en-GB")}</td>
              
               <td className="p-3 border-r-2  border-gray-300 text-start px-5 ">
                     <div className="">
                       <h1> {account.accountName}</h1>
                   
                     </div>
                   </td>
               <td className="p-3 border border-gray-300  text-center">$ {account.currentBallence}</td>
               <td className="p-3 border border-gray-300 text-center">$ {account.threshold}</td>
               <td className="p-3 border border-gray-300 text-center">$ {account.totalSpent}</td>
               <td className="p-3 border border-gray-300 text-center">$ {account.totalSpent * account.dollerRate}</td>
               <td className={`p-3 border  text-center border-gray-300  ${
                       account.status === "Active"
                         ? "text-blue-700 font-bold"
                         : "text-red-600 font-bold"
                     }`}
                   >
                     {account.status} 
                     </td>
               <td className={`p-3 border flex justify-center gap-2 text-center border-gray-300  `}
                   >
                    <button
                           className="text-blue-600 text-3xl"
                           onClick={() => setModalData(account)}
                         >
                         <MdEditSquare />
                         </button>
                         <button
                          className="text-start flex justify-start text-black text-3xl"
                          onClick={() => handleDelete(account._id)}
                        >
                          <MdDelete />
                        </button>
                        
                     </td>
              
             </tr>
           ))}
           <tr className="bg-[#05a0db] text-sm text-white font-bold">
     
     <td className="p-3  text-right" colSpan="3">
       Total :
     </td>
     <td className="p-3  border-gray-300 text-center">$ {currentTotal}</td>
     <td className="p-3  text-center">$ {tSpent}</td> 
     <td className="p-3  text-center">$ {TSpent}</td> 
     <td className="p-3  text-center"></td> 
     <td className="p-3  text-center"></td> 
     <td className="p-3  text-center"></td> 
 
    
     
 
   </tr>
         </tbody>
       </table>
     </div>
     {modalData && (
         <dialog className="modal" open>
           <div className="modal-box bg-white text-black">
             <form onSubmit={(e) => handleUpdate(e, modalData._id)}>
               <div className="flex justify-center items-center gap-3">
               <div className="mb-4">
                           <label className="block text-gray-500">
                           Account Name
                           </label>
                           <input
                             type="text required"
                             name="accountName" 
 
                             defaultValue={modalData.accountName}
                             className="w-full border-2 border-black rounded p-2 mt-1 bg-white text-black"
                           />
                         </div>
                 <div className="mb-4">
                   <label className="block text-gray-500">Current Balance</label>
                   <input
                     type="number"
                     name="currentBallence"
                     step="0.01"
                     defaultValue={modalData.currentBallence}
                     className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
                   />
                 </div>
                 <div className="mb-4">
                   <label className="block text-gray-500">Threshold</label>
                   <input
                     type="number"
                     name="threshold"
                     step="0.01"
                     defaultValue={modalData.threshold}
                     className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
                   />
                 </div>
               </div>
               <div className="flex justify-center items-center gap-3">
                 <div className="mb-4">
                   <label className="block text-gray-500">Total Spent</label>
                   <input
                     type="number"
                     name="totalSpent"
                     step="0.01"
                     defaultValue={modalData.totalSpent}
                     className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
                   />
                 </div>
                 <div className="mb-4">
                   <label className="block text-gray-500">Doller Rate</label>
                   <input
                     type="number"
                     name="dollerRate"
                     step="0.01"
                     defaultValue={125}
                     className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
                   />
                 </div>
                
                 
               </div>
              <div className="flex justify-center gap-5 ">
              <div className="mb-4">
                   <label className="block text-gray-500">Status</label>
                   <select
                     name="status"
                     defaultValue={modalData.status}
                     className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
                   >
                     <option value="Active">Active</option>
                     <option value="Disable">Disable</option>
                   </select>
                 </div>
               <div className="mb-4">
                   <label className="block  text-black ">Payment Date</label>
                   <input
                     type="date"
                     name="paymentDate"
                     defaultValue={modalData?.paymentDate}
                     className="w-full border rounded p-2 mt-1 text-black bg-green-200  border-gray-500"
                   />
                 </div>
              </div>
 
               <button
                 type="submit"
                 className="font-avenir px-3 mx-auto py-1 rounded-lg text-white bg-green-800"
               >
                 Update
               </button>
             </form>
             <div className="modal-action">
               <button
                 className="p-2 rounded-lg bg-red-600 text-white text-center"
                 onClick={() => setModalData(null)}
               >
                 Close
               </button>
             </div>
           </div>
         </dialog>
       )}
   </div>

     <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 mb-3  lg:grid-cols-5 gap-8 mt-4 p-4">
   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center  transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashMarcent2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashPersonal2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {nagadPersonal2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {rocketPersonal2}</p>
   </div>

   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
     {/* <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Received : ৳</span> {bankTotal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Cashout : ৳</span> {bankTotal2}</p> */}
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal2}</p>
   </div>
     </div>
   
{/* ///////////////////////////////////////////////////////////////// */}
    <div className="flex mt-5 justify-between items-center gap-5  ml-2 ">
    <div className="">
  <button
    className="font-avenir px-3 mx-auto py-1 bg-[#05a0db] ml-5 rounded-lg text-white"
    onClick={() => document.getElementById("my_modal_1").showModal()}
  >
    Pay Admin
  </button>
  <dialog id="my_modal_1" className="modal">
    <div className="modal-box bg-white text-black font-bold">
      <form onSubmit={(e) => handlePayment(e)}>
      <div className="mb-4">
          <label className="block text-gray-250">Date</label>
          <input
            required
            type="date"
            name="date"
            className="w-full border-2 bg-green-300 text-black border-black rounded p-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-250">Pay Amount</label>
          <input
            required
            type="number"
            name="payAmount"
            defaultValue={0}
            className="w-full border-2 bg-white border-black rounded p-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-250">Note</label>
          <input
            type="text"
            name="note"
            required
            placeholder="type note..."
            className="w-full border-2 bg-white border-black rounded p-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-250">Payment Method</label>
          <select
            required
            name="paymentMethod"
            className="w-full border-2 bg-white border-black rounded p-2 mt-1"
          >
            <option value="bkashMarchent">Bkash Marchent</option>
            <option value="bkashPersonal">Bkash Personal</option>
            <option value="nagadPersonal">Nagad Personal</option>
            <option value="rocketPersonal">Rocket Personal</option>
            <option value="bank">Bank</option>
          </select>
        </div>
       

        <div className="grid lg:grid-cols-2 gap-3 mt-4">
        <form method="dialog">
            <button className="font-avenir px-3 py-1 w-full rounded-lg text-white bg-red-600">
              Close
            </button>
          </form>
          <button
            type="submit"
            className="font-avenir px-3 py-1  w-full rounded-lg text-white bg-[#05a0db]"
          >
            Send
          </button>
       
        </div>
      </form>
    </div>
  </dialog>
</div>

          <div className="flex  justify-end items-center gap-5  ml-2 ">
  
    <div className="flex flex-col justify-end items-center">
      <label>By Month</label>
      <select
        className="border bg-blue-200 text-black border-gray-400 rounded p-2 mt-1"
        value={sortMonth}
        onChange={(e) => setSortMonth(e.target.value)}
      >
        <option value="">Select Month</option>
        {[
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ].map((month, index) => (
          <option key={index + 1} value={index + 1}>
            {month}
          </option>
        ))}
      </select>
    </div>
    <div className="flex flex-col justify-center items-center">
      <label className="block">By Date</label>
      <input
        type="date"
        className="border rounded bg-blue-200 text-black border-gray-400 p-2 mt-1"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>
    <div className="flex flex-col justify-center items-center">
      <label className="block ml-2">Payment Method</label>
      <select
        className="border bg-blue-200 text-black border-gray-400 rounded p-2 mt-1"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Methods</option>
        <option value="bkashPersonal">bKash Personal</option>
        <option value="bkashMarchent">bKash Merchant</option>
        <option value="nagadPersonal">Nagad Personal</option>
        <option value="rocketPersonal">Rocket Personal</option>
        <option value="bank">Bank</option>
      </select>
    </div>
    <div className="mt-6 flex justify-center items-center mr-5">
    <input
      type="text"
      placeholder="Payment Method"
      className="rounded-l-lg w-20 placeholder-black border-2 border-black p-2 font-bold text-black sm:w-2/3 text-sm bg-blue-300"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <button
      type="button"
      className="w-10 p-2 font-semibold rounded-r-lg sm:w-1/3 bg-[#FF9F0D] dark:bg-[#FF9F0D] text-white"
    >
      <IoIosSearch className="mx-auto  font-bold w-6 h-6" />
    </button>
  </div>
          </div>
  
     </div>




      <div className="overflow-x-auto mt-6 mx-4">
        <table className="min-w-full bg-white">
          <thead className="bg-[#05a0db] text-white">
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
            {filteredByCategory.map((payment, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="p-3  border-r-2 border-l-2 border-gray-200 text-center">
                  {index + 1}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>
               
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  ৳ {payment.payAmount}
                </td>

                <td className="p-3 border-r-2 border-gray-200 text-center">
                  {payment.paymentMethod === "bkashMarchent" && (
                    <img
                      className="h-10 w-24 flex mx-auto my-auto items-center justify-center"
                      src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "bkashPersonal" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/520Py6s/bkash-1.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "rocketPersonal" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/QkTM4M3/rocket.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "nagadPersonal" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/JQBQBcF/nagad-marchant.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "bank" && (
                    <img
                      className="h-12 w-13 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png"
                      alt=""
                    />
                  )}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  {" "}
                  {payment.note}
                </td>

               

                <td className="p-3 border-r-2 border-gray-200 text-center">
                <div className='flex gap-3 items-center'>
                <button
                    className="font-avenir text-3xl  py-1 px-4 rounded-lg text-blue-700"
                    onClick={() =>
                      document
                        .getElementById(`modal_${payment._id}`)
                        .showModal()
                    }
                  >
                  <MdEditSquare />
                  </button>
                  <button
                          className="text-start flex justify-start text-black text-3xl"
                          onClick={() => handleDelete(payment._id)}
                        >
                          <MdDelete />
                        </button>
                </div>
                
                <dialog id={`modal_${payment._id}`} className="modal">
  <div className="modal-box bg-white text-black font-bold">
    <form onSubmit={(e) => handleUpdatePayment(e, payment._id)}>
      <div className="mb-4">
        <label className="block text-gray-700">Previous Amount</label>
        <input
          type="number"
          name="previousAmount"
          disabled
          defaultValue={payment?.payAmount}
          className="w-full border-2 bg-white border-black rounded p-2 mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">New Amount</label>
        <input
          required
          type="number"
          name="payAmount"
          defaultValue={payment?.payAmount}
          className="w-full border-2 bg-white border-black rounded p-2 mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Date</label>
        <input
          type="date"
          defaultValue={payment.date}
          name="date"
          className="w-full border-2 bg-white border-black rounded p-2 mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Method</label>
        <select
          required
          name="paymentMethod"
          defaultValue={payment.paymentMethod}
          className="w-full border-2 bg-white border-black rounded p-2 mt-1"
        >
          <option value="bkashMarchent">Bkash Marchent</option>
          <option value="bkashPersonal">Bkash Personal</option>
          <option value="nagadPersonal">Nagad Personal</option>
          <option value="rocketPersonal">Rocket Personal</option>
          <option value="bank">Bank</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Note</label>
        <input
          required
          type="text"
          name="note"
          defaultValue={payment?.note}
          className="w-full border-2 bg-white border-black rounded p-2 mt-1"
        />
      </div>
      
      <div className="flex gap-3 mt-4">
      <button
          type="button"
          className="font-avenir px-3 py-1 rounded-lg text-white bg-red-600 flex-1"
          onClick={() => document.getElementById(`modal_${payment._id}`).close()}
        >
          Close
        </button>
        <button
          type="submit"
          className="font-avenir px-3 py-1 rounded-lg text-white bg-green-800 flex-1"
        >
          Update
        </button>
       
      </div>
    </form>
  </div>
</dialog>

              
                </td>


                 

                
              </tr>
            ))}
            <tr className="bg-[#05a0db] text-white font-bold">
              <td className="p-3 text-center" colSpan="2">
                Total Amount :
              </td>
              <td className="p-3 text-center">৳ {totalPayment}</td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>

            </tr>
          </tbody>
        </table>
      </div>
     
    </div>
    );
};

export default AdsProfile;