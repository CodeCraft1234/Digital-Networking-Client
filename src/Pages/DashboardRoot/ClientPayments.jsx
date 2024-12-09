import { useContext, useEffect, useState } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useMypymentsByEmail from "../../Hook/useMyMPayments";
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
    ? localStorage.getItem("activeTaballcampaignmonthsss8") || "all"
    : user?.email;

const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab); // Update the state
    localStorage.setItem("activeTaballcampaignmonthsss3", tab); // Update localStorage
  };



  const [myclients, refetch] = useMyClientsByEmail(selectedEmployee3);

  const [Mypayments]=useMypymentsByEmail(user?.email)
  const AxiosPublic = UseAxiosPublic();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());


  const tPay = Mypayments
      
  ?.filter(campaign => myclients.some(client => client.clientEmail === campaign.clientEmail))
  
  const initialTab = localStorage.getItem("activeTabclientpayMont") || "All";
  const [sortMonth, setSortMonth] = useState(initialTab || new Date().getMonth() + 1)

  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTabclientpayMont", tab); 
  };


  useEffect(() => {
    let filtered = tPay;

    if (sortMonth && sortMonth !== " ") {
      filtered = filtered.filter(
        (payment) =>
          new Date(payment.date).getMonth() + 1 === parseInt(sortMonth)
      );
    }
  
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(
        (payment) => payment.paymentMethod === selectedCategory
      );
    }
    

    if (selectedDate) {
      filtered = filtered.filter((payment) => payment.date === selectedDate);
    }
  

  if (selectedYear) {
    filtered = filtered.filter(
      (payment) => new Date(payment.date).getFullYear() === parseInt(selectedYear)
    );
  }

    setFilteredData(filtered);
  }, [sortMonth, selectedDate,selectedYear, selectedCategory, tPay]);
  


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const displayedItems = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date))?.slice(0, currentPage * itemsPerPage);
  const isMoreItems = currentPage * itemsPerPage < filteredData.length;

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
    <div className="m-5">
      <Helmet>
        <title>Clients Payment | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-3 lg:gap-3 mt-3 mb-3">
    
                 <BalanceCard img={`https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png`} amount={myclients
  ?.flatMap(client => client.payments || []).filter(h => h?.paymentMethod === 'bkashMarchent')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co/520Py6s/bkash-1.png`} amount={myclients
  ?.flatMap(client => client.payments || [])?.filter(h => h?.paymentMethod === 'bkashPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co/JQBQBcF/nagad-marchant.png`} amount={myclients
  ?.flatMap(client => client.payments || [])?.filter(h => h?.paymentMethod === 'nagadPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co/QkTM4M3/rocket.png`} amount={myclients
  ?.flatMap(client => client.payments || [])?.filter(h => h?.paymentMethod === 'rocketPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co.com/kG9cBXJ/BBBLBank.png`} amount={myclients
  ?.flatMap(client => client.payments || [])?.filter(h => h?.paymentMethod === 'bank')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co.com/vH2fPBm/DBBLBank.png`} amount={myclients
  ?.flatMap(client => client.payments || [])?.filter(h => h?.paymentMethod === 'DBBLBank')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co.com/pnS6nt4/IBBLBank.png`} amount={myclients
  ?.flatMap(client => client.payments || [])?.filter(h => h?.paymentMethod === 'IBBLBank')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
             
                 <div 
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



{/* ///////////////////////////////////////////////////////////////// */}
<div className='px-5 py-5  my-5 mt-5 rounded-lg' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>

<div className="lg:flex text-black lg:justify-start mb-5 gap-3 items-center">
  <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:gap-3 justify-center items-center">

    <div className="flex flex-wrap gap-3  justify-center items-start">

    <div className="w-full lg:w-auto flex justify-start gap-3">
  {userr?.role === "admin" ? (
    <div className="flex mt-1.5 justify-center">
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
    </div>
  ) : (
   <></>
  )}
</div>

      <div className="flex justify-center items-start">
        <select
         style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
          className="border bg-white text-black border-gray-400 rounded p-2 mt-1.5"
          value={sortMonth}
          onChange={(e) => changeTab(e.target.value)}
        >
          <option value=" ">Select Month</option>
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
    </div>

    <div className="flex flex-wrap gap-3 lg:gap-5 justify-center items-start">
      <div className="hidden lg:flex text-black justify-center items-center">
        <select
         style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
          className="border bg-white text-black border-gray-400 rounded p-2 mt-1"
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
  </div>
</div>

       <div className="overflow-x-auto rounded-xl  text-center " >
          <table className="min-w-full text-center ">
            <thead style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}} className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
              <th className="p-3">{myclients?.flatMap(client => client.payments || [])?.length}</th>
              <th className="p-3 text-left">Payment Date</th>
              <th className="p-3 text-left">Client Name</th>
              <th className="p-3 text-left"> Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3 text-left">Note</th>
             
            </tr>
          </thead>
          <tbody>
            {myclients?.flatMap(client => client.payments || [])?.map((payment, index) => (
              <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
              key={payment?._id}
              className={`${
                index % 2 === 0
                  ? "bg-white text-left text-black border-b border-opacity-20"
                  : "bg-gray-200  text-left text-black border-b border-opacity-20"
              }`}
            >
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-l-2 border-gray-200 text-center">
                
                        <div className="flex justify-center items-center gap-3">
                        <button
    className=" hover:bg-blue-700 text-[#f86c6b] text-xl px-2 py-1 rounded"
    onClick={() => handledelete(payment.ids ,payment.id)}
  >
    <FaMinusSquare  />
  </button>
                        </div>
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-left">
                  {new Date(payment?.date).toLocaleDateString("en-GB")}
                </td>

                <td style={{  border: 'var(--border)'}} className="p-3 hover:text-blue-700 hover:font-bold border-r-2 border-gray-200 text-start">
                <Link to={`/dashboard/client/${payment?.clientEmail}`}>
                {payment?.clientName}
                </Link>
                </td>
              
                <td
  style={{ border: 'var(--border)' }}
  className="p-3 border-r-2 border-gray-200 text-left"
>
  ৳{' '}
  {new Intl.NumberFormat('en-IN').format(
    parseFloat(payment?.amount || 0) // Use 0 as a fallback if payment.amount is null or undefined
  )}
</td>

                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  {payment?.paymentMethod === "bkashMarchent" && (
                    <img
                      className="h-10 w-24 flex mx-auto my-auto items-center justify-center"
                      src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png"
                      alt=""
                    />
                  )}
                  {payment?.paymentMethod === "bkashPersonal" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/520Py6s/bkash-1.png"
                      alt=""
                    />
                  )}
                  {payment?.paymentMethod === "rocketPersonal" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/QkTM4M3/rocket.png"
                      alt=""
                    />
                  )}
                  {payment?.paymentMethod === "nagadPersonal" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/JQBQBcF/nagad-marchant.png"
                      alt=""
                    />
                  )}
                  {payment?.paymentMethod === "nagadMarchent" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co.com/WsDkLzc/Nagad-Marchant.png"
                      alt=""
                    />
                  )}
                  {payment?.paymentMethod === "DBBLBank" && (
                    <img
                      className="h-12 w-13 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co.com/nnN8KW0/DBBL.png"
                      alt=""
                    />
                  )}
                  {payment?.paymentMethod === "IBBLBank" && (
                    <img
                      className="h-12 w-13 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co.com/yfMSDcd/IBBL.png"
                      alt=""
                    />
                  )}
                  {payment?.paymentMethod === "bank" && (
                    <img
                      className="h-12 w-13 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png"
                      alt=""
                    />
                  )}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-left">
                  {payment?.note}
                </td>
               
             
              </tr>
            ))}
          </tbody>
          <tr style={{backgroundColor: 'var(--bg-color)',border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}} className=" font-bold">
              <td className="p-3 text-right" colSpan="3">
                Total :
              </td>
              <td className="p-3 text-left">
  ৳ {new Intl.NumberFormat('en-IN').format(myclients
  ?.flatMap(client => client.payments || [])?.reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    ).toFixed(0))}
</td>

              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
             
            
            </tr>
        </table>
      </div>
      </div>
     
        {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}
    </div>
  );
};

export default ClientPayments;
