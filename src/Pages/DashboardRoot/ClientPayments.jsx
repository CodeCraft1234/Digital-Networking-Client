import { useContext, useEffect, useState } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaEdit, FaMinusSquare, FaShare } from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "../../Security/AuthProvider";
import BalanceCard from "./BalanceCard";
import useUserr from "../../Hook/useUser";
import useClientsPage from "../../Hook/useClientsPage";
import useClientsPaymentsPage from "../../Hook/useClientPaymentsPage";
import useAllEmployee from "../../Hook/useAllEmployee";
import { ImCross } from "react-icons/im";
import { Dialog } from "@headlessui/react";
import { MdSearch, MdTune } from "react-icons/md";

const ClientPayments = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [payment, setModalData] = useState(null);
  const [payment2, setModalData2] = useState(null);

  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem(`acti${user?.email}`) || "all" 
  : localStorage.getItem(`acti${user?.email}`) || user?.email; 

const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab); // Update the state
    localStorage.setItem(`acti${user?.email}`, tab); // Update localStorage
  };

  const AxiosPublic = UseAxiosPublic();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const initialTab = localStorage.getItem("activeTabclientpayMont") || new Date().getMonth() + 1;
  const [sortMonth, setSortMonth] = useState(initialTab);
  
  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTabclientpayMont", tab);
  };


    const initialStatus = localStorage.getItem("activeTabSelectedStatuss") || 'all';
    const [selectedStatus2, setSelectedStatus2] = useState(initialStatus);
  
    const changeTab2 = (tab) => {
      setSelectedStatus2(tab);
      localStorage.setItem("activeTabSelectedStatuss4", tab);
    };
  

  const [currentPage, setCurrentPage] = useState(1);

  const {
    clientPayments,
    totalItems,
    totalPages,
    refetch
  } = useClientsPaymentsPage(
    selectedEmployee3,
    selectedCategory || 'all',
    currentPage,
    sortMonth,
    selectedYear,
    userr,
    selectedStatus2
  );
  
  
const [client] = useClientsPage(selectedEmployee3, currentPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch();
  };
  
  const itemsPerPage = 100;

  const [searchTerm, setSearchTerm] = useState(""); // initialize as an empty string

  const displayedItems = clientPayments
  .filter(f => {
    if (!searchTerm) return true; // Show all data when no search term
    return f.transactionId && f.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, currentPage * itemsPerPage);

  
  const isMoreItems = currentPage * itemsPerPage < client.length;


  const handledelete = (ids, id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            AxiosPublic.delete(`/clientPayment/delete/${id}/${ids}`)
                .then((res) => {
                    toast.success("Campaign deleted successfully!");
                    refetch(); // Refresh data after deletion
                })
                .catch((error) => {
                    console.error("Error deleting campaign:", error);
                    toast.error("Failed to delete the campaign. Please try again.");
                });
        }
    });
};


   const handleUpdatePayment = async (e, ids, id) => {
     e.preventDefault();
     const amount = parseFloat(e.target.amount.value);
     const transactionId = e.target.transactionId.value;
     const paymentMethod = e.target.paymentMethod.value;
     const body = { amount, transactionId, paymentMethod };
     const datas = { title: `Update Payment ${amount} from in ${paymentMethod}`, date: new Date(), user: user?.displayName,
     photo: user?.photoURL, };
   
     AxiosPublic.patch(`/clientPaymentsUp/updates/${id}/${ids}`, body)
       .then((res) => {
         refetch();
         setModalData(null); 
         toast.success(`Payment updated: ${amount} from via ${paymentMethod}`);
         return AxiosPublic.post("/activity", datas); // Ensure the post request is made after the patch
       })
       .catch((error) => {
         console.error("Error updating payment:", error);
         toast.error(`Failed to update payment: ${error?.response?.data?.message || "An error occurred"}`);
       });
   };

   const paymentMethods = [
     { key: "bkashMarchent", label: "Bkash Merchent", img: "https://i.ibb.co/520Py6s/bkash-1.png" },
     { key: "nagadMarchent", label: "Nagad Marchent", img: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" },
     { key: "rocketPersonal", label: "Rocket Personal", img: "https://i.ibb.co/QkTM4M3/rocket.png" },
     { key: "bank", label: "Bank", img: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" },
     { key: "DBBLBank", label: "DBBL Bank", img: "https://i.ibb.co/vH2fPBm/DBBLBank.png" },
     { key: "IBBLBank", label: "IBBL Bank", img: "https://i.ibb.co/pnS6nt4/IBBLBank.png" },
   ];

   const [allEmployees] = useAllEmployee([]);


    const handleUpdate2 = (ids, id, newStatus) => {
      const body = { status: newStatus };
    
      AxiosPublic.patch(`/clientPaymentsUp/updates2/${id}/${ids}`, body)
        .then((res) => {
          console.log(res.data);
          refetch();
        })
        .catch((error) => {
          console.error("Error updating Payment:", error);
          toast.error("Failed to update Payment");
        });
    };
   
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(payment?.paymentMethod || '');

    useEffect(() => {
      if (payment) {
        setSelectedPaymentMethod(payment.paymentMethod);
      }
    }, [payment]);


    console.log(displayedItems,clientPayments);

    // if (!displayedItems || displayedItems.length === 0) {
    //   return (
    //     <div className="flex justify-center items-center min-h-screen">
    //   <div className="loader"></div>
    // </div>
    //   );
    // }

  return (
    <div className="mb-20 lg:mb-0">


<div className=" hidden lg:grid grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-4 my-5">
{paymentMethods.map(({ key, label, img }) => {
  const filteredItems = displayedItems.filter(f => f.paymentMethod === key);
  const totalAmount = filteredItems.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
  
  return (
    <div key={key} onClick={() => setSelectedCategory(key)}>
      <BalanceCard img={img} amount={totalAmount || 0} />
    </div>
  );
})}


      {/* Total Balance Card */}
      <div
       onClick={() => setSelectedCategory('all')}
         className="card-div bg-[#ffffff] border border-gray-200 rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
      >
        <h1 className="px-3 text-black text-xl font-bold text-center">TOTAL </h1>
        <p className="card-title">
          <span>৳ </span>  {new Intl.NumberFormat('en-IN').format(displayedItems?.reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    ).toFixed(0))}
          {}
        </p>
      </div>
    </div>

<div className='' >

<div className="lg:flex lg:justify-end text-black mb-5 hidden sm:block">


<div className="flex flex-col  sm:flex-row justify-end items-center gap-3">

    <input
      type="text"
      className="select2"
      placeholder="Search by transection id..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />




{userr?.role === "admin" && (
  <select className="select2" value={selectedEmployee3} onChange={(e) => changeTab3(e.target.value)}>
    <option value="all">Select Digital Marketer</option>
    {allEmployees?.filter((u) => u.role === "employee").map((e) => (
      <option key={e._id} value={e.email}>{e.name}</option>
    ))}
  </select>
)}

<select className="select2" value={sortMonth} onChange={(e) => changeTab(e.target.value)}>
<option  value='all'>Select Month</option>
  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    .map((month, i) => <option key={i} value={i + 1}>{month}</option>)}
</select>

<select
  className="select2"
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
>
  <option value="all">Select Year</option> {/* Default option */}
  {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2024 + i).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>

<select className="select2" value={selectedStatus2} onChange={(e) => changeTab2(e.target.value)}>
  <option value="all">Select Status</option>
  <option value="Approved">Approved</option>
  <option value="pending">Pending</option>
</select>

</div>
</div>


{/* <div className="  text-xs text-gray-700 mb-5 lg:hidden">
  <div className="mb-2">
    <input
      type="text"
      className="w-full border bg-white border-gray-300 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-xs"
      placeholder="Search by transection id..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  <div className="grid grid-cols-3 gap-2">

  {userr?.role === "admin" && (
    <select
      className="border bg-white border-gray-300 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-xs"
      value={selectedEmployee3}
      onChange={(e) => changeTab3(e.target.value)}
    >
      <option value="all">Marketer</option>
      {allEmployees?.filter((u) => u.role === "employee").map((e) => (
        <option key={e._id} value={e.email}>{e.name}</option>
      ))}
    </select>
  )}

  <select
    className="border bg-white border-gray-300 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-xs"
    value={sortMonth}
    onChange={(e) => changeTab(e.target.value)}
  >
    <option value="all">Month</option>
    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      .map((month, i) => (
        <option key={i} value={i + 1}>{month}</option>
      ))}
  </select>

  <select
    className="border bg-white border-gray-300 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-xs"
    value={selectedYear}
    onChange={(e) => setSelectedYear(e.target.value)}
  >
    <option value="all">Year</option>
    {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2024 + i).map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
  </div>

</div> */}





<div className="bg-white font-sans pt-40  lg:mt-0 lg:max-w-2xl lg:hidden mx-auto text-sm">





      {displayedItems.map((payment) => (
        <div key={payment._id} className="px-3 py-2 sm:px-4 sm:py-3 border-b hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex items-start justify-start text-start gap-2 sm:gap-3">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"
                    src={allEmployees.find(f => f.email === payment.employeeEmail)?.photo}
                    alt=""
                  />

<label className="status-label mt-3">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={(payment?.status || "Approved") !== "pending"}
                    onChange={() => {
                      const currentStatus = payment?.status || "Approved";
                      const newStatus = currentStatus !== "pending" ? "pending" : "Approved";
                      handleUpdate2(payment.ids, payment.id, newStatus);
                    }}
                  />
                  <div className={`status-switch ${(payment?.status || "Approved") !== "pending" ? "active" : "inactive"}`}>
                    <span className={`status-switch-thumb ${(payment?.status || "Approved") !== "pending" ? "active" : ""}`}></span>
                  </div>
                </label>
                </div>

                {/* Names */}
                <div className="flex flex-col text-start justify-start items-start">
                <div className="flex justify-start text-start items-center gap-1">
                    <Link
                      to={`/client/${payment?.clientEmail}`}
                      className="text-black text-sm sm:text-base hover:text-blue-800 transition-colors"
                    >
                      {allEmployees.find(f => f.email === payment.employeeEmail)?.name}
                    </Link>
                  </div>
                  <div className="flex justify-start text-start items-center gap-1">
                    <Link
                      to={`/client/${payment?.clientEmail}`}
                      className="text-[14px] sm:text-xs text-gray-500"
                    >
                      {payment?.clientName}
                    </Link>
                  </div>
                  
                  <div className="flex justify-start text-start items-center gap-1">
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      TrxID: {payment.transactionId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit/Delete/Status */}
              {/* <div className="inline-flex items-center text-green-800 px-1.5 py-1 sm:px-2 rounded-full text-[10px] sm:text-xs mt-2">
                <div className="flex items-center gap-1">
                  <button className="edit" onClick={() => setModalData(payment)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>

                  <button className="delete" onClick={() => handledelete(payment.ids, payment.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                    </svg>
                  </button>
                </div>

                <label className="status-label ml-2">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={(payment?.status || "Approved") !== "pending"}
                    onChange={() => {
                      const currentStatus = payment?.status || "Approved";
                      const newStatus = currentStatus !== "pending" ? "pending" : "Approved";
                      handleUpdate2(payment.ids, payment.id, newStatus);
                    }}
                  />
                  <div className={`status-switch ${(payment?.status || "Approved") !== "pending" ? "active" : "inactive"}`}>
                    <span className={`status-switch-thumb ${(payment?.status || "Approved") !== "pending" ? "active" : ""}`}></span>
                  </div>
                </label>
              </div> */}
            </div>

            {/* Right Content */}
            <div className="text-right">
              {/* Amount and Date */}
              <div>
                <h3 className="font-semibold text-emerald-600 text-sm sm:text-base">
                  <span className="text-sm sm:text-base font-extrabold mr-1">৳</span>
                  {payment.amount.toLocaleString()}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {new Date(payment.date).toLocaleString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </p>
              </div>

              {/* Payment Method Logo and Button */}
              <div className="flex items-center justify-end space-x-2 mt-2">
                {(() => {
                  const logo = [
                    { method: "bkashMarchent", src: "https://i.ibb.co/520Py6s/bkash-1.png" },
                    { method: "bkashPersonal", src: "https://i.ibb.co/520Py6s/bkash-1.png" },
                    { method: "rocketPersonal", src: "https://i.ibb.co/QkTM4M3/rocket.png" },
                    { method: "nagadPersonal", src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" },
                    { method: "nagadMarchent", src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" },
                    { method: "DBBLBank", src: "https://i.ibb.co/nnN8KW0/DBBL.png", width: "w-24 sm:w-28", height: "h-7 sm:h-8" },
                    { method: "IBBLBank", src: "https://i.ibb.co/pnS6nt4/IBBLBank.png", width: "w-24 sm:w-28", height: "h-7 sm:h-8" },
                    { method: "bank", src: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png", width: "w-10 sm:w-12", height: "h-8 sm:h-10" },
                  ].find((item) => item.method === payment?.paymentMethod);

                  if (!logo) return null;

                  return (
                    <>
                      <img
                        src={logo.src}
                        alt={payment?.paymentMethod}
                        className={`${logo.width || "w-12"} ${logo.height || "h-6"} object-contain`}
                      />
                      <button
                        onClick={() => setModalData2(payment)}
                        className="text-emerald-600 hover:text-emerald-800 transition"
                        title="বিস্তারিত দেখুন"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 bg-gray-100 text-black p-1 rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}


      {payment2 && (
  <Dialog open={!!payment2} onClose={() => setModalData2(null)} className="relative z-50">
    {/* Overlay */}
    <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

    {/* Bottom Sheet */}
    <div className="fixed bottom-0 left-0 right-0 flex justify-center px-4 pb-4">
      <Dialog.Panel className="w-full max-w-md bg-white rounded-t-2xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
          <button onClick={() => setModalData2(null)} className="text-red-500 font-semibold text-sm">
            ✖️ Close
          </button>
        </div>

        {/* Amount + Status */}
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">Transaction Amount</p>
          <p className="text-4xl font-extrabold text-pink-600 mt-2">৳ {payment2?.amount?.toFixed(2)}</p>
          <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
            ✅ {payment2?.status || "Approved"}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Transaction Information */}
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1">
              👤 Client Name
            </span>
            <span className="text-right">{payment2?.clientName || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1">
              🧾 Transaction ID
            </span>
            <span className="text-right break-words">{payment2?.transactionId || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1">
              💳 Payment Method
            </span>
            <span className="text-right capitalize">{payment2?.paymentMethod || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1">
              📅 Date & Time
            </span>
            <span className="text-right">
              {new Date(payment2?.date).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Share Button */}
        <button className="flex items-center justify-center w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition">
          <FaShare className="mr-2" />
          Share Transaction
        </button>

      </Dialog.Panel>
    </div>
  </Dialog>
)}




    </div>



<div className=" lg:block hidden ">

<div className="table-div  mb-5">

        <div className="">

        
          <table className="min-w-full text-center  rounded-lg">
            <thead className=" ">
              <tr className="tr1">
              <th className="text-center">{displayedItems?.length}</th>
             
                  <th className="text-start flex justify-start"> Employee Name</th>
                
             
              <th>Transection ID
              </th>
              <th> Amount</th>
              <th className="text-center">Payment Method</th>
              <th>Date</th>
              <th>Status</th>
        
             
            </tr>
          </thead>
          <tbody>
          {clientPayments?.sort((a, b) => new Date(b.date) - new Date(a.date)).map((payment, index) => (
              <tr
              key={payment?._id}
              className={`${
                index % 2 === 0
                  ? "bg-white text-left text-black border-b border-opacity-20"
                  : "bg-gray-100  text-left text-black border-b border-opacity-20"
              }`}
            >
              <td className="text-center">

{index +1}

</td>
               
              
                <td className="text-left">
                <div className='flex justify-start items-center gap-2'>
              <img className='h-10 w-10 rounded-full object-cover' src={allEmployees.find(f => f.email === payment.employeeEmail)?.photo} alt="" />

              <div>

              <div className="f-start">
                <Link  to={`/client/${payment?.clientEmail}`}>
                {payment?.clientName}
                </Link>
                <button
className=" edit"
onClick={() => setModalData(payment)}
>
<FaEdit  />
</button>

                </div>
                
              <h1>  {allEmployees.find(f => f.email === payment.employeeEmail)?.name}</h1>
              </div>
              </div>
                </td>

               
              

                <td>
                 {payment.transactionId}
            </td>

                <td
>
<span className="amount-taka">৳ </span> {payment?.amount || 0}
               </td>
               <td>
  {[
    { 
      method: "bkashMarchent", 
      src: "https://i.ibb.co/520Py6s/bkash-1.png" 
    },
    { 
      method: "", 
      src: "https://i.ibb.co/520Py6s/bkash-1.png" 
    },
    { 
      method: "rocketPersonal", 
      src: "https://i.ibb.co/QkTM4M3/rocket.png" 
    },
    { 
      method: "nagadPersonal", 
      src: "https://i.ibb.co.com/tTQgKCkQ/images-3.png" 
    },
    { 
      method: "nagadMarchent", 
      src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" 
    },
    { 
      method: "DBBLBank", 
      src: "https://i.ibb.co/nnN8KW0/DBBL.png", 
      width: "w-32", 
      height: "h-10" 
    },
    { 
      method: "IBBLBank", 
      src: "https://i.ibb.co.com/pnS6nt4/IBBLBank.png", 
      width: "w-32", 
      height: "h-10" 
    },
    { 
      method: "bank", 
      src: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png", 
      width: "w-13", 
      height: "h-12" 
    },
  ].map(
    ({ method, src, width = "w-24", height = "h-10" }) =>
      payment?.paymentMethod === method && (
        <img
          key={method}
          className={`${height} ${width} flex my-auto items-center mx-auto justify-center`}
          src={src}
          alt={method}
        />
      )
  )}
</td>

         
            <td >
            {new Date(payment.date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(/(am|pm)/i, (match) => match.toUpperCase())}
                </td>

                <td>

                  <label className="status-label">
  <input
    type="checkbox"
    className="sr-only"
    checked={payment?.status === "Approved"}
    onChange={() => {
      const currentStatus = payment?.status === "Approved" ? "Approved" : "pending";
      const newStatus = currentStatus === "Approved" ? "pending" : "Approved";
      handleUpdate2(payment.ids, payment.id, newStatus);
    }}
  />
  <div
    className={`status-switch ${payment?.status === "Approved" ? "active" : "inactive"}`}
  >
    <span
      className={`status-switch-thumb ${payment?.status === "Approved" ? "active" : ""}`}
    ></span>
  </div>
</label>



                </td>

              </tr>
            ))}
          </tbody>
          <tr  className="font-bold  tr1">
          {
            userr?.role === 'admin' ? 
            <td className="text-right" colSpan="3">
                  Total:
                </td> : <td className="text-right" colSpan="2">
                  Total:
                </td>
               }
            <td>
            <span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(displayedItems?.reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    ).toFixed(0))}
            </td>
            <td ></td>
            <td ></td>
            <td ></td>
          
           
          </tr>
        </table>

     

      </div>


      </div>
      
      </div>


      <div className="flex items-center justify-center my-5 space-x-1">
  {/* Previous Button */}
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-2 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm ${
      currentPage === 1
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-800"
    }`}
  >
    Previous
  </button>

  {/* Page Numbers */}
  {(() => {
    const buttons = [];
    let startPage, endPage;

    if (totalPages <= 3) {
      startPage = 1;
      endPage = totalPages;
    } else {
      startPage = Math.max(currentPage - 1, 1);
      endPage = Math.min(currentPage + 1, totalPages);

      if (currentPage === 1) {
        startPage = 1;
        endPage = 3;
      }
      if (currentPage === totalPages) {
        startPage = totalPages - 2;
        endPage = totalPages;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm ${
            currentPage === i
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-red-600 hover:text-white"
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  })()}

  {/* Next Button */}
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-2 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm ${
      currentPage === totalPages
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-800"
    }`}
  >
    Next
  </button>
</div>



      </div>


      {payment && (
  <dialog className="modal" open>
    <div className="modal-box text-black bg-white font-bold">
    <form onSubmit={(e) => handleUpdatePayment(e, payment.ids, payment.id)}>
        {/* Modal Header */}
        <h1
          className="text-black flex justify-end hover:text-red-500"
          onClick={() => setModalData(null)}
        >
          <ImCross />
        </h1>
        <h2 className="text-xl font-bold">Edit Contributor Pay Amount</h2>

        {/* Form Body */}
        <div className="space-y-4">

          {/* Amount & Transaction ID */}
          <div className="grid lg:grid-cols-2 gap-4">
            {[
              { label: "Amount", type: "number", name: "amount", value: payment?.amount },
              { label: "TransactionId", type: "text", name: "transactionId", value: payment?.transactionId, placeholder: "TransactionId" }
            ].map(({ label, type, name, value, placeholder }, idx) => (
              <div key={idx}>
                <label className="block text-left text-gray-700">{label}</label>
                <input
                  type={type}
                  name={name}
                  defaultValue={value}
                  placeholder={placeholder}
                  className="w-full border bg-white border-black rounded p-2 mt-1"
                />
              </div>
            ))}
          </div>

          {/* Payment Method (Radio Buttons) */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-start text-gray-800">Select Payment Method</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
              {[
                { value: "bkashMarchent", img: "https://i.ibb.co/520Py6s/bkash-1.png" },
                { value: "nagadMarchent", img: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" },
                { value: "rocketPersonal", img: "https://i.ibb.co/QkTM4M3/rocket.png" },
                { value: "bank", img: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" },
                { value: "DBBLBank", img: "https://i.ibb.co/nnN8KW0/DBBL.png" },
                { value: "IBBLBank", img: "https://i.ibb.co.com/pnS6nt4/IBBLBank.png" },
              ].map(({ value, img }) => (
                <label
                  key={value}
                  className="relative flex items-center justify-center px-3 py-2 border-2 rounded-xl cursor-pointer transition-all duration-300 bg-white shadow-sm hover:shadow-lg hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 space-x-2"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={selectedPaymentMethod === value}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="appearance-none w-5 h-5 border border-gray-300 rounded-full checked:border-blue-600 checked:bg-blue-600 transition"
                    required
                  />
                  <div className="w-14 h-10 flex items-center justify-center">
                    <img
                      src={img}
                      alt={value}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Active state overlay */}
                  <div className="absolute top-2 right-2 hidden has-[:checked]:block">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="modal-action grid grid-cols-2 gap-3 mt-4">
          {[
            { label: "Close", className: "bg-red-600 hover:bg-red-700", action: () => setModalData(null) },
            { label: "Update", className: "bg-[#05a0db] hover:bg-indigo-700", action: null, type: "submit" }
          ].map(({ label, className, action, type }, idx) => (
            <button
              key={idx}
              type={type || "button"}
              className={`p-2 rounded-lg text-white ${className}`}
              onClick={action}
            >
              {label}
            </button>
          ))}
        </div>
      </form>
    </div>
  </dialog>
)}
        {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}
    </div>
  );
};

export default ClientPayments;
