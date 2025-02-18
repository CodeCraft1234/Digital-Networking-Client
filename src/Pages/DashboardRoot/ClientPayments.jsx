import { useContext, useEffect, useState } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "../../Security/AuthProvider";
import BalanceCard from "./BalanceCard";
import useUserr from "../../Hook/useUser";
import useClientsPage from "../../Hook/useClientsPage";
import useClientsPaymentsPage from "../../Hook/useClientPaymentsPage";
import useAllEmployee from "../../Hook/useAllEmployee";

const ClientPayments = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [payment, setModalData] = useState(null);
  
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
  

  const [currentPage, setCurrentPage] = useState(1);

  const { clientPayments, totalItems, totalPages, refetch } = useClientsPaymentsPage(
    selectedEmployee3,
    currentPage,
    sortMonth,
    selectedYear
  );
  
  useEffect(() => {
    console.log(clientPayments); 
  }, [clientPayments]);
  
const [client] = useClientsPage(selectedEmployee3, currentPage);


  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch();
  };
  
  const itemsPerPage = 40;

  const displayedItems = clientPayments.sort((a, b) => new Date(b.date) - new Date(a.date))?.slice(0, currentPage * itemsPerPage);
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
     const date = e.target.date.value;
     const note = e.target.note.value;
     const paymentMethod = e.target.paymentMethod.value;
     const body = { note, amount, date, paymentMethod };
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
     { key: "bkashMarchent", label: "Bkash Merchant", img: "https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" },
     { key: "bkashPersonal", label: "Bkash Personal", img: "https://i.ibb.co/520Py6s/bkash-1.png" },
     { key: "nagadPersonal", label: "Nagad Personal", img: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" },
     { key: "rocketPersonal", label: "Rocket Personal", img: "https://i.ibb.co/QkTM4M3/rocket.png" },
     { key: "IBBLBank", label: "IBBL Bank", img: "https://i.ibb.co/pnS6nt4/IBBLBank.png" },
     { key: "bank", label: "Bank", img: "https://i.ibb.co/kG9cBXJ/BBBLBank.png" },
     { key: "DBBLBank", label: "DBBL Bank", img: "https://i.ibb.co/vH2fPBm/DBBLBank.png" },
   ];


   const [allEmployees] = useAllEmployee([]);
   

  return (
    <div className="mb-5">


<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5 my-5">
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
        style={{ backgroundColor: '#f7e8e8', border: 'var(--border)' }}
        className="balance-card rounded-2xl text-center shadow-xl transition-transform transform hover:scale-105"
      >
        <h1 className="px-3 text-black text-xl font-bold text-center">TOTAL</h1>
        <p className="card-title pb-5">
          <span>৳ </span>  ৳ {new Intl.NumberFormat('en-IN').format(displayedItems?.reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    ).toFixed(0))}
          {}
        </p>
      </div>
    </div>

<div className='side-space' >
<div className="f-between text-black  mb-5 ">
{
                userr?.role === 'employee' ?
        <button
      className="add"
       onClick={() => document.getElementById("my_modal_8").showModal()}
     >
        Pay Now
</button> : <div></div>}
<div className="flex flex-col  sm:flex-row justify-end items-center gap-3">

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
<option value="">Select Year</option> {/* Default option */}
{Array.from({ length: 2035 - 2024 + 1 }, (_, i) => 2024 + i).map((year) => (
  <option key={year} value={year}>
    {year}
  </option>
))}
</select>

</div>
</div>

       <div className="table-div rounded-lg " >
          <table className="min-w-full text-center  rounded-lg">
            <thead className=" ">
              <tr className="tr1">
              <th className="text-center">Items {displayedItems?.length}</th>
              <th>Date</th>
              <th>Employee Name</th>
              <th>Client Name</th>
              <th> Amount</th>
              <th className="text-center">Payment Method</th>
              <th>Note</th>
             
            </tr>
          </thead>
          <tbody>
          {displayedItems?.map((payment, index) => (
              <tr
              key={payment?._id}
              className={`tr2`}
            >
                <td className=" text-center">
                
                <div className="f-center">
                <button
className=" delete"
onClick={() => handledelete(payment.ids ,payment.id)}
>
<FaMinusSquare  />
</button>
<button
className=" edit"
onClick={() => setModalData(payment)}
>
<FaEdit  />
</button>
                </div>

                      

               
        </td>
                <td >
                  {new Date(payment?.date).toLocaleDateString("en-GB")}
                </td>
                <td>
                <div className='flex justify-start items-center gap-2'>
              <img className='h-10 w-10 rounded-full object-cover' src={allEmployees.find(f => f.email === payment.employeeEmail)?.photo} alt="" />
              <h1>  {allEmployees.find(f => f.email === payment.employeeEmail)?.name}</h1>
              </div>
                 
                </td>
                <td className="hover:font-bold">
                <Link  to={`/client/${payment?.clientEmail}`}>
                {payment?.clientName}
                </Link>
                </td>
                <td
>
  ৳ {payment?.amount || 0}
               </td>
               <td>
  {[
    { 
      method: "bkashMarchent", 
      src: "https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" 
    },
    { 
      method: "bkashPersonal", 
      src: "https://i.ibb.co/520Py6s/bkash-1.png" 
    },
    { 
      method: "rocketPersonal", 
      src: "https://i.ibb.co/QkTM4M3/rocket.png" 
    },
    { 
      method: "nagadPersonal", 
      src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" 
    },
    { 
      method: "nagadMarchent", 
      src: "https://i.ibb.co/WsDkLzc/Nagad-Marchant.png" 
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

          <td>
                 {payment.note?.split(" ").slice(0, 4).join(" ") + (payment.note?.split(" ").length > 4 ? "..." : "")}
            </td>
              </tr>
            ))}
          </tbody>
          <tr  className="font-bold  tr1">
            <td className="p-3 text-right" colSpan="4">
                Total :
            </td>
            <td>
  ৳ {new Intl.NumberFormat('en-IN').format(displayedItems?.reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    ).toFixed(0))}
            </td>
            <td ></td>
            <td ></td>
          </tr>
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
      {payment && (
                      <dialog className="modal" open>
                      <div className="modal-box text-black bg-white font-bold">
                      <form onSubmit={(e) => handleUpdatePayment(e, payment.ids ,payment.id)}>
                      <div className="mb-4">
                          <label className="block text-left text-gray-700">Date</label>
                          <input
                            type="date"
                            defaultValue={payment?.date}
                            name="date"
                            className="input2"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-left text-gray-700">Amount</label>
                          <input
                            type="number"
                            name="amount"
                            defaultValue={payment?.amount}
                            className="input2"
                          />
                        </div>
                        
                        <div className="mb-4">
                        <div className="mt-2 grid lg:grid-cols-3">
                      {[
                      { value: "bank", label: "Brack Bank" },
                      { value: "DBBLBank", label: "DBBL Bank" },
                      { value: "IBBLBank", label: "Islami Bank" },
                      { value: "bkashMarchent", label: "Bkash Marchent" },
                      { value: "bkashPersonal", label: "bKash Personal" },
                      { value: "nagadPersonal", label: "Nagad Personal" },
                      { value: "rocketPersonal", label: "Rocket Personal" },
                      ].map(({ value, label }) => (
                      <div className="form-control" key={value}>
                      <label className="label flex justify-start items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={value}
                        defaultChecked={payment.paymentMethod === value}
                        className="radio radio-primary"
                      />
                      <span className="label-text text-black">{label}</span>
                      </label>
                      </div>
                      ))}
                      </div>
                      
                      </div>
                        <div className="mb-4">
                          <label className="block text-left text-gray-700">Note</label>
                          <input
                            type="text"
                            name="note"
                            defaultValue={payment?.note}
                            className="input2"
                          />
                        </div>
                      
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <button
                            type="button"
                            className="close"
                            onClick={() => setModalData(null)}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="add"
                          >
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

export default ClientPayments;
