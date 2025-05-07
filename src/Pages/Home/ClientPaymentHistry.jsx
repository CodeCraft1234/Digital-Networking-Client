import { useContext, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { Link, useParams } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { FaEdit, FaMinusSquare, FaShare } from "react-icons/fa";
import BalanceCard from "../DashboardRoot/BalanceCard";
import useFindClient from "./useFindClient";
import useAllEmployee from "../../Hook/useAllEmployee";
import { ImCross } from "react-icons/im";
import { FaRegFaceAngry } from "react-icons/fa6";
import { Dialog } from "@headlessui/react";

const ClientPaymentHistry = () => {
  const { user } = useContext(AuthContext);
  const param = useParams();
  const {findClients , refetch}=useFindClient(param?.email)
  const AxiosPublic = UseAxiosPublic();
  const initialTab2 = localStorage.getItem("activeTaballcampaignmonthsss2");
  const [selectedMonth, setSortMonth] = useState(initialTab2 || (new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [payment, setModalData] = useState(null);
    const [payment2, setModalData2] = useState(null);

  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballcampaignmonthsss2", tab);
  };

  const generateRandomId = () => {
    return Math.floor(Math.random() * 1e13); 
  };

  const [allEmployees] = useAllEmployee([]);
  
const handlePayment2 = async (e) => {
  e.preventDefault();

  const transactionId = e.target.elements.transactionId?.value || "";


  const date = new Date();
  const clientEmail = param?.email;
  const employeeEmail = user?.email;
  const ids = param?.email;

  try {
    const formData = new FormData(e.target);
    const { paymentMethod, amount } = Object.fromEntries(formData.entries());

    const amounts=parseFloat(amount)

    const payments = {
      paymentMethod: paymentMethod === "bkashPersonal" ? "bkashMarchent" : paymentMethod,
      amount:amounts,
      ...(transactionId && { transactionId }),
      id: ids,
      ids: generateRandomId(),
      clientEmail,
      clientName: findClients?.clientName,
      employeeEmail,
      date,
      status:'pending'
    };

  
    const datas = {
      description: `Payment of ${amounts} via ${paymentMethod}`,
      date,
      user: user?.displayName,
      photo: user?.photoURL,
    };

    if (paymentMethod === "bkashMarchent") {
      
  localStorage.setItem("pendingClientPayment", JSON.stringify(payments));
  localStorage.removeItem("paymentClientPosted");

      const createRes = await AxiosPublic.post("/create-payment", { amount });
      const { paymentID, bkashURL } = createRes.data;
      if (!paymentID || !bkashURL) throw new Error("Failed to create payment");
      window.location.href = bkashURL; 

    } else {
      const res = await AxiosPublic.post("/clients/payments", { id: ids, payments });
      console.log("Payment successful:", res.data);
    
            if (res.status === 200) {
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

  const handledelete = (ids, id) => {
    const datas = {
      description: `Payment of ids via Deleted`,
      date:new Date(),
      user: user?.displayName,
      photo: user?.photoURL,
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
        AxiosPublic.delete(`/clientPayment/delete/${id}/${ids}`)
          .then((res) => {
            toast.success("Payment deleted successfully!");
            refetch(); // Refresh data after deletion
             AxiosPublic.post("/activity", datas);
          console.log("Activity log delete successfully.");
          })
          .catch((error) => {
            console.error("Error deleting payment:", error);
            toast.error(`Failed to delete payment: ${error?.response?.data?.message || "An error occurred"}`);
          });
      }
    });
  };
  
  const handleUpdatePayment = async (e, ids, id) => {
    e.preventDefault();
    const amount = parseFloat(e.target.amount.value);
    const transactionId = e.target.transactionId.value;
    const paymentMethod = e.target.paymentMethod.value;
    const body = { transactionId, amount, paymentMethod };
    const datas = { title: `Update Payment ${amount} from in ${paymentMethod}`, date: new Date(),  user: user?.displayName,
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

    const initialStatus = localStorage.getItem("activeTabSelectedStatuss") || 'all';
    const [selectedStatus2, setSelectedStatus2] = useState(initialStatus);
  
    const changeTab3 = (tab) => {
      setSelectedStatus2(tab);
      localStorage.setItem("activeTabSelectedStatuss", tab);
    };
  
  const filteredPayments = findClients?.payments
  ?.filter(payment => payment && payment.date) 
  .filter(payment => {
    const status = payment.status || 'Approved'; 
    if (selectedStatus2 === 'all') return true;  
    return status === selectedStatus2;
  })
  .filter(payment => {
    const paymentDate = new Date(payment.date);
    const paymentYear = paymentDate.getFullYear();
    const paymentMonth = paymentDate.getMonth() + 1; // Months are 0-based, so +1

    const isYearMatch = selectedYear === 'all' || paymentYear === parseInt(selectedYear, 10);
    const isMonthMatch = selectedMonth === 'all' || paymentMonth === parseInt(selectedMonth, 10);

    return isYearMatch && isMonthMatch;
  })
  ?.sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
  ?.map((payment, index) => ({
    ...payment,
    index, // Include index if needed
  }));


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
        value: "nagadMarchent",
        img: "https://i.ibb.co/JQBQBcF/nagad-marchant.png",
      },
      {
        value: "rocketPersonal",
        img: "https://i.ibb.co/QkTM4M3/rocket.png",
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


    const handleRefund = async (trxID, paymentID, amount) => {
      try {
        if (!trxID || !paymentID || !amount) {
          alert('Missing refund information');
          return;
        }
    
        const refundAmount = parseFloat(amount).toFixed(2);
        console.log('Starting refund:', { trxID, paymentID, refundAmount });
    
        const response = await AxiosPublic.post('/api/bkash/refund', {
          trxID,
          paymentID,
          amount: refundAmount,
        });
    
        const data = response.data;
        console.log('Refund Response:', data);
    
        if (data.status === 'SUCCESS') {
          alert('✅ Refund Successful!');
          // Refresh transaction list or update UI
        } else {
          alert(`❌ Refund Failed: ${data.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Refund Error:', {
          response: err.response?.data,
          message: err.message
        });
        
        const errorMessage = err.response?.data?.details?.statusMessage 
          || err.response?.data?.error 
          || err.message;
        alert(`Refund failed: ${errorMessage}`);
      }
    };
    
    
    
    
    
    

  return (
    <div>

    <div className="lg:block hidden">

     <div className=" py-5">
               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4  mt-3 mb-3">
    
                 <BalanceCard img={`https://i.ibb.co/520Py6s/bkash-1.png`} amount={filteredPayments?.filter(h => h?.paymentMethod === 'bkashMarchent')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                
     
                 <BalanceCard img={`https://i.ibb.co/JQBQBcF/nagad-marchant.png`} amount={filteredPayments?.filter(h => h?.paymentMethod === 'nagadPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co/QkTM4M3/rocket.png`} amount={filteredPayments?.filter(h => h?.paymentMethod === 'rocketPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co.com/kG9cBXJ/BBBLBank.png`} amount={filteredPayments?.filter(h => h?.paymentMethod === 'bank')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co.com/vH2fPBm/DBBLBank.png`} amount={filteredPayments?.filter(h => h?.paymentMethod === 'DBBLBank')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co.com/pnS6nt4/IBBLBank.png`} amount={filteredPayments?.filter(h => h?.paymentMethod === 'IBBLBank')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
             
                
               </div>
      </div>

      <div className="">


        <div>

       <div className="flex mb-5 items-center   justify-between ">

<div className="text-start ">
       
       <button
     className="add"
      onClick={() => document.getElementById("my_modal_9").showModal()}
    >
       Pay Live
     </button>




</div>



 <div className=" flex justify-end gap-3 items-center">
   <select id="month" value={selectedMonth}   onChange={(e) => changeTab2(e.target.value)} className="select2">
     <option value="all">Select Months</option>
     <option value="1">January</option>
     <option value="2">February</option>
     <option value="3">March</option>
     <option value="4">April</option>
     <option value="5">May</option>
     <option value="6">June</option>
     <option value="7">July</option>
     <option value="8">August</option>
     <option value="9">September</option>
     <option value="10">October</option>
     <option value="11">November</option>
     <option value="12">December</option>
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


        <div>


     





       </div>

        <div  className="table-div " >
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1" >
              <th className="text-center">{filteredPayments?.length}</th>
                <th className="text-left flex justify-start"> Client Name</th>
                <th> transactionId</th>
                <th>Amount</th>
                <th className="text-center">Payment Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments
  ?.map((payment, index) => (
                <tr 
                key={payment.id}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-black border-b border-opacity-20"
                    : "bg-gray-100  text-left text-black border-b border-opacity-20"
                }`}
              >
                 <td className="text-center">

{index +1}

</td>
                     <td>
                                  <div className='flex space-y-2 justify-start items-center gap-2'>
                                <img className='h-10 w-10 rounded-full object-cover' src={allEmployees.find(f => f.email === payment.employeeEmail)?.photo} alt="" />
                                <h1> <span className="font-bold text-start"> {payment.clientName}</span>
                                <button
  className={`edit ${payment?.hidden ? 'cursor-not-allowed ml-2 opacity-50' : 'ml-2'}`}
  onClick={() => {
    if (!payment?.hidden) {
      setModalData(payment);
    }
  }}
  disabled={!!payment?.hidden}
  title={payment?.hidden ? "Editing disabled due to transaction ID" : "Edit payment"}
>
  <FaEdit />
</button>
                                {/* <div className="f-start ">
                              <button
                                    className=" delete"
                                    onClick={() => handleRefund(payment.transactionId , payment.paymentID,payment.amount)}
                                    > 
                                       <span >
                                            <FaRegFaceAngry  />
                                            </span>
                                    </button>
<button
                                    className=" delete"
                                    onClick={() => handledelete(payment.ids ,payment.id)}
                                    >
                                       <span >
                                            <FaMinusSquare  />
                                            </span>
                                    </button>
                                       </div> */}
                                </h1>
                                </div>

                                    <dialog id={`modal_${payment._id}`} className="modal">
                    <div className="modal-box bg-white text-black font-bold">
                      <form onSubmit={(e) => handleUpdatePayment(e, payment._id, payment)}>
                        <h1
                          className="text-black flex justify-end hover:text-red-500"
                          onClick={() => document.getElementById(`modal_${payment._id}`).close()}
                        >
                          <ImCross />
                        </h1>
                        <h2 className="text-xl font-bold">Edit Contributor Pay Amount</h2>
                  
                        <div className="space-y-4">
                  
                    {/* Amount and Charge Fields */}
                    <div className="grid lg:grid-cols-2 gap-4">
                      {[
                        { label: "Amount", type: "number", name: "payAmount", value: payment?.payAmount },
                        { label: "TransactionId", type: "text", name: "transactionId", value: payment?.transactionId, placeholder: "transactionId" }
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
                    <div className="space-y-4">
                    <h4 className="text-base font-semibold text-start text-gray-800">Select Payment Method</h4>
                  
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
                      {[
                        {
                          value: "bkashMarchent",
                          img: "https://i.ibb.co/520Py6s/bkash-1.png",
                        },
                        {
                          value: "nagadPersonal",
                          img: "https://i.ibb.co/JQBQBcF/nagad-marchant.png",
                        },
                        {
                          value: "rocketPersonal",
                          img: "https://i.ibb.co/QkTM4M3/rocket.png",
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
                      ].map(({ value, img }) => (
                        <label
                          key={value}
                          className="relative flex items-center justify-center px-3 py-2 border-2 rounded-xl cursor-pointer transition-all duration-300 bg-white shadow-sm hover:shadow-lg hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 space-x-2"
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={value}
                            checked={payment?.paymentMethod === value}
                            
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



                                
                             
                                   
                                  </td>

                  <td >
                    {" "}
                    {payment.transactionId}
                  </td>

                  <td >
                    <span className="text-md mr-1 font-extrabold">৳</span>{""}
                    {payment.amount}
                  </td>

                  <td  className=" text-center">
                    {payment.paymentMethod === "bkashMarchent" && (
                      <img
                        className="h-10 w-24 flex mx-auto my-auto items-center justify-center"
                        src="https://i.ibb.co/520Py6s/bkash-1.png"
                        alt=""
                      />
                    )}
                    {payment.paymentMethod === "nagadMarchent" && (
                      <img
                        className="h-10 w-24 flex mx-auto my-auto items-center justify-center"
                        src="https://i.ibb.co/WsDkLzc/Nagad-Marchant.png"
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
                    {payment.paymentMethod === "DBBLBank" && (
                      <img
                        className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                        src="https://i.ibb.co.com/nnN8KW0/DBBL.png"
                        alt=""
                      />
                    )}
                    {payment.paymentMethod === "IBBLBank" && (
                      <img
                        className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                        src="https://i.ibb.co.com/yfMSDcd/IBBL.png"
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

  <td>
  <label className="status-label">
  <input
    type="checkbox"
    className="sr-only"
    checked={(payment?.status || "pending") !== "pending"}
    onChange={() => {
      const currentStatus = payment?.status || "pending";
      const newStatus = currentStatus !== "pending" ? "pending" : "Approved";
      handleUpdate2( payment.ids, payment.id, newStatus);
    }}
  />
  <div
    className={`status-switch ${(payment?.status || "pending") !== "pending" ? "active" : "inactive"}`}
  >
    <span
      className={`status-switch-thumb ${(payment?.status || "pending") !== "pending" ? "active" : ""}`}
    ></span>
  </div>
</label>
  </td>
                 
                </tr>
              ))}
              <tr  className=" tr1 font-bold">
              
             
                 <td  className="text-right" colSpan="3">
                  Total:
                </td>
                <td >
                  <span className="text-md mr-1 font-extrabold">৳</span>{""}
                  {findClients?.payments?.reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    ).toFixed(0)}
                </td>
                <td></td>
                <td></td>
                <td></td>
              
              
               
              

              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

     <div className="bg-white font-sans pt-40 mb-16  lg:mt-0 lg:max-w-2xl lg:hidden mx-auto text-sm">
     
     
     
     <button
     className="py-1 px-3 mx-2 mb-2 bg-green-600 text-white"
      onClick={() => document.getElementById("my_modal_9").showModal()}
    >
       Pay Live
     </button>
     
           {filteredPayments?.map((payment) => (
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
                 </div>
     
                 {/* Right Content */}

                 <div className="text-right">
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

         <dialog id="my_modal_9" className="modal">
  <div className="modal-box text-black bg-white max-w-md p-4">
    <form onSubmit={handlePayment2} className="space-y-3 text-sm">

      {/* Refund Policy Notice */}
      <p className="text-xs text-gray-600 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded shadow mb-3 leading-snug">
        আপনি পেমেন্ট করার পর ২৪ ঘণ্টার মধ্যে রিফান্ডের জন্য আবেদন করতে পারবেন। ২৪ ঘণ্টা পার হলে আর রিফান্ড সম্ভব নয়।
      </p>

      {/* Modal Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">Make Payment</h3>
        <button
          type="button"
          onClick={() => document.getElementById("my_modal_9").close()}
          className="text-gray-500 hover:text-red-600 text-sm"
        >
          ✕
        </button>
      </div>

      {/* Amount Input */}
      <div className="space-y-1">
        <label className="block font-medium text-sm">Amount (BDT)</label>
        <div className="relative">
          <input
            type="number"
            name="amount"
            min="1"
            required
            placeholder="Enter amount"
            className="w-full pl-10 bg-white text-black pr-3 py-2 border border-gray-300 rounded focus:ring-blue-400 focus:border-blue-400 text-sm"
          />
          <span className="absolute left-3 top-1.5 text-gray-500 text-sm">৳</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-2">
        {/* Conditional TransactionId Field */}
        {selectedMethod && selectedMethod !== "bkashMarchent" && (
          <div className="space-y-1">
            <label className="block font-medium text-sm">TransactionId</label>
            <div className="relative">
              <input
                type="text"
                name="transactionId"
                required
                placeholder="Enter TransactionId"
                className="w-full pl-10 pr-3 py-2 border bg-white text-black border-gray-300 rounded focus:ring-blue-400 focus:border-blue-400 text-sm"
              />
              <span className="absolute left-3 top-1.5 text-gray-500 text-sm">৳</span>
            </div>
          </div>
        )}

        <label className="block font-medium text-sm">Select Payment Method</label>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-1.5">
          {paymentMethods.map(({ value, img }) => (
            <label
              key={value}
              className="relative flex items-center justify-center px-2 py-1 border rounded-lg cursor-pointer transition-all duration-200 bg-white shadow-sm hover:shadow-md hover:border-blue-400 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 space-x-1"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={value}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-blue-600 checked:bg-blue-600 transition"
                required
              />
              <div className="w-10 h-8 flex items-center justify-center">
                <img src={img} alt={value} className="max-w-full max-h-full object-contain" />
              </div>

              <div className="absolute top-1 right-1 hidden has-[:checked]:block">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 w-full mt-4">
        <button
          type="button"
          onClick={() => document.getElementById("my_modal_9").close()}
          className="cancel text-sm py-1.5"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="add text-sm py-1.5"
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
      <form onSubmit={(e) => handleUpdatePayment(e, payment.ids, payment.id)}>
        <div className="grid lg:grid-cols-2 gap-4">
          {[
            {
              label: "Amount",
              type: "number",
              name: "amount",
              value: payment?.amount
            },
            {
              label: "TransactionId",
              type: "text",
              name: "transactionId",
              value: payment?.transactionId,
              placeholder: "transactionId"
            }
          ].map(({ label, type, name, value, placeholder }, idx) => (
            <div key={idx}>
              <label
                htmlFor={name}
                className="block text-left text-gray-700"
              >
                {label}
              </label>
              <input
                type={type}
                name={name}
                id={name}
                defaultValue={value}
                placeholder={placeholder}
                className="w-full border bg-white border-black rounded p-2 mt-1"
              />
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 mt-4">
          <h4 className="text-base font-semibold text-start text-gray-800">
            Select Payment Method
          </h4>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
            {[
              {
                value: "bkashMarchent",
                img: "https://i.ibb.co/520Py6s/bkash-1.png"
              },
              {
                value: "nagadPersonal",
                img: "https://i.ibb.co/JQBQBcF/nagad-marchant.png"
              },
              {
                value: "rocketPersonal",
                img: "https://i.ibb.co/QkTM4M3/rocket.png"
              },
              {
                value: "bank",
                img: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png"
              },
              {
                value: "DBBLBank",
                img: "https://i.ibb.co/nnN8KW0/DBBL.png"
              },
              {
                value: "IBBLBank",
                img: "https://i.ibb.co.com/pnS6nt4/IBBLBank.png"
              }
            ].map(({ value, img }) => (
              <label
                key={value}
                className="relative flex items-center justify-center px-3 py-2 border-2 rounded-xl cursor-pointer transition-all duration-300 bg-white shadow-sm hover:shadow-lg hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 space-x-2"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  defaultChecked={payment?.paymentMethod === value}
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

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={() => setModalData(null)}
            className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 rounded"
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
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

export default ClientPaymentHistry;
