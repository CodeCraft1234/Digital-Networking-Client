import { useContext, useEffect, useState } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useMyClientsByEmail from "../../Hook/useMyClientsByEmail";
import toast from "react-hot-toast";
import { AuthContext } from "../../Security/AuthProvider";
import BalanceCard from "./BalanceCard";
import useUserr from "../../Hook/useUser";
import useUsers from "../../Hook/useUsers";

const ClientPayments = () => {
  const { user } = useContext(AuthContext);
  const [users]=useUsers()
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
  const initialTab4 = localStorage.getItem("actt3") || "All";
const [selectedClient, setSelectedClient] = useState(initialTab4);

  const changeTab4 = (tab) => {
    setSelectedClient(tab); // Update the state
    localStorage.setItem("actt3", tab); // Update localStorage
  };

  const [myclients, refetch] = useMyClientsByEmail(selectedEmployee3);
  const AxiosPublic = UseAxiosPublic();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const initialTab = localStorage.getItem("activeTabclientpayMont") || "All";
  const [sortMonth, setSortMonth] = useState(initialTab || new Date().getMonth() + 1)

  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTabclientpayMont", tab); 
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const displayedItems = myclients.sort((a, b) => new Date(b.date) - new Date(a.date))?.slice(0, currentPage * itemsPerPage);
  const isMoreItems = currentPage * itemsPerPage < myclients.length;

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
     const datas = { title: `Update Payment ${amount} from in ${paymentMethod}`, date: new Date(), user: user?.displayName };
   
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

  return (
    <div className="">


      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5 my-5 ">

        <div onClick={() => setSelectedCategory('bkashMarchent')}>
        <BalanceCard  img={`https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png`} amount={myclients
  ?.flatMap(client => client.payments || []).filter(h => h?.paymentMethod === 'bkashMarchent')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
          </div>
        <div onClick={() => setSelectedCategory('bkashPersonal')}>
        <BalanceCard onClick={() => setSelectedCategory(category)} img={`https://i.ibb.co/520Py6s/bkash-1.png`} amount={myclients
  ?.flatMap(client => client.payments || [])?.filter(h => h?.paymentMethod === 'bkashPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
        </div>
        <div onClick={() => setSelectedCategory('nagadPersonal')}>
        <BalanceCard onClick={() => setSelectedCategory(category)} img={`https://i.ibb.co/JQBQBcF/nagad-marchant.png`} amount={myclients
  ?.flatMap(client => client.payments || [])?.filter(h => h?.paymentMethod === 'nagadPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
        </div>
        <div onClick={() => setSelectedCategory('rocketPersonal')}>
        <BalanceCard img={`https://i.ibb.co/QkTM4M3/rocket.png`} amount={myclients
  ?.flatMap(client => client.payments || [])?.filter(h => h?.paymentMethod === 'rocketPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
        </div>
        <div onClick={() => setSelectedCategory('IBBLBank')}>
        <BalanceCard img={`https://i.ibb.co.com/pnS6nt4/IBBLBank.png`} amount={myclients
  ?.flatMap(client => client.payments || [])?.filter(h => h?.paymentMethod === 'IBBLBank')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
        </div>
        <div onClick={() => setSelectedCategory('bank')}>
        <BalanceCard img={`https://i.ibb.co.com/kG9cBXJ/BBBLBank.png`} amount={myclients
  ?.flatMap(client => client.payments || [])?.filter(h => h?.paymentMethod === 'bank')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
        </div>
        <div onClick={() => setSelectedCategory('DBBLBank')}>
        <BalanceCard img={`https://i.ibb.co.com/vH2fPBm/DBBLBank.png`} amount={myclients
  ?.flatMap(client => client.payments || [])?.filter(h => h?.paymentMethod === 'DBBLBank')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
        </div>
    
        <div 
                 onClick={() => setSelectedCategory('All')}
                 style={{ backgroundColor: '#f7e8e8', border: 'var(--border)' }} 
                   className="balance-card rounded-2xl  text-center shadow-xl transition-transform transform hover:scale-105"
                 >
                   <h1 className="px-3 text-black text-xl font-bold text-center">TOTAL</h1>
                   <p className="card-title pb-5">
  <span>৳ </span>
  {new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(
    myclients
      ?.flatMap((client) => client.payments || [])
      ?.reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
  )}
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
  <div className="flex flex-wrap lg:flex-nowrap gap-3 justify-center items-center">

    {userr?.role === "admin" && (
      <select
       
        className="select2"
        value={selectedEmployee3}
        onChange={(e) => changeTab3(e.target.value)}
      >
        <option value="all">Select Digital Marketer</option>
        {users
          .filter((u) => u.role === "employee")
          .map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
      </select>
    )}


<select 
       className="select2"
       value={selectedClient}
       onChange={(e) => changeTab4(e.target.value)}
     >
       <option value="All">All Clients</option>
       {myclients
         .map((employee) => (
           <option key={employee._id} value={employee.clientName}>
             {employee.clientName}
           </option>
         ))}
     </select>

     <select
  className="select2"
  value={sortMonth}
  onChange={(e) => changeTab(e.target.value)}
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
  ].map((month, index) => {
    // Get the months present in the displayedItems or selectedClient
    const monthsInData = [
      ...new Set(
        (selectedClient === "All"
          ? displayedItems?.flatMap(client => client.payments || []) // If "All" clients, get payments from all clients
          : displayedItems?.find(f => f.clientName === selectedClient)?.payments || [] // If specific client, get payments for that client
        )
          .map(payment => new Date(payment?.date).getMonth() + 1) // Extract month from the date
      ),
    ];

    // Check if the current month (index + 1) exists in the monthsInData
    if (monthsInData.includes(index + 1)) {
      return (
        <option key={index + 1} value={index + 1}>
          {month}
        </option>
      );
    }
    return null;
  }).filter(option => option !== null)} {/* Filter out null values */}
</select>

    <select
  className="select2"
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
>
  <option value="" >Select Year</option>
  {[...new Set(
    (selectedClient === "All"
      ? displayedItems?.flatMap(client => client.payments || [])
      : displayedItems?.find(f => f.clientName === selectedClient)?.payments || []
    ).map(payment => new Date(payment?.date).getFullYear())
  )].sort((a, b) => a - b).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>




  </div>
</div>

       <div className="table-div " >
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1">
              <th className="text-center">Items {myclients?.flatMap(client => client.payments || [])?.length}</th>
              <th>Date</th>
              <th>Client Name</th>
              <th> Amount</th>
              <th className="text-center">Payment Method</th>
              <th>Note</th>
             
            </tr>
          </thead>
          <tbody>
          {(selectedClient === "All" 
  ? displayedItems?.flatMap(client => client.payments || []) 
  : displayedItems?.find(f => f.clientName === selectedClient)?.payments || []
)?.filter(payment => {
  const paymentYear = new Date(payment?.date).getFullYear();
  const paymentMonth = new Date(payment?.date).getMonth() + 1;
  return (!selectedCategory || selectedCategory === "All" || payment?.paymentMethod === selectedCategory) &&
         (!selectedYear || paymentYear === parseInt(selectedYear, 10)) &&
         (sortMonth === "all" || paymentMonth === parseInt(sortMonth, 10));
})?.map((payment, index) => (
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
                  {payment?.note}
                </td>
              </tr>
            ))}
          </tbody>
          <tr  className="font-bold tr1">
            <td className="p-3 text-right" colSpan="3">
                Total :
            </td>
            <td>
  ৳ {new Intl.NumberFormat('en-IN').format((selectedClient === "All" 
  ? displayedItems?.flatMap(client => client.payments || []) 
  : displayedItems?.find(f => f.clientName === selectedClient)?.payments || []
)?.filter(payment => {
  const paymentYear = new Date(payment?.date).getFullYear();
  const paymentMonth = new Date(payment?.date).getMonth() + 1;
  return (!selectedCategory || selectedCategory === "All" || payment?.paymentMethod === selectedCategory) &&
         (!selectedYear || paymentYear === parseInt(selectedYear, 10)) &&
         (sortMonth === "all" || paymentMonth === parseInt(sortMonth, 10));
})?.reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    ).toFixed(0))}
            </td>
            <td ></td>
            <td ></td>
          </tr>
        </table>
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
