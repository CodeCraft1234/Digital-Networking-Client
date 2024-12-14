import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import useUsers from "../../Hook/useUsers";
import useAdsPayment from "../../Hook/useAdsPayment";
import { Link } from "react-router-dom";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import axios from "axios";
import useAllEmployee from "../../Hook/useAllEmployee";
import { toast } from "react-toastify";
import useUserr from "../../Hook/useUser";
import { ImCross } from "react-icons/im";
import BalanceCard from "./BalanceCard";

const AllAdsPayments = () => {
  const [adsPayment, refetch] = useAdsPayment();
  const AxiosPublic = UseAxiosPublic();
  const [totalPayment, setTotalPayment] = useState(0);
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [bkashMarcent, setBkashMarcentTotal] = useState(0);
  const [nagadPersonal, setNagadPersonalTotal] = useState(0);
  const [bkashPersonal, setBkashPersonalTotal] = useState(0);
  const [rocketPersonal, setRocketPersonalTotal] = useState(0);
  const [bankTotal, setBankTotal] = useState(0);
  const [ddd, setDdd] = useState(null);

  const initialTab = localStorage.getItem("activeTabclientpayMontc") || "All";
  const [sortMonth, setSortMonth] = useState(initialTab || new Date().getMonth() + 1)

  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTabclientpayMontc", tab); 
  };

  const initialTab2 = localStorage.getItem("activeTaballClientsempe") ;
  const [selectedEmployee, setSelectedEmployee] = useState(initialTab2); 
  
  const changeTab2 = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem("activeTaballClientsempe", tab); 
  };
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  useEffect(() => {
      if (users && user) {
          const datas=users.filter(f=>f.role === 'contributor')
          setDdd(datas); 
      }
  }, [users, user]);
  
  const initialStatus = localStorage.getItem("activeTabSelectedStatuss") || 'All';
  const [selectedStatus2, setSelectedStatus2] = useState(initialStatus);

  const changeTab3 = (tab) => {
    setSelectedStatus2(tab);
    localStorage.setItem("activeTabSelectedStatuss", tab);
  };

  useEffect(() => setFilteredClients(adsPayment || []), [adsPayment]);
  
  useEffect(() => {
    const filtered = adsPayment.filter((payment) => {
      const paymentDate = new Date(payment.date);
  
      return (
        (selectedStatus2 === 'All' || payment.status === selectedStatus2) &&
        (selectedEmployee === 'all' || selectedEmployee === payment.employeeEmail) &&
        (sortMonth === 'all' || paymentDate.getMonth() + 1 === parseInt(sortMonth)) &&
        (selectedCategory === 'All' || selectedCategory === '' || payment.paymentMethod === selectedCategory) &&
        (selectedYear ? paymentDate.getFullYear() === parseInt(selectedYear) : true)
      );
    });
  
    setFilteredClients(filtered);
  }, [selectedEmployee, sortMonth,selectedStatus2, selectedCategory, selectedYear, adsPayment]);
  
  
  useEffect(() => {
    setTotalPayment(filteredClients.reduce((acc, campaign) => acc + parseFloat(campaign.payAmount), 0));
  }, [filteredClients]);
  
  useEffect(() => {
    const filteredByYear = adsPayment?.filter((payment) => new Date(payment.date).getFullYear() === selectedYear) || [];
    setFilteredClients(filteredByYear);
  }, [adsPayment, selectedYear]);
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  useEffect(() => {
    const calculateTotal = (method) =>
      adsPayment?.filter((d) => d.paymentMethod === method).reduce((acc, d) => acc + parseFloat(d.payAmount), 0) || 0;
    setBkashMarcentTotal(calculateTotal('bkashMarchent'));
    setNagadPersonalTotal(calculateTotal('nagadPersonal'));
    setBkashPersonalTotal(calculateTotal('bkashPersonal'));
    setRocketPersonalTotal(calculateTotal('rocketPersonal'));
    setBankTotal(calculateTotal('bank'));
  }, [adsPayment]);

  const itemsPerPage = 20;

  const displayedItems = filteredClients.slice(0, currentPage * itemsPerPage);
  const isMoreItems = currentPage * itemsPerPage < filteredClients.length;
  console.log(displayedItems);
  
  const years = Array.from({ length: 31 }, (_, i) => 2020 + i);
  

  const handleUpdate2 = (id, newStatus) => {
    const body = { status: newStatus };
  
    AxiosPublic.patch(`/adsPayment/status/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedPayment = {
      ...selectedPayment,
      date: e.target.date.value,
      payAmount: parseFloat(e.target.amount.value),
      paymentMethod: e.target.method.value,
      note: e.target.note.value,
    };

    AxiosPublic.patch(`/adsPayment/${selectedPayment._id}`,
      updatedPayment
    ).then((res) => {
      handleCancel();
      refetch();
    });
  };


  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this payment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/adsPayment/${id}`).then((res) => {
          refetch();
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your payment has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };
  const {userr}=useUserr(user?.email)
  const [allEmployees] = useAllEmployee([]);

  const handlePayment =async (e) => {
    e.preventDefault();
    const employeeEmail = e.target.employeeEmail?.value || user?.email;
    const employeeName = allEmployees?.find(e => e.email === employeeEmail)?.name || user?.displayName;
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
      status:'pending'
    };
    console.log(data);

    AxiosPublic.post(
      "https://hishab-2025.vercel.app/adsPayment",
      data
    )
      .then((res) => {
        toast.success('pay successfully')
        refetch();
        document.getElementById("my_modal_1").close()

     
      })

      const fields = {
        bkashMarchent: (userr?.bkashMarchent || 0) - payAmount,
        bkashPersonal: (userr?.bkashPersonal || 0) - payAmount,
        nagadPersonal: (userr?.nagadPersonal || 0) - payAmount,
        rocketPersonal: (userr?.rocketPersonal || 0) - payAmount,
      };
    
      if (!fields[paymentMethod]) {
        console.error("Invalid payment method");
        return;
      }
    
      const body2 = { [paymentMethod]: fields[paymentMethod] };
    
      try {
        const res = await axios.put(`https://hishab-2025.vercel.app/users/${paymentMethod}/${userr._id}`, body2);
        console.log(res.data);
        refetch();  // Make sure this function correctly refetches the updated data
      } catch (error) {
        console.error("Error updating account:", error);
      }
  };


  return (
    <div className="">


       <div className="grid grid-cols-2 rounded-lg sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-5 lg:grid-cols-6 ">
<div onClick={() => setSelectedCategory('bank')}>
<BalanceCard  img={`https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png`} amount={bankTotal}></BalanceCard>
</div>
<div onClick={() => setSelectedCategory('bkashMarchent')}>
<BalanceCard  img={`https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png`} amount={bkashMarcent}></BalanceCard>
</div>
<div onClick={() => setSelectedCategory('bkashPersonal')}>
<BalanceCard  img={`https://i.ibb.co/520Py6s/bkash-1.png`} amount={bkashPersonal}></BalanceCard>
</div>
<div onClick={() => setSelectedCategory('nagadPersonal')}>
<BalanceCard  img={`https://i.ibb.co/JQBQBcF/nagad-marchant.png`} amount={nagadPersonal}></BalanceCard>
</div>
<div onClick={() => setSelectedCategory('rocketPersonal')}>
<BalanceCard  img={`https://i.ibb.co/QkTM4M3/rocket.png`} amount={rocketPersonal}></BalanceCard>
</div>

<div onClick={() => setSelectedCategory('All')}
                   style={{ backgroundColor: '#d9f8d9', border: 'var(--border)' }} 
                   className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105">
<h1 className="px-3 text-black text-xl font-bold text-center">TOTAL</h1>
      <p className="balance-card-text text-lg mt-2 lg:text-xl font-bold text-gray-700">
        <span className="text-lg lg:text-xl font-extrabold">৳</span> {bankTotal + rocketPersonal + bkashMarcent + bkashPersonal + nagadPersonal }
      </p>
    </div>

        </div>

     <div className=' mt-5  side-space rounded-lg' >
     <div className="f-between ">

     <div className="f-center">
  <button
    className="add"
    onClick={() => document.getElementById("my_modal_1").showModal()}
  >
    Pay Admin
  </button>

  <dialog id="my_modal_1" className="modal">
    <div className="modal-box bg-white text-black font-bold">
      <form onSubmit={handlePayment}>

      <div className="flex justify-end">
            <ImCross
              className="cursor-pointer hover:text-red-500"
              onClick={() => document.getElementById("my_modal_1").close()}
            />
          </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Date</label>
          <input type="date" name="date" required className="input2" />
        </div>

        <div className="grid lg:grid-cols-2 gap-3">
  {userr?.role === "admin" && (
    <div className="mb-4 lg:col-span-1">
      <label className="block text-gray-700 mb-1">Select Employee</label>
      <select name="employeeEmail" className="select2 w-full">
        {allEmployees
          ?.filter((f) => f.role === "contributor")
          .map((e) => (
            <option key={e._id} value={e.email}>
              {e.name}
            </option>
          ))}
      </select>
    </div>
  )}
  <div className="mb-4 lg:col-span-1">
    <label className="block text-gray-700 mb-1">Payment Method</label>
    <select name="paymentMethod" required className="select2 w-full">
      {[
        "bkashMarchent",
        "bkashPersonal",
        "nagadPersonal",
        "rocketPersonal",
        "bank",
      ].map((method, idx) => (
        <option key={idx} value={method}>
          {method.replace(/([A-Z])/g, " $1")}
        </option>
      ))}
    </select>
  </div>
</div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Pay Amount</label>
          <input
            type="number"
            name="payAmount"
            required
            placeholder="0"
            className="input2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Note</label>
          <input
            type="text"
            name="note"
            required
            placeholder="Type note..."
            className="input2"
          />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            className="close"
            onClick={() => document.getElementById("my_modal_1").close()}
          >
            Close
          </button>
          <button type="submit" className="add">
            Send
          </button>
        </div>
      </form>
    </div>
  </dialog>
    </div>

  <div className="f-center">
    <div className="f-center">
      <select
        className="select2"
        value={selectedEmployee}
        onChange={(e) => changeTab2(e.target.value)}
      >
        <option value="all">All Contributor</option>
        {ddd?.map((employee) => (
          <option key={employee._id} value={employee.email}>
            {employee.name}
          </option>
        ))}
      </select>
    </div>
    <div className="f-center">
      <select
        value={sortMonth}
        onChange={(e) => changeTab(e.target.value)}
        className="select2"
      >
        <option value="all">Select Month</option>
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
    <div className="f-center">
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        className="select2"
      >
        {years.map((year) => (
          <option className="bg-white text-black" key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
    <select
  className="select2 "
  value={selectedStatus2}
  onChange={(e) => changeTab3(e.target.value)}
>
  <option value="All">All Status</option>
  <option value="pending">Pending</option>
  <option value="Approved">Approved</option>
 
         </select>
  </div>
</div>

     

<div  className="overflow-x-auto rounded-xl mt-4 text-center " >
          <table className="min-w-full text-center ">
            <thead style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}} className=" ">
              <tr className="tr1">
              <th className="text-center">Items {displayedItems.length}</th>
              <th >Date</th>
              <th >Contributor Name</th>
              <th >Amount</th>
              <th >Method</th>
              <th >Note</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.sort((a, b) => new Date(b.date) - new Date(a.date))?.map((payment, index) => (
               <tr 
               key={payment._id}
               className={`tr2`}
             >
               
                <td  className=" text-center">
               <div className="f-center">
               <button
                         className="delete"
                          onClick={() => handleDelete(payment._id)}
                        >
                          <FaMinusSquare  />
                        </button>
                        <button
                           className="f-start2 edit"
                          onClick={() => handleEditClick(payment)}
                        >
                                <FaEdit />
                        </button>
               </div>
                </td>
                <td>
                {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>
               
                <td>
                <Link to={`/dashboard/adsuserInfo/${payment?.employeeEmail}`}>
                {payment.employeeName}
                </Link>
                  
                </td>
                <td>
                  ৳  {new Intl.NumberFormat('en-IN').format(payment.payAmount)}
                </td>
                <td>
  {
    {
      bkashMarchent: "https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png",
      bkashPersonal: "https://i.ibb.co/520Py6s/bkash-1.png",
      rocketPersonal: "https://i.ibb.co/QkTM4M3/rocket.png",
      nagadPersonal: "https://i.ibb.co/JQBQBcF/nagad-marchant.png",
      bank: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png",
    }[payment.paymentMethod] && (
      <img
        className="h-10 w-24 flex mx-auto my-auto items-center justify-center"
        src={{
          bkashMarchent: "https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png",
          bkashPersonal: "https://i.ibb.co/520Py6s/bkash-1.png",
          rocketPersonal: "https://i.ibb.co/QkTM4M3/rocket.png",
          nagadPersonal: "https://i.ibb.co/JQBQBcF/nagad-marchant.png",
          bank: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png",
        }[payment.paymentMethod]}
        alt={payment.paymentMethod}
      />
    )
  }
               </td>
                <td>
                  {payment.note}
                </td>
               
              

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
        className={`status-thumb ${payment.status !== "pending" ? "active" : ""}`}
      ></span>
    </div>
  </label>
</td>

              </tr>
            ))}
             <tr className="tr1 font-bold">
              <td className=" text-right" colSpan="3">
                Total :
              </td>
              <td >৳ {totalPayment}</td>
              <td ></td>
              <td ></td>
              <td ></td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    

      {isModalOpen && selectedPayment && (
  <dialog open className="modal">
    <div className="modal-box bg-white text-black font-bold">
      <form onSubmit={handleUpdate}>
        <div className="f-end">
          <ImCross
            className="cursor-pointer hover:text-red-500"
            onClick={() =>  handleCancel()}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={selectedPayment.date}
            required
            className="input2"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-3">
          <div className="mb-4 lg:col-span-1">
            <label className="block text-gray-700 mb-1">Payment Method</label>
            <select
              id="method"
              name="method"
              defaultValue={selectedPayment.paymentMethod}
              required
              className="select2 w-full"
            >
              <option value="bkashPersonal">bKash Personal</option>
              <option value="bkashMarchent">bKash Marcent</option>
              <option value="nagadPersonal">Nagad Personal</option>
              <option value="rocketPersonal">Rocket Personal</option>
              <option value="bank">Bank</option>
            </select>
          </div>
          <div className="mb-4 lg:col-span-1">
            <label className="block text-gray-700 mb-1">Payment Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              defaultValue={selectedPayment.payAmount}
              required
              className="input2"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Note</label>
          <textarea
            id="note"
            name="note"
            defaultValue={selectedPayment.note}
            className="input2"
          ></textarea>
        </div>

        <div className="grid lg:grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            className="close"
            onClick={() =>  handleCancel()}
          >
            Close
          </button>
          <button type="submit" className="add">
            Update
          </button>
        </div>
      </form>
    </div>
  </dialog>
)}

    
    {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}

    </div>
  );
};

export default AllAdsPayments;



