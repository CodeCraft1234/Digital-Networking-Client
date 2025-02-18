import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast, ToastContainer } from "react-toastify";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useUserr from "../../Hook/useUser";
import useAllEmployee from "../../Hook/useAllEmployee";
import BalanceCard from "./BalanceCard";
import "react-datepicker/dist/react-datepicker.css";
import useAdminPaymentsPage from "../../Hook/useAdminPaymentsPage";
import useAdminPayPageTotal from "../../Hook/useAdminPayPageTotal";

const AdminPayments = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [allEmployees] = useAllEmployee([]);
  
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
const { adminPay, totalItems, totalPages, refetch } = useAdminPaymentsPage(
  selectedEmployee3, 
  selectedCategory || 'all', 
  selectedStatus2 || 'all',
  sortMonth,
  currentPage,
  selectedYear
);


const handlePageChange = (page) => {
  setCurrentPage(page);
  refetch();
};
  
const [totals] = useAdminPayPageTotal( selectedEmployee3, 
  selectedCategory || 'all', 
  selectedStatus2 || 'all',
  sortMonth,
  currentPage,
  selectedYear)


  useEffect(() => {
    const filtered = adminPay.filter((payment) => {
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
    adminPay,
    selectedStatus2,
    selectedYear,
  ]);
  
  const itemsPerPage = 100;

const displayedItems = adminPay?.sort((a, b) => new Date(b.date) - new Date(a.date))?.filter(f => {
  const itemMonth = new Date(f.date).getMonth() + 1;
  return (sortMonth == itemMonth || sortMonth === 'all') 
}).slice(0, currentPage * itemsPerPage);
  const isMoreItems = currentPage * itemsPerPage < filteredData.length;

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];  

  const handlePayment = async (e) => {
    e.preventDefault();
    const employeeEmail = e.target.employeeEmail?.value || user?.email;
    const employeeName = allEmployees.find(e => e.email === employeeEmail)?.name || user?.displayName;
    const payAmount = e.target.payAmount.value;
    const charge = e.target.charge.value;
    const paymentMethod = e.target.paymentMethod.value;
    const note = e.target.note.value;
    const date = e.target.date.value;

    const data = {
      employeeName,
      employeeEmail,
      payAmount,
      note,
      charge,
      paymentMethod,
      date,
      status:'pending'
    };

    const datas = {
      title: `added ${payAmount} in in ${paymentMethod}`,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };

    AxiosPublic.post("/employeePayment",
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
    const date = e.target.date.value;
    const charge = e.target.charge.value;
    const note = e.target.note.value;
    const paymentMethod = e.target.paymentMethod.value;
    const status = 'pending';
    const updatedPaymentData = { status, note, payAmount,charge, date, paymentMethod };

    const previousAmount = payment.payAmount; 

    const datas = {
      title: `added ${payAmount} in in ${paymentMethod}`,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };

    AxiosPublic.patch(`/employeePayment/${id}`,
      updatedPaymentData
    )
    .then(() => {
      refetch();
      document.getElementById(`modal_${id}`).close();
      toast.success("Updated successful!");

      AxiosPublic.post("/activity", datas).then(() => {
      });
  
      AxiosPublic.post('/editNotification', {
          ppayAmount: previousAmount,
          pdate: payment.date,
          pnote: payment.note,
          ppaymentMethod: payment.paymentMethod,
          pstatus: payment.status,
    
          editDate:new Date(),
          name:user?.displayName,
          photo:user?.photoURL,
          email:user?.email,
          message : `The payment of ৳${previousAmount} via ${payment.paymentMethod} has been updated to ৳${payAmount} using ${paymentMethod}.`,

    
          note,
          payAmount,
          date,
          paymentMethod
        
      })
      .then(() => {
        console.log("Edit notification sent successfully!");
      })
      .catch(err => console.error("Error sending edit notification:", err));
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

        AxiosPublic.delete(`/employeePayment/${id}`)
          .then((res) => {
            toast.success("Delete successful!");
            refetch();
            AxiosPublic.post("/activity", datas).then(() => {
            });
            AxiosPublic.post('/notification', {
              type: 'delete',
              paymentId: id,
              note,
              paymentMethod,
              charge,
              payAmount,
              date,
              deleteDate:new Date(),
              name:user.displayName,
              photo:user?.photoURL,
              email:user?.email,
              message: `Payment of ৳${payAmount} by ${paymentMethod} was deleted.`
            })
            .then(() => {
           
            })
            .catch((error) => {
              toast.error("Failed to create notification.");
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
  
    AxiosPublic.patch(`/employeePayment/status/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
      })
      .catch((error) => {
        console.error("Error updating Payment:", error);
        toast.error("Failed to update Payment");
      });
  };


  
  const cards = [
    { category: 'bank', img: 'https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png', bgColor: '#f2f2f2' },
    { category: 'DBBLBank', img: 'https://i.ibb.co/nnN8KW0/DBBL.png', bgColor: '#f2f2f2' },
    { category: 'IBBLBank', img: 'https://i.ibb.co.com/pnS6nt4/IBBLBank.png', bgColor: '#f2f2f2' },
    { category: 'bkashPersonal', img: 'https://i.ibb.co/520Py6s/bkash-1.png', bgColor: '#ffe6f7' },
    { category: 'nagadPersonal', img: 'https://i.ibb.co/JQBQBcF/nagad-marchant.png', bgColor: '#fff2cc' },
  ];

  return (
    <div className="mt-5">
      <ToastContainer />



<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-5 rounded-lg">
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
                 style={{ backgroundColor: '#f7e8e8', border: 'var(--border)' }} 
                   className="balance-card rounded-2xl  text-center shadow-xl transition-transform transform hover:scale-105"
                 >
                   <h1 className="px-3 text-black text-xl font-bold text-center">TOTAL</h1>
                   <p className="card-title pb-5">
  <span>৳ </span>
  {new Intl.NumberFormat('en-IN').format(
        Object.values(totals).reduce((sum, val) => sum + val, 0)
      )}
</p>

         </div>

              </div>





     <div className="side-space mt-5">

     <div className="flex flex-col md:flex-row justify-start lg:justify-between items-center gap-5 ">
    <div className="flex justify-start">
      {
        userr?.role === 'admin' ? <button
        className="font-avenir px-6 hover:bg-indigo-700 py-2 bg-[#05a0db] rounded-lg text-white"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        Pay Now
      </button> :  <button
      className="font-avenir px-6 hover:bg-indigo-700 py-2 bg-[#05a0db] rounded-lg text-white"
      onClick={() => document.getElementById("my_modal_1").showModal()}
    >
      Pay Admin
    </button>
      }
   
    <dialog id="my_modal_1" className="modal">
  <div className="modal-box bg-white text-black font-bold">
    <form onSubmit={(e) => handlePayment(e)}>
      <h1
        className="text-black flex hover:text-red-500 justify-end cursor-pointer"
        onClick={() => document.getElementById("my_modal_1").close()}
      >
        <ImCross />
      </h1>

     <div className="mb-4">
        <label className="block text-gray-250">Date</label>
        <input
          type="date"
          name="date"
          required
          defaultValue={formattedDate}
          className="input2"
        />
      </div>

   
     <div>
      {userr?.role === "admin" && (
        <div className="mb-4">
          <label className="block text-black">Select Marketer</label>
          <select className="select2 w-full" name="employeeEmail">
            {allEmployees
              ?.filter((f) => f.role === "employee")
              .map(({ _id, email, name }) => (
                <option key={_id} value={email}>
                  {name}
                </option>
              ))}
          </select>
        </div>
      )}
      </div>

      <div className="grid lg:grid-cols-2 gap-3 mb-4">
        {[
          { name: "payAmount", label: "Amount", placeholder: "0" },
          { name: "charge", label: "Charge", placeholder: "0", defaultValue: 0 },
        ].map(({ name, label, placeholder, defaultValue }) => (
          <div key={name}>
            <label className="block text-gray-250">{label}</label>
            <input
              type="number"
              name={name}
              required
              placeholder={placeholder}
              defaultValue={defaultValue}
              className="input2"
            />
          </div>
        ))}
      </div>

     <div className="mb-4">
        <div className="mt-2 grid lg:grid-cols-3">
          {[
            { value: "bank", label: "Brack Bank" },
            { value: "DBBLBank", label: "DBBL Bank" },
            { value: "IBBLBank", label: "Islami Bank" },
            { value: "bkashPersonal", label: "bKash" },
            { value: "nagadPersonal", label: "Nagad" },
          ].map(({ value, label }) => (
            <div className="form-control" key={value}>
              <label className="label flex justify-start items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  className="radio radio-primary"
                />
                <span className="label-text text-black">{label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-250">Note (Optional)</label>
        <input
          type="text"
          name="note"
          placeholder="type note..."
          className="input2"
        />
      </div>
      <div className="grid mt-8 lg:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => document.getElementById("my_modal_1").close()}
          className="close"
        >
          Close
        </button>
        <button type="submit" className="add">
          Submit
        </button>
      </div>
    </form>
  </div>
</dialog>


  </div>

  <div className="lg:flex text-black lg:justify-start my-3 lg:my-0 lg:ml-5  items-center">
        
        <div className="flex mt-2  lg:mt-0 justify-center text-center gap-2 lg:gap-3 items-center">

{userr?.role === "admin" ? (
      <select
        
        className="select2"
        value={selectedEmployee3}
        onChange={(e) => changeTab2(e.target.value)}
      >
        <option value="all">Select Digital Marketer</option>
        {allEmployees
          .filter((u) => u.role === "employee")
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
  <option value="">Select Year</option> 
  {[...new Set(adminPay?.map((campaign) => new Date(campaign.date).getFullYear()))]
    .sort((a, b) => a - b) 
    .map((year) => (
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

       <div className="table-div mt-4">
          <table className="min-w-full  text-center ">
            <thead>
              <tr className="tr1">
              <th className="text-center ">{displayedItems.length} Items</th>
              <th>Date</th>
              <th>Marketer Name</th>
              <th>Amount</th>
              <th>Charge</th>
              <th className="text-center ">Payment Method</th>
              <th> Note</th>
              <th className="text-center ">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems?.map((payment, index) => (
               <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
               key={payment._id}
               className={`${
                 index % 2 === 0
                   ? "bg-white text-left text-black border-b border-opacity-20"
                   : "bg-gray-200  text-left text-black border-b border-opacity-20"
               }`}
             >
                <td>
                <div className="f-center ">
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
                    onClick={() =>
                      document
                        .getElementById(`modal_${payment._id}`)
                        .showModal()
                    }
                  >
                    <FaEdit />
                  </button>
                  <dialog id={`modal_${payment._id}`} className="modal">
  <div className="modal-box bg-white text-black font-bold">
    <form onSubmit={(e) => handleUpdatePayment(e, payment._id, payment)}>
      <h1
        className="text-black flex justify-end hover:text-red-500"
        onClick={() => document.getElementById(`modal_${payment._id}`).close()}
      >
        <ImCross />
      </h1>
      <h2 className="text-xl font-bold">Edit Admin Pay Amount</h2>

      <div className="space-y-4">
  {/* Date Field */}
  <div className="mb-4">
    <label className="block text-left text-gray-700">Date</label>
    <input
      type="date"
      name="date"
      defaultValue={payment.date}
      className="w-full border bg-white border-black rounded p-2 mt-1"
    />
  </div>

  {/* Amount and Charge Fields */}
  <div className="grid lg:grid-cols-2 gap-4">
    {[
      { label: "New Amount", type: "number", name: "payAmount", value: payment?.payAmount },
      { label: "Charge", type: "number", name: "charge", value: payment?.charge, placeholder: "0" }
    ].map(({ label, type, name, value, placeholder }, idx) => (
      <div className="" key={idx}>
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

  {/* Payment Method - Radio Buttons */}
<div className=" grid lg:grid-cols-3 gap-2">
  {[
    { value: "bank", label: "Brack Bank" },
    { value: "DBBLBank", label: "DBBL Bank" },
    { value: "IBBLBank", label: "Islami Bank" },
    { value: "bkashPersonal", label: "bKash" },
    { value: "nagadPersonal", label: "Nagad" },
  ].map(({ value, label }) => (
    <div className="form-control" key={value}>
      
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="paymentMethod"
          value={value}
          defaultChecked={payment.paymentMethod === value} // Default selection
          className="radio radio-primary"
        />
        <span className="label-text text-black">{label}</span>
      </label>
    </div>
  ))}
</div>


  {/* Note Field */}
  <div className="mb-4">
    <label className="block text-left text-gray-700">Note</label>
    <input
      type="text"
      name="note"
      defaultValue={payment?.note}
      className="w-full border bg-white border-black rounded p-2 mt-1"
    />
  </div>
</div>



      <div className="modal-action grid grid-cols-2 gap-3 mt-4">
        {[
          { label: "Close", className: "bg-red-600 hover:bg-red-700", action: () => document.getElementById(`modal_${payment._id}`).close() },
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
                 </div>
                </td>

                <td>
                  {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>
                <td>
                <div className='flex justify-start items-center gap-2'>
              <img className='h-10 w-10 rounded-full object-cover' src={allEmployees.find(f => f.email === payment.employeeEmail)?.photo} alt="" />
              <h1>  {payment.employeeName}</h1>
              </div>
                 
                </td>
                <td>
                  ৳ {payment.payAmount}
                </td>
                <td>
                  ৳ {payment.charge || 0}
                </td>

                <td>
  {[
    { 
      method: "bkashPersonal", 
      src: "https://i.ibb.co.com/f8LcKV0/bKash.png", 
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
                 {payment.note?.split(" ").slice(0, 4).join(" ") + (payment.note?.split(" ").length > 4 ? "..." : "")}
            </td>

            
                {userr?.role === 'admin' &&
                <td className="text-center">
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

                {userr?.role === 'employee' &&
                <td className="text-center">
                  <h1 className={`${payment.status !== "pending" ? "text-blue-700 font-bold" : ""}`}> {payment?.status}</h1>
               
              </td>
                }

              </tr>
            ))}
            <tr className="font-bold tr1">
              <td></td>
              <td></td>
              <td className="p-3 text-right" >
                Total :
              </td>
              <td>
  ৳ {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2, // To ensure two decimal places if required
  }).format(
    displayedItems
      ?.filter(f =>
        ['nagadPersonal', 'bkashPersonal', 'bank', 'IBBLBank', 'DBBLBank'].includes(f.paymentMethod)
      )
      .reduce((acc, item) => acc + (isNaN(parseFloat(item?.payAmount)) ? 0 : parseFloat(item?.payAmount)), 0)
  )}
</td>

               <td>
  ৳ {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2, // Ensure consistency in decimals
  }).format(
    displayedItems
      ?.filter(f =>
        ['nagadPersonal', 'bkashPersonal', 'bank', 'IBBLBank', 'DBBLBank'].includes(f.paymentMethod)
      ).reduce((acc, item) => acc + (isNaN(parseFloat(item?.charge)) ? 0 : parseFloat(item?.charge)), 0)
  )}
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div className="flex items-center justify-center my-5 space-x-2">
  {/* Previous Button */}
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded-md ${
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

    // Always show 5 buttons, with the current page in the middle
    if (totalPages <= 5) {
      // If total pages are less than or equal to 5, show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages to keep the current page in the middle
      startPage = Math.max(currentPage - 2, 1);
      endPage = Math.min(currentPage + 2, totalPages);

      // Adjust if the current page is near the start or end
      if (currentPage <= 3) {
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }
    }

    // Generate buttons for the calculated range
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-md ${
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
    className={`px-4 py-2 rounded-md ${
      currentPage === totalPages
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-800"
    }`}
  >
    Next
  </button>
</div>

      </div>
      </div>
      {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}
    </div>
  );
};

export default AdminPayments;
