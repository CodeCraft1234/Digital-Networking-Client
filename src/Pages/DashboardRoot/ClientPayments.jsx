import { useContext, useEffect, useState } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaMinusSquare } from "react-icons/fa";
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
  
  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem("act") || "all" 
  : localStorage.getItem("act") || user?.email; 

const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab); // Update the state
    localStorage.setItem("act", tab); // Update localStorage
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
  const itemsPerPage = 20;

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

  return (
    <div className="">


      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-5 my-5 ">

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
                   style={{ backgroundColor: '#d9f8d9', border: 'var(--border)' }} 
                   className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
                 >
                   <h1 className="px-3 text-black text-xl font-bold text-center">TOTAL</h1>
                   <p className="balance-card-text text-lg mt-2 lg:text-xl font-bold text-gray-700">
                     <span className="text-lg lg:text-xl font-extrabold">৳</span>
                     {myclients
                     ?.flatMap(client => client.payments || [])?.reduce(
                      (acc, payment) => acc + parseFloat(payment?.amount || 0),
                           0
                      ).toFixed(0)}
                   </p>
         </div>
         </div>

<div className='side-space' >
<div className="f-end text-black  mb-5 ">
  <div className="flex flex-wrap lg:flex-nowrap gap-3 justify-center items-center">

    {userr?.role === "admin" && (
      <select
        style={{
          backgroundColor: "var(--bg-color2)",
          border: "var(--border)",
          color: "var(--text-color2)",
        }}
        className="border bg-white text-black py-2 lg:w-auto w-full border-gray-400 rounded px-2"
        value={selectedEmployee3}
        onChange={(e) => changeTab3(e.target.value)}
      >
        <option value="all">All Employees</option>
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
      style={{
        backgroundColor: "var(--bg-color2)",
        border: "var(--border)",
        color: "var(--text-color2)",
      }}
      className="border bg-white text-black border-gray-400 rounded p-2 mt-1.5"
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
      ].map((month, index) => (
        <option key={index + 1} value={index + 1}>
          {month}
        </option>
      ))}
    </select>

    <select
      style={{
        backgroundColor: "var(--bg-color2)",
        border: "var(--border)",
        color: "var(--text-color2)",
      }}
      className="hidden lg:flex border bg-white text-black border-gray-400 rounded p-2 mt-1"
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
    >
      {Array.from({ length: 31 }, (_, i) => 2020 + i).map((year) => (
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
              <th>Payment Date</th>
              <th>Client Name</th>
              <th> Amount</th>
              <th className="text-center">Payment Method</th>
              <th>Note</th>
             
            </tr>
          </thead>
          <tbody>
            {displayedItems
  ?.flatMap((client) => client.payments || [])
  ?.filter((payment) => {
    const paymentYear = new Date(payment?.date).getFullYear();
    const paymentMonth = new Date(payment?.date).getMonth() + 1;

    return (
      (!selectedCategory || 
       selectedCategory === "All" || 
       payment?.paymentMethod === selectedCategory) &&
      (!selectedYear || paymentYear === parseInt(selectedYear, 10)) &&
      (sortMonth === "all" || paymentMonth === parseInt(sortMonth, 10))
    );
  })
  ?.map((payment, index) => (
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
                        </div>
                </td>
                <td >
                  {new Date(payment?.date).toLocaleDateString("en-GB")}
                </td>
                <td>
                <Link to={`/dashboard/client/${payment?.clientEmail}`}>
                {payment?.clientName}
                </Link>
                </td>
                <td
>
  ৳{' '}
  {new Intl.NumberFormat('en-IN').format(
    parseFloat(payment?.amount || 0) // Use 0 as a fallback if payment.amount is null or undefined
  )}
               </td>
                <td>
  {[
    { method: "bkashMarchent", src: "https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" },
    { method: "bkashPersonal", src: "https://i.ibb.co/520Py6s/bkash-1.png" },
    { method: "rocketPersonal", src: "https://i.ibb.co/QkTM4M3/rocket.png" },
    { method: "nagadPersonal", src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" },
    { method: "nagadMarchent", src: "https://i.ibb.co.com/WsDkLzc/Nagad-Marchant.png" },
    { method: "DBBLBank", src: "https://i.ibb.co.com/nnN8KW0/DBBL.png", size: "h-12 w-13" },
    { method: "IBBLBank", src: "https://i.ibb.co.com/yfMSDcd/IBBL.png", size: "h-12 w-13" },
    { method: "bank", src: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png", size: "h-12 w-13" },
  ].map(
    ({ method, src, size = "h-10 w-24" }) =>
      payment?.paymentMethod === method && (
        <img
          key={method}
          className={`${size} flex mx-auto my-auto items-center justify-center`}
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
  ৳ {new Intl.NumberFormat('en-IN').format(myclients
  ?.flatMap(client => client.payments || [])?.reduce(
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
        {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}
    </div>
  );
};

export default ClientPayments;
