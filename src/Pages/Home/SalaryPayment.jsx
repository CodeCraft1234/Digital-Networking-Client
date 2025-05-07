import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast, ToastContainer } from "react-toastify";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";
import { FaEdit, FaMinusSquare, FaShare } from "react-icons/fa";
import useUserr from "../../Hook/useUser";
import useMySalaryPayments from "../../Hook/useMySalaryPayment";
import useAllEmployee from "../../Hook/useAllEmployee";
import BalanceCard from "../DashboardRoot/BalanceCard";
import useSalaryPayPageTotal from "../../Hook/useSalaryPayPageTotal";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";


const SalaryPayments = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [allEmployees] = useAllEmployee([]);
  const [payment, setModalData] = useState(null);
  const [payment2, setModalData2] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  const initialTab5 =
  userr?.role === "admin"
  ? localStorage.getItem("a99") || "all" 
  : localStorage.getItem("a99") || user?.email; 
  const [selectedRole, setSelectedRole] = useState(initialTab5);

  const changeTab5 = (tab) => {
    setSelectedRole(tab);
    localStorage.setItem("a99", tab);
  };

  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem(`ac${user?.email}`) || "all" 
  : localStorage.getItem(`ac${user?.email}`) || user?.email; 

  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

  const changeTab2 = (tab) => {
    setSelectedEmployee3(tab); 
    localStorage.setItem(`ac${user?.email}`, tab); 
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  
  const [MySalaryPayment, totalCount, totalPages, refetch] = useMySalaryPayments(selectedEmployee3, currentPage, itemsPerPage);

  console.log(MySalaryPayment,itemsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const AxiosPublic=UseAxiosPublic()

  const initialTab = localStorage.getItem("activeTaballClientspayss") ;
  const [sortMonth, setSortMonth] = useState(initialTab || (new Date().getMonth() + 1).toString()); 
  
  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballClientspayss", tab); 
  };



  useEffect(() => {
    const filtered = MySalaryPayment.filter((payment) => {
      const paymentDate = new Date(payment.date);
      const matchesMonth = !sortMonth || sortMonth === 'all' || paymentDate.getMonth() + 1 === parseInt(sortMonth);
      const matchesCategory = !selectedCategory || selectedCategory === 'all' || payment.paymentMethod === selectedCategory;
      const matchesYear = !selectedYear || paymentDate.getFullYear() === parseInt(selectedYear);
      return matchesMonth && matchesCategory && matchesYear;
    });
  
    setFilteredData(filtered);
  }, [
    sortMonth,
    selectedCategory,
    MySalaryPayment,
    selectedYear,
  ]);

  

  const displayedItems = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, currentPage * itemsPerPage);
  const isMoreItems = currentPage * itemsPerPage < filteredData.length;


  const handlePayment = async (e) => {
    e.preventDefault();
    const employeeEmail = e.target.employeeEmail?.value || user?.email;
    const employeeName = allEmployees?.find(e => e.email === employeeEmail)?.name || user?.displayName;
    const payAmount = e.target.payAmount.value;
    const date = new Date()
    const paymentMethod = e.target.paymentMethod.value;

    const data = {
      employeeName,
      employeeEmail,
      payAmount,
      paymentMethod,
      date,
    };

    const datas = {
      title: `added ${payAmount} in in ${paymentMethod}`,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };

    AxiosPublic.post("/salaryPayment",
      data
    )
      .then((res) => {
        toast.success("Send successful!");
        refetch();
        AxiosPublic.post("/activity", datas).then(() => {
        });
        console.log(res.data);
        document.getElementById("my_modal_1").close()
       
      })

  };

  const handleUpdatePayment = (e, id, payment) => {
    e.preventDefault();
  
    const payAmount = parseFloat(e.target.payAmount.value);
    const paymentMethod = e.target.paymentMethod.value;
    const updatedPaymentData = { payAmount, paymentMethod };

    const datas = {
      title: `added ${payAmount} in in ${paymentMethod}`,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };

    AxiosPublic.patch(`/salaryPayment/${id}`,
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

        AxiosPublic.delete(`/salaryPayment/${id}`)
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


  const [salaryTotals] = useSalaryPayPageTotal( selectedEmployee3, 
    selectedCategory || 'all',
    sortMonth,
    currentPage,
    selectedYear)

    const cards = [
      { category: 'bkashPersonal', img: 'https://i.ibb.co/520Py6s/bkash-1.png', bgColor: '#ffe6f7' },
      { category: 'nagadPersonal', img: 'https://i.ibb.co/JQBQBcF/nagad-marchant.png', bgColor: '#fff2cc' },
      { category: 'bank', img: 'https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png', bgColor: '#f2f2f2' },
      { category: 'DBBLBank', img: 'https://i.ibb.co/nnN8KW0/DBBL.png', bgColor: '#f2f2f2' },
      { category: 'IBBLBank', img: 'https://i.ibb.co.com/pnS6nt4/IBBLBank.png', bgColor: '#f2f2f2' },
    ];



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


        const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(payment?.paymentMethod || '');
    
        useEffect(() => {
          if (payment) {
            setSelectedPaymentMethod(payment.paymentMethod);
          }
        }, [payment]);


    // if (!MySalaryPayment || MySalaryPayment.length === 0) {
    //   return (
    //     <div className="flex justify-center items-center min-h-screen">
    //   <div className="loader"></div>
    // </div>
    //   );
    // }

  return (
    <div className="pb-20 lg:mb-0">
      <ToastContainer />

        <div className="hidden lg:grid grid-cols-2 rounded-lg sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 lg:grid-cols-6 ">
  {cards.map(({ category, img }) => (

<div onClick={() => setSelectedCategory(category)} key={category}>
  <BalanceCard 
    img={img} 
    amount={salaryTotals[category] || 0}
  />
</div>

  ))}


<div 
                 onClick={() => setSelectedCategory('all')}
                
                    className="card-div bg-[#ffffff] border border-gray-200 rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
                 >
                   <h1 className="px-3 text-black text-xl font-bold text-center">TOTAL BDT</h1>
                   <p className="card-title ">
  <span>৳ </span>
  {new Intl.NumberFormat('en-IN').format(
        Object.values(salaryTotals).reduce((sum, val) => sum + val, 0)
      )}
</p>

         </div>

        </div>


     <div className="my-5">

     <div className="lg:flex lg:justify-between text-black mb-5 hidden sm:block">
<div>
{
        userr?.role === 'admin' &&      <div className="f-start">

        <button
          className="add"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
            <span className="font-bold text-lg">
                                     <IoIosAddCircleOutline />
                                   </span>
                                   <span className="inline ml-1">
                                   Pay Now
                        </span> 
          
        </button>
    
      
         </div>
      }
</div>

     <div className="lg:ml-5 f-start">
    <div className="f-center">


    <div className='f-end'>



    <select
  className="select2"
  value={selectedEmployee3}
  onChange={(e) => changeTab2(e.target.value)}
>
  <option value="all">
    All
  </option>

  {allEmployees
    .filter((u) => u.role !== 'contributor' && u.role !== 'admin') // Fix here
    .map((employee) => (
      <option key={employee._id} value={employee.email}>
        {employee.name}
      </option>
    ))}
</select>

    </div>


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
  <option value="">Select Year</option> {/* Default option */}
  {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2024 + i).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>



    </div>
     </div>

        </div>















        <div className="  text-xs text-gray-700 mb-5 lg:hidden">




{/* Search Input */}
<div className="mb-2 grid grid-cols-2 gap-2">

{
        userr?.role === 'admin' &&      <div className="f-start">

        <button
          className="add"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
            <span className="font-bold text-lg">
                                     <IoIosAddCircleOutline />
                                   </span>
                                   <span className="inline ml-1">
                                   Pay Salary
                        </span> 
          
        </button>
    
      
         </div>
      }

  <input
    type="text"
    className="w-full border bg-white border-gray-300 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-xs"
    placeholder="Search by transection id..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

<div className="grid grid-cols-3 gap-2">


<select
    className="border bg-white border-gray-300 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-xs"
    value={selectedEmployee3}
          onChange={(e) => changeTab2(e.target.value)}
>
<option value="all">
  All{" "}
  {selectedRole === "employee"
    ? "Marketer"
    : selectedRole === "graphicDesigner"
    ? "Graphic Designer"
    : selectedRole === "webDeveloper"
    ? "Web Developer"
    : "Users"}
</option>

    {allEmployees
        .filter((u) => [selectedRole].includes(u.role))
        .map((employee) => (
            <option key={employee._id} value={employee.email}>
                {employee.name}
            </option>
        ))}
      </select>

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
                  <button className="edit"  onClick={() => setModalData(payment)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>

                  <button className="delete" onClick={() =>
                            handleDelete(
                              payment._id,
                              payment?.note,
                              payment.paymentMethod,
                              payment?.charge,
                              payment?.payAmount,
                              payment.date
                            )
                          }>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                    </svg>
                  </button>
                </div>

              </div> */}
            </div>

            {/* Right Content */}
            <div className="text-right">
              {/* Amount and Date */}
              <div>
                <h3 className="font-semibold text-emerald-600 text-sm sm:text-base">
                  <span className="text-sm sm:text-base font-extrabold mr-1">৳</span>
                  {payment.payAmount.toLocaleString()}
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

       <div  className="table-div">
          <table className="min-w-full  text-center ">
            <thead className=" ">
              <tr className="tr1">
              <th className="text-center ">{displayedItems.length}</th>
              {
                userr?.role === 'admin' &&  
                <th className="flex justify-start"> Employee Name</th>
              }
         
              <th>Amount</th>
              <th className="text-center">Payment Method</th>
              <th>Date</th>
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
                <td className="text-center">{index+1 }</td>

               

                {
                  userr?.role === 'admin' && 
                  <td>
                  <div className='flex  items-center gap-2'>
                    <img
                      className='h-10 w-10 rounded-full object-cover'
                      src={allEmployees.find(f => f.email === payment.employeeEmail)?.photo}
                      alt=""
                    />
                    <div className="flex flex-col">
                      <h1>{allEmployees.find(f => f.email === payment.employeeEmail)?.name}</h1>
                
                      <div className="flex gap-2 mt-1">
                        <button
                          className="delete"
                          onClick={() =>
                            handleDelete(
                              payment._id,
                              payment?.note,
                              payment.paymentMethod,
                              payment?.charge,
                              payment?.payAmount,
                              payment.date
                            )
                          }
                        >
                          <FaMinusSquare />
                        </button>
                        <button
                          className="edit"
                          onClick={() => setModalData(payment)}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                

              }

                <td>
                <span className="amount-taka">৳ </span> {payment.payAmount}
                </td>

                <td>
  {[
    { method: "bkashPersonal", src: "https://i.ibb.co/520Py6s/bkash-1.png", size: "h-10 w-24" },
    { method: "rocketPersonal", src: "https://i.ibb.co/QkTM4M3/rocket.png", size: "h-10 w-24" },
    { method: "nagadPersonal", src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png", size: "h-10 w-24" },
    { method: "DBBLBank", src: "https://i.ibb.co.com/nnN8KW0/DBBL.png", size: "h-10 w-32" },
    { method: "IBBLBank", src: "https://i.ibb.co.com/pnS6nt4/IBBLBank.png", size: "h-10 w-32" },
    { method: "bank", src: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png", size: "h-12 w-13" },
  ].map(
    (item) =>
      payment.paymentMethod === item.method && (
        <img
          key={item.method}
          className={`${item.size} flex my-auto items-center mx-auto justify-center`}
          src={item.src}
          alt=""
        />
      )
  )}
               </td>

      
            
             

 <td>
                  {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
            <tr className="font-bold tr1">
              <td></td>
           
              {
            userr?.role === 'admin' ? 
            <td className="text-right" colSpan="1">
                  Total:
                </td> : <td className="text-right" colSpan="1">
                  Total:
                </td>
               }
              <td>
              <span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(displayedItems?.reduce(
      (acc, payment) => acc + parseFloat(payment?.payAmount || 0),
      0
    ).toFixed(0))}
              </td>
              <td></td>
            
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

      </div>

      <dialog id="my_modal_1" className="modal">
          <div className="modal-box bg-white text-black font-bold">

            <form onSubmit={handlePayment} className="space-y-6">

{/* Modal Header */}
<div className="flex justify-between items-center mb-6">
  <h3 className="font-bold text-2xl text-gray-800">Make Payment</h3>
  <button
    type="button"
    onClick={() => document.getElementById("my_modal_1").close()}
    className="text-gray-500 hover:text-red-600 transition-colors"
  >
    ✕
  </button>
</div>




<div>
<label className="label-title">Amount (BDT)</label>
  <div className="relative">
    <input
      type="number"
      name="payAmount"
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
        ?.filter((f=>f.role !== 'admin' && f.role !== 'contributor'))
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
    onClick={() => document.getElementById("my_modal_1").close()}
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

      {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}
    </div>
  );
};

export default SalaryPayments;
