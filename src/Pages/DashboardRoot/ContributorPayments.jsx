import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast, ToastContainer } from "react-toastify";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";
import { FaEdit, FaMinusSquare, FaShare } from "react-icons/fa";
import useUserr from "../../Hook/useUser";
import useAllEmployee from "../../Hook/useAllEmployee";
import BalanceCard from "./BalanceCard";
import "react-datepicker/dist/react-datepicker.css";
import useContributorPaymentsPage from "../../Hook/useContributorPaymentsPage";
import useContributorPayPageTotal from "../../Hook/useContributorPayPageTotal";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { IoIosAddCircleOutline } from "react-icons/io";

const ContributorPayments = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [allEmployees] = useAllEmployee([]);
  const [payment, setModalData] = useState(null);
  const [payment2, setModalData2] = useState(null);

  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem(`acti35${user?.email}`) || "all" 
  : localStorage.getItem(`acti35${user?.email}`) || user?.email; 

  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

  const changeTab2 = (tab) => {
    setSelectedEmployee3(tab); 
    localStorage.setItem(`acti35${user?.email}`, tab); // Update localStorage
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const AxiosPublic=UseAxiosPublic()

  const initialStatus = localStorage.getItem("activeTabSelectedStatuss") || 'all';
  const [selectedStatus2, setSelectedStatus2] = useState(initialStatus);

  const changeTab3 = (tab) => {
    setSelectedStatus2(tab);
    localStorage.setItem("activeTabSelectedStatuss", tab);
  };

const [currentPage, setCurrentPage] = useState(1);

const initialTab = localStorage.getItem("activeTaballClientspayss") ;
const [sortMonth, setSortMonth] = useState(initialTab,'all'); 

const changeTab = (tab) => {
  setSortMonth(tab);
  localStorage.setItem("activeTaballClientspayss", tab); 
};

const [selectedYear, setSelectedYear] = useState(2025);

const { contributorPay, totalItems, totalPages, refetch } = useContributorPaymentsPage(
  selectedEmployee3, 
  selectedCategory || 'all',
  selectedStatus2 || 'all',
  sortMonth,
  currentPage,
  selectedYear,
);


const handlePageChange = (page) => {
  setCurrentPage(page);
  refetch();
};
  
const [totals] = useContributorPayPageTotal( selectedEmployee3, 
  selectedCategory || 'all',
  selectedStatus2 || 'all',
  sortMonth,
  currentPage,
  selectedYear)

  useEffect(() => {
    const filtered = contributorPay.filter((payment) => {
      const paymentDate = new Date(payment.date);
  
      const matchesStatus =
        selectedStatus2 === 'All' || payment.status === selectedStatus2;
  
      const matchesMonth =
        !sortMonth || paymentDate.getMonth() + 1 === parseInt(sortMonth);
  
      const matchesCategory =
        selectedCategory === 'All' ||
        selectedCategory === '' ||
        payment.paymentMethod === selectedCategory;
  
      const matchesYear =
        !selectedYear || paymentDate.getFullYear() === parseInt(selectedYear);
  
      return matchesStatus && matchesMonth && matchesCategory && matchesYear 
    });
  
    setFilteredData(filtered);
  }, [
    sortMonth,
    selectedCategory,
    contributorPay,
    selectedStatus2,
    selectedYear,
  ]);
  
  const itemsPerPage = 100;

const displayedItems = contributorPay?.sort((a, b) => new Date(b.date) - new Date(a.date))?.filter(f => {
  const itemMonth = new Date(f.date).getMonth() + 1;
  return (sortMonth == itemMonth || sortMonth === 'all') 
}).slice(0, currentPage * itemsPerPage);
  const isMoreItems = currentPage * itemsPerPage < filteredData.length;

  const handleUpdatePayment = (e, id, payment) => {
    e.preventDefault();

    const transactionId = e.target.transactionId.value;
    const payAmount = parseFloat(e.target.payAmount.value);
    const paymentMethod = e.target.paymentMethod.value;
    const status = 'pending';
    const updatedPaymentData = { status, payAmount, transactionId, paymentMethod };


    const datas = {
      title: `added ${payAmount} in in ${paymentMethod}`,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };

    AxiosPublic.patch(`/contributorPayment/${id}`,
      updatedPaymentData
    )
    .then(() => {
      refetch();
      setModalData(null)
      toast.success("Updated successful!");

      AxiosPublic.post("/activity", datas).then(() => {
      });

    })
    .catch(err => console.error("Error updating payment:", err));
  };
  
  const handleDelete = (id, note, paymentMethod, charge, payAmount, date) => {

    const datas = {
      title: `Deleted ${payAmount} from ${paymentMethod} `,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };

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

        AxiosPublic.delete(`/contributorPayment/${id}`)
          .then((res) => {
            toast.success("Delete successful!");
            refetch();
            AxiosPublic.post("/activity", datas).then(() => {
            });
          })
          .catch((error) => {
            toast.error("Failed to delete. Please try again.");
          });
      }
    });
  };

  const handleUpdate2 = (id, newStatus) => {
    const body = { status: newStatus };
  
    AxiosPublic.patch(`/contributorPayment/status/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
      })
      .catch((error) => {
        console.error("Error updating Payment:", error);
        toast.error("Failed to update Payment");
      });
  };



  const handlePayment2 = async (e) => {
    e.preventDefault();
    const employeeEmail= e.target.employeeEmail?.value
  
    try {
      const formData = new FormData(e.target);
      const { paymentMethod, amount, transactionId } = Object.fromEntries(formData.entries());
  
      const data = {
        employeeEmail: e.target.employeeEmail?.value || user?.email,
        employeeName: allEmployees.find(e => e.email === employeeEmail)?.name || user?.displayName,
        payAmount: parseFloat(amount),
        transactionId,
        paymentMethod: paymentMethod === "bkashPersonal" ? "bkashMarchent" : paymentMethod,
        date: new Date(),
        status: 'pending'
      };

      const datas = {
        title: `added ${amount} in in ${paymentMethod}`,
        date: new Date(),
        user: user?.displayName,
        email:user?.email
      };
  
      // ✅ Convert data to string before saving
      localStorage.setItem("pendingPayment", JSON.stringify(data));
      localStorage.removeItem("paymentPosted");
  
      if (paymentMethod === "bkashMarchent") {
        const createRes = await AxiosPublic.post("/create-payment", { amount });
        const { paymentID, bkashURL } = createRes.data;
  
        if (!paymentID || !bkashURL) throw new Error("Failed to create payment");
  
        window.location.href = bkashURL; // ✅ Redirect to bKash
      } else {
       
        const postRes = await AxiosPublic.post("/contributorPayment", data);

        if (postRes.status === 200) {
          toast.success("Send successful!");
          refetch();
          AxiosPublic.post("/activity", datas).then(() => {
          });
         
          document.getElementById("my_modal_9").close()
        } else {
          throw new Error("Failed to record payment");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Payment error");
    }
  };
  
  const cards = [
    { category: 'bkashMarchent', img: 'https://i.ibb.co/520Py6s/bkash-1.png', bgColor: '#ffe6f7' },
    { category: 'nagadPersonal', img: 'https://i.ibb.co/JQBQBcF/nagad-marchant.png', bgColor: '#fff2cc' },
    { category: 'rocketPersonal', img: 'https://i.ibb.co/QkTM4M3/rocket.png', bgColor: '#fff2cc' },
    { category: 'bank', img: 'https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png', bgColor: '#f2f2f2' },
    { category: 'DBBLBank', img: 'https://i.ibb.co/nnN8KW0/DBBL.png', bgColor: '#f2f2f2' },
    { category: 'IBBLBank', img: 'https://i.ibb.co.com/pnS6nt4/IBBLBank.png', bgColor: '#f2f2f2' },
  ];



    
  const [searchTerm, setSearchTerm] = useState(""); // initialize as an empty string


          const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(payment?.paymentMethod || '');
      
          useEffect(() => {
            if (payment) {
              setSelectedPaymentMethod(payment.paymentMethod);
            }
          }, [payment]);


              const [selectedMethod, setSelectedMethod] = useState("");
          
              const paymentMethods = [
                {
                  value: "bkashMarchent",
                  img: "https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png",
                },
                {
                  value: "bkashPersonal",
                  img: "https://i.ibb.co/520Py6s/bkash-1.png",
                },
                {
                  value: "nagadPersonal",
                  img: "https://i.ibb.co/JQBQBcF/nagad-marchant.png",
                },
          
                {
                  value: "bank",
                  img: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png",
                },
                {
                  value: "DBBLBank",
                  img: "https://i.ibb.co/nnN8KW0/DBBL.png",
                },
                {
                  value: "IBBLBank",
                  img: "https://i.ibb.co.com/pnS6nt4/IBBLBank.png",
                },
              ];


    // if (!displayedItems || displayedItems.length === 0) {
    //   return (
    //     <div className="flex justify-center items-center min-h-screen">
    //   <div className="loader"></div>
    // </div>
    //   );
    // }

  return (
    <div className="mb-20 lg:mb-0">
      <ToastContainer />



      <div className=" hidden lg:grid grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-4 my-5">
  {cards.map(({ category, img }) => (

<div onClick={() => setSelectedCategory(category)} key={category}>
  <BalanceCard 
    img={img} 
    amount={totals[category] || 0}
  />
</div>

  ))}

 
         <div 
                 onClick={() => setSelectedCategory('all')}
                 
                  className="card-div bg-[#ffffff] border border-gray-200 rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
                 >


                   <h1 className="px-3 text-black text-lg font-bold text-center">TOTAL</h1>


          <p className="card-title ">
  <span>৳ </span>
  {new Intl.NumberFormat('en-IN').format(
        Object.values(totals).reduce((sum, val) => sum + val, 0)
      )}
         </p>


         </div>


              </div>










     <div className=" my-5">

     <div className="lg:flex lg:justify-between text-black mb-5 hidden sm:block">


<div className="flex flex-col  sm:flex-row justify-between items-center gap-3">
  

    <div className="flex  items-center   justify-between ">
       
       <button
       className="add"
       onClick={() => document.getElementById("my_modal_9").showModal()}
       >
     <span className="font-bold text-lg">
                                          <IoIosAddCircleOutline />
                                        </span>
                                        <span className="inline ml-1">
                                        Pay Now
                             </span> 
       </button>
       
       </div>
  
  </div>

  <div className="lg:flex text-black lg:justify-start my-3 lg:my-0 lg:ml-5  items-center">
        
        <div className="flex mt-2  lg:mt-0 justify-center text-center gap-2 lg:gap-3 items-center">

{userr?.role === "admin" ? (
      <select
        
        className="select2"
        value={selectedEmployee3}
        onChange={(e) => changeTab2(e.target.value)}
      >
        <option value="all">Select Contributor</option>
        {allEmployees
          .filter((u) => u.role === "contributor")
          .map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
      </select>
              ) : (
             <></>
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

   
          <select
  className="select2 "
  value={selectedStatus2}
  onChange={(e) => changeTab3(e.target.value)}
>
  <option value="all">All Status</option>
  <option value="pending">Pending</option>
  <option value="Approved">Approved</option>
 
         </select>

        
        </div>
      
      </div>

        </div>



        <div className="  text-xs text-gray-700 mb-5 lg:hidden">




  {/* Search Input */}
  <div className="mb-2 grid grid-cols-2 gap-2">

  <button
       className="add"
       onClick={() => document.getElementById("my_modal_9").showModal()}
       >
       Pay Now
       </button>

    <input
      type="text"
      className="w-full border bg-white border-gray-300 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-xs"
      placeholder="Search by transection id..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  <div className="grid grid-cols-3 gap-2">



  {/* Digital Marketer Selector */}
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

  {/* Month Selector */}
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

  {/* Year Selector */}
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

</div>


         <div className="bg-white font-sans pt-16 lg:max-w-2xl lg:hidden mx-auto text-sm">
        
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
                            <p className="text-[10px] sm:text-xs text-gray-500">
                              TrxID: {payment.transactionId}
                            </p>
                          </div>
                          <div className="flex justify-start text-start items-center gap-1">
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
                        </div>
                      </div>
        
                      {/* Edit/Delete/Status */}
                      {/* <div className="inline-flex items-center text-green-800 px-1.5 py-1 sm:px-2 rounded-full text-[10px] sm:text-xs mt-2">
                        <div className="flex items-center gap-1">
                          <button className="edit"   onClick={() => setModalData(payment)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                          </button>
        
                          <button className="delete"    onClick={() => handleDelete(payment._id,payment?.note,payment.paymentMethod,payment?.charge,payment?.payAmount,payment.date)}>
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
      checked={payment.status !== "pending"}
      onChange={() => {
        const newStatus = payment.status !== "pending" ? "pending" : "Approved";
        handleUpdate2(payment._id, newStatus);
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
                          {payment?.payAmount?.toLocaleString()}
                        </h3>
                        
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
                  <p className="text-4xl font-extrabold text-pink-600 mt-2">৳ {payment2?.payAmount.toLocaleString()}</p>
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
       <div className="table-div  mt-5">
          <table className="min-w-full  text-center ">
            <thead>
              <tr className="tr1">
              <th className="text-center">{displayedItems?.length}</th>
              {
               userr?.role === 'admin' &&  
               <th className="text-start flex justify-start">Contributor Name</th>
              }

               <th className="text-center "> TransectionId</th>
              <th>Amount</th>
              <th className="text-center ">Payment Method</th>

             
               <th className="text-center "> Status</th>
               <th className="text-center "> Date</th>
               {
               userr?.role === 'admin' &&  
               <th className="text-center "> Status</th>
               }
            </tr>
          </thead>
          <tbody>
            {displayedItems?.map((payment, index) => (
               <tr 
               key={payment._id}
               className={`${
                 index % 2 === 0
                   ? "bg-white text-left text-black border-b border-opacity-20"
                   : "bg-gray-100  text-left text-black border-b border-opacity-20"
               }`}
             >


<td className="text-center">

{index +1}

</td>

              

                            
 {userr?.role === 'admin' &&
               
                <td>
                <div className='flex space-y-2 justify-start items-center gap-2'>
              <img className='h-10 w-10 rounded-full object-cover' src={allEmployees.find(f => f.email === payment.employeeEmail)?.photo} alt="" />
              <h1>  {payment.employeeName}
              <div className="f-start ">
                <button
                    className="delete"
                    onClick={() => handleDelete(payment._id,payment?.note,payment.paymentMethod,payment?.charge,payment?.payAmount,payment.date)}
                  >
                     <span >
                          <FaMinusSquare  />
                          </span>
                  </button>
                 <button
                  className=" edit"
                  onClick={() => setModalData(payment)}
                  >
                    <FaEdit />
                  </button>

                 </div>
              </h1>
              </div>
                 
                </td>
}  <td>
                 {payment.transactionId}
            </td>
                <td>
                <span className="amount-taka">৳ </span> {payment.payAmount}
                </td>
              

                <td>
  {[
    { 
      method: "bkashPersonal", 
      src: "https://i.ibb.co/520Py6s/bkash-1.png", 
      width: "w-24" 
    },
    { 
      method: "bkashMarchent", 
      src: "https://i.ibb.co/520Py6s/bkash-1.png", 
      width: "w-24" 
    },
    { 
      method: "rocketPersonal", 
      src: "https://i.ibb.co/QkTM4M3/rocket.png", 
      width: "w-24" 
    },
    { 
      method: "nagadPersonal", 
      src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png", 
      width: "w-24" 
    },
    { 
      method: "nagadMarchent", 
      src: "https://i.ibb.co/WsDkLzc/Nagad-Marchant.png", 
      width: "w-24" 
    },
    { 
      method: "DBBLBank", 
      src: "https://i.ibb.co.com/nnN8KW0/DBBL.png", 
      width: "w-32" 
    },
    { 
      method: "IBBLBank", 
      src: "https://i.ibb.co.com/pnS6nt4/IBBLBank.png", 
      width: "w-32" 
    },
    { 
      method: "bank", 
      src: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png", 
      width: "w-13", 
      height: "h-12" 
    },
  ].map(
    ({ method, src, width, height = "h-10" }) =>
      payment.paymentMethod === method && (
        <img
          key={method}
          className={`${height} ${width} flex my-auto items-center mx-auto justify-center`}
          src={src}
          alt={method}
        />
      )
  )}
               </td>

             
               <td>
  <span
    className={`font-semibold ${
      (payment?.status || "pending").toLowerCase() === "approved"
        ? "text-green-600"
        : (payment?.status || "pending").toLowerCase() === "pending"
        ? "text-red-500 animate-pulse"
        : "text-gray-600"
    }`}
  >
    {(payment?.status || "Pending").toLowerCase() === "pending"
      ? "Pending"
      : (payment?.status || "").toLowerCase() === "approved"
      ? "Approved"
      : payment?.status || "Pending"}
  </span>
</td>



<td>
  {new Date(payment.date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(/(am|pm)/i, (match) => match.toUpperCase())}
</td>


          
         
 

                {userr?.role === 'employee' &&
                <td className="text-center">
                  <h1 className={`${payment.status !== "pending" ? "text-blue-700 font-bold" : ""}`}> {payment?.status}</h1>
               
              </td>
                }
                 {
               userr?.role === 'admin' &&  
                <td>
                <label className="status-label">
    <input
      type="checkbox"
      className="sr-only"
      checked={payment.status !== "pending"}
      onChange={() => {
        const newStatus = payment.status !== "pending" ? "pending" : "Approved";
        handleUpdate2(payment._id, newStatus);
      }}
    />
    <div
      className={`status-switch ${payment.status !== "pending" ? "active" : "inactive"}`}
    >
      <span
        className={`status-switch-thumb ${payment.status !== "pending" ? "active" : ""}`}
      ></span>
    </div>
  </label>
                </td>
                }

                 
              </tr>
            ))}
            <tr className="font-bold tr1">
         
            {
            userr?.role === 'admin' ? 
            <td className="text-right" colSpan="3">
                  Total:
                </td> : <td className="text-right" colSpan="3">
                  Total:
                </td>
               }
              <td>
              <span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2, // To ensure two decimal places if required
  }).format(
    displayedItems
      .reduce((acc, item) => acc + (isNaN(parseFloat(item?.payAmount)) ? 0 : parseFloat(item?.payAmount)), 0)
  )}
</td>

              <td></td> 
               <td></td>
             
               {
               userr?.role === 'admin' &&  
               <td></td>
               }
               {
               userr?.role === 'admin' &&  
               <td></td>
               }
              
             
             
            </tr>
          </tbody>
        </table>
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


<dialog id="my_modal_9" className="modal">
  <div className="modal-box text-black bg-white max-w-md">
    <form onSubmit={handlePayment2} className="space-y-6">

      {/* Modal Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-2xl text-gray-800">Make Payment</h3>
        <button
          type="button"
          onClick={() => document.getElementById("my_modal_9").close()}
          className="text-gray-500 hover:text-red-600 transition-colors"
        >
          ✕
        </button>
      </div>



      {/* Amount Input */}
      <div className="space-y-2">
        <label className="label-title">Amount (BDT)</label>
        <div className="relative">
          <input
            type="number"
            name="amount"
            min="1"
            required
            placeholder="Enter amount"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
          <span className="absolute left-4 top-3 text-gray-500">৳</span>
        </div>
      </div>

      <div>
      {userr?.role === "admin" && (
        <div className="mb-4 space-y-2">
          <label className="label-title">Select Contributor</label>
          <select className="border border-gray-300 bg-white p-3 rounded-lg w-full" name="employeeEmail">
            {allEmployees
              ?.filter((f) => f.role === "contributor")
              .map(({ _id, email, name }) => (
                <option key={_id} value={email}>
                  {name}
                </option>
              ))}
          </select>
        </div>
      )}
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
{/* Conditional TransactionId Field */}
{selectedMethod && selectedMethod !== "bkashMarchent" && (
  <div className="space-y-2">
    <label className="label-title">TransactionId</label>
    <div className="relative">
      <input
        type="text"
        name="transactionId"
        required
        placeholder="Enter TransactionId"
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      />
      <span className="absolute left-4 top-3 text-gray-500">৳</span>
    </div>
  </div>
)}

<h4 className="label-title">Select Payment Method</h4>

<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
  {paymentMethods.map(({ value, img }) => (
    <label
      key={value}
      className="relative flex items-center justify-center px-3 py-2 border-2 rounded-xl cursor-pointer transition-all duration-300 bg-white shadow-sm hover:shadow-lg hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 space-x-2"
    >
      <input
        type="radio"
        name="paymentMethod"
        value={value}
        onChange={(e) => setSelectedMethod(e.target.value)}
        className="appearance-none w-5 h-5 border border-gray-300 rounded-full checked:border-blue-600 checked:bg-blue-600 transition"
        required
      />
      <div className="w-14 h-10 flex items-center justify-center">
        <img src={img} alt={value} className="max-w-full max-h-full object-contain" />
      </div>

      <div className="absolute top-2 right-2 hidden has-[:checked]:block">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </label>
  ))}
</div>
</div>



      {/* Action Buttons */}
      <div className="grid lg:grid-cols-2 gap-3 w-full mt-8">
        <button
          type="button"
          onClick={() => document.getElementById("my_modal_9").close()}
          className="cancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="add"
        >
          Confirm Payment
        </button>
      </div>
    </form>
  </div>
</dialog>


          {payment && (
          <dialog className="modal" open>
            <div className="modal-box text-black bg-white font-bold">
            <form onSubmit={(e) => handleUpdatePayment(e, payment._id, payment)}>
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
                      { label: "Amount", type: "number", name: "payAmount", value: payment?.payAmount },
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
                        { value: "nagadPersonal", img: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" },
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

      </div>
      {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}
    </div>
  );
};

export default ContributorPayments;
