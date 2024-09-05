import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Security/AuthProvider';
import useUsers from '../../Hook/useUsers';
import { useLoaderData, useParams } from 'react-router-dom';
import useAdsAccountCenter from '../../Hook/useAdsAccountCenter';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import useAdsPayment from '../../Hook/useAdsPayment';
import { MdDelete, MdEditSquare } from 'react-icons/md';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const AdsUserAdsAccount = () => {
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



  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (orderId) => {
    setActiveDropdown(activeDropdown === orderId ? null : orderId);
  };


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


    const handleUpdate2 = (id, newStatus) => {
      const body = { status: newStatus };
    
      AxiosPublic.patch(`/adsAccountCenter/status/${id}`, body)
        .then((res) => {
          console.log(res.data);
          refetch();
          toast.success(`Campaign updated successfully`);
        })
        .catch((error) => {
          console.error("Error updating campaign:", error);
          toast.error("Failed to update campaign");
        });
    };
    return (
        <div>
                   <div className="flex justify-start  text-gray-500 border-opacity-20 mx-2  items-center gap-3">
  <button
    className="font-avenir px-3 w-full lg:w-auto mt-5 lg:mt-0 py-1 rounded-lg text-white bg-[#05a0db]"
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
            <button className="font-avenir px-3 py-3 w-full  rounded-lg  bg-red-600 text-white">
              Close
            </button>
          </form>
          <button
            type="submit"
            className="font-avenir px-3 py-3 rounded-lg w-full  text-white bg-[#05a0db]"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  </dialog>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-400 mt-5">
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
               <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">  <label className="inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="sr-only"
    checked={account.status === "Active"}
    onChange={() => {
      const newStatus = account.status === "Active" ? "Disable" : "Active";
      handleUpdate2(account._id, newStatus);
    }}
  />
  <div
    className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${
      account.status === "Active" ? "bg-blue-700" : "bg-gray-500"
    }`}
  >
    <span
      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-linear transform ${
        account.status === "Active" ? "translate-x-6" : ""
      }`}
    ></span>
  </div>
</label>
</td>
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
                          className="bg-green-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                           onClick={() => setModalData(account)}
                         >
                         Edit
                         </button>
                         <button
                         className="bg-red-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(account._id)}
                        >
                          Delete
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
          <div className="mb-4">
            <label className="block text-black">Payment Date</label>
            <input
              type="date"
              name="paymentDate"
              defaultValue={modalData?.paymentDate}
              className="w-full border rounded p-2 mt-1 text-black bg-green-200 border-gray-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-500">Account Name</label>
            <input
              type="text"
              name="accountName"
              defaultValue={modalData.accountName}
              className="w-full border-2 border-black rounded p-2 mt-1 bg-white text-black"
              required
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
    
          <div className="modal-action grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              className="p-2 rounded-lg bg-red-600 text-white text-center"
              onClick={() => setModalData(null)}
            >
              Close
            </button>
            <button
              type="submit"
              className="p-2 rounded-lg bg-[#05a0db] text-white text-center"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </dialog>
    
      
       )}
        </div>
    );
};

export default AdsUserAdsAccount;