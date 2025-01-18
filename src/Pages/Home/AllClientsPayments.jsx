import { useEffect, useState } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useMypymentsByEmail from "../../Hook/useMyMPayments";
import { FaMinusSquare } from "react-icons/fa";
import useMyClientsByEmail from "../../Hook/useMyClientsByEmail";
import toast from "react-hot-toast";
import useAllEmployee from "../../Hook/useAllEmployee";

const AllClientsPayments = () => {
  const initialTab2 = localStorage.getItem("active22");
  const [selectedEmployee, setSelectedEmployee] = useState(initialTab2)
  const [myclients]=useMyClientsByEmail(selectedEmployee)
  const [Mypayments,refetch]=useMypymentsByEmail(selectedEmployee)
  const AxiosPublic = UseAxiosPublic();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [allEmployees]=useAllEmployee()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());


  const tPay = Mypayments
      
  ?.filter(campaign => myclients.some(client => client.clientEmail === campaign.clientEmail))
  
  const initialTab = localStorage.getItem("activeTabclientpayMont") || "All";
  const [sortMonth, setSortMonth] = useState(initialTab || new Date().getMonth() + 1)

  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTabclientpayMont", tab); 
  };

  const changeTab2 = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem("active22", tab); 
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
  

  useEffect(() => {
    const totalBill = filteredData.reduce((acc, campaign) => acc + parseFloat(campaign.amount), 0);
    setTotalPayment(totalBill);
  }, [tPay,filteredData, selectedEmployee]);


  const handleDelete = (id) => {
    // Show confirmation dialog
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
        // Proceed with delete
        AxiosPublic.delete(`/MPayment/${id}`)
          .then((res) => {
            toast.success("Delete successful!");
            refetch();
          })
          .catch((error) => {
            toast.error("Failed to delete. Please try again.");
          });
      }
    });
  };


  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedPayment = {
      ...selectedPayment,
      date: e.target.date.value,
      amount: parseFloat(e.target.amount.value),
      paymentMethod: e.target.paymentMethod.value,
      note: e.target.note.value,
    };

    AxiosPublic.patch(`/Mpayment/${selectedPayment._id}`,
      updatedPayment
    ).then((res) => {
      toast.success("Payment Update successful!");
      refetch();
      handleCancel();
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const displayedItems = filteredData.slice(0, currentPage * itemsPerPage);
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

  const [bkashMarcent,setBkashMarcentTotal]=useState(0)
  const [nagadPersonal,setNagadPersonalTotal]=useState(0)
  const [bkashPersonal,setBkashPersonalTotal]=useState(0)
  const [rocketPersonal,setRocketPersonalTotal]=useState(0)
  const [bankTotal,setBankTotal]=useState(0)
  const [total,setTotal]=useState(0)
  const [IBBLBankTotal, setIBBLBankTotal] = useState(0);
  const [DBBLBankTotal, setDBBLBankTotal] = useState(0);

  useEffect(()=>{
          const filtered=tPay

          const filter2=filtered.filter(d=>d.paymentMethod === 'bkashMarchent')
          const total = filter2.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setBkashMarcentTotal(total)

          const filter3=filtered.filter(d=>d.paymentMethod === 'nagadPersonal')
          const total3 = filter3.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setNagadPersonalTotal(total3)

          const filter4=filtered.filter(d=>d.paymentMethod === 'bkashPersonal')
          const total4 = filter4.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setBkashPersonalTotal(total4)

          const filter5=filtered.filter(d=>d.paymentMethod === 'rocketPersonal')
          const total5 = filter5.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setRocketPersonalTotal(total5)

          const filter6=filtered.filter(d=>d.paymentMethod === 'bank')
          const total6 = filter6.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setBankTotal(total6)

          const filter8 = filtered.filter(d => d.paymentMethod === 'IBBLBank');
          const total8 = filter8.reduce((acc, datas) => acc + parseFloat(datas.amount), 0);
          setIBBLBankTotal(total8);

          const filter9 = filtered.filter(d => d.paymentMethod === 'DBBLBank');
          const total9 = filter9.reduce((acc, datas) => acc + parseFloat(datas.amount), 0);
          setDBBLBankTotal(total9);

          const totaly = filtered.reduce((acc, datas) => acc + parseFloat(datas.amount), 0);
          setTotal(totaly);

      
  },[tPay])





  return (
    <div className="m-5">


      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-3 lg:gap-5 px-5 p-5 rounded-lg">
  {[
       
    { category: 'bkashMarchent', img: 'https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png', amount: bkashMarcent, bgColor: '#f7e8e8' },
    { category: 'bkashPersonal', img: 'https://i.ibb.co/520Py6s/bkash-1.png', amount: bkashPersonal, bgColor: '#ffe6f7' },
    { category: 'nagadPersonal', img: 'https://i.ibb.co/JQBQBcF/nagad-marchant.png', amount: nagadPersonal, bgColor: '#fff2cc' },
    { category: 'rocketPersonal', img: 'https://i.ibb.co/QkTM4M3/rocket.png', amount: rocketPersonal, bgColor: '#e0f7fa' },
    { category: 'bank', img: 'https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png', amount: bankTotal, bgColor: '#f2f2f2' },
    { category: 'DBBLBank', img: 'https://i.ibb.co.com/nnN8KW0/DBBL.png', amount: DBBLBankTotal, bgColor: '#f2f2f2' },
    { category: 'IBBLBank', img: 'https://i.ibb.co.com/yfMSDcd/IBBL.png', amount: IBBLBankTotal, bgColor: '#f2f2f2' },

    { category: 'All', img: '', amount: total, bgColor: '#d9f8d9', total: true }
  ].map(({ category, img, amount, bgColor, total }) => (
<div
  style={{ backgroundColor: bgColor, border: "var(--border)" }}
  key={category}
  onClick={() => setSelectedCategory(category)}
  className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform hover:scale-105 border-0"
>
  {total ? (
    <>
      <h1 className="text-3xl font-bold mt-3 text-black">Total BDT</h1>
      <p className="balance-card-text text-lg lg:text-2xl mt-8 font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>{" "}
        {new Intl.NumberFormat("en-IN").format(amount)}
      </p>
    </>
  ) : (
    <>
      <img
        className=" h-20 "
        src={img}
        alt={category}
      />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>{" "}
        {new Intl.NumberFormat("en-IN").format(amount)}
      </p>
    </>
  )}
</div>

  ))}
</div>



{/* ///////////////////////////////////////////////////////////////// */}
<div className='px-5 py-5  my-5 mt-5 rounded-lg' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>

<div className="lg:flex text-black lg:justify-start mb-5 gap-3 items-center">
  <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:gap-3 justify-center items-center">

    <div className="flex flex-wrap gap-3 lg:gap-3 justify-center items-start">
      <div className="flex justify-center text-start items-start">
        <select
         style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
          className="border bg-white text-black border-gray-400 rounded p-2 mt-1"
          value={selectedEmployee}
          onChange={(e) => changeTab2(e.target.value)}
        >
          {allEmployees.filter(u=>u.role === "employee").map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center items-start">
        <select
         style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
          className="border bg-white text-black border-gray-400 rounded p-2 mt-1"
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
  className="select2"
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
>
  <option value="">Select Year</option> {/* Default option */}
  {[...new Set(displayedItems?.map((campaign) => new Date(campaign.date).getFullYear()))]
    .sort((a, b) => a - b) // Ensure the years are sorted in ascending order
    .map((year) => (
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
              <th className="p-3">{displayedItems.length}</th>
              <th className="p-3 text-left">Payment Date</th>
              <th className="p-3 text-left">Client Name</th>
              <th className="p-3 text-left"> Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3 text-left">Note</th>
             
            </tr>
          </thead>
          <tbody>
            {displayedItems.sort((a, b) => new Date(b.date) - new Date(a.date))?.map((payment, index) => (
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
                        className="text-red-600 text-xl hover:bg-blue-700  px-2 py-1 rounded"
                          onClick={() => handleDelete(payment._id)}
                        >
                          <FaMinusSquare  />
                        </button>
                       {/* <button
                        className="flex justify-start items-center gap-2"
                          onClick={() => handleEditClick(payment)}
                        >
                        <FaEdit />
                        </button> */}
                      
                        </div>
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-left">
                  {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>

                <td style={{  border: 'var(--border)'}} className="p-3 hover:text-blue-700 hover:font-bold border-r-2 border-gray-200 text-start">
                <Link to={`/dashboard/client/${payment.clientEmail}`}>
                {payment.clientName}
                </Link>
                </td>
              
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-left">
                  ৳  {new Intl.NumberFormat('en-IN').format(payment.amount)}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  {payment.paymentMethod === "bkashMarchent" && (
                    <img
                      className="h-10 w-24 flex mx-auto my-auto items-center justify-center"
                      src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png"
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
                  {payment.paymentMethod === "nagadMarchent" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co.com/WsDkLzc/Nagad-Marchant.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "DBBLBank" && (
                    <img
                      className="h-12 w-13 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co.com/nnN8KW0/DBBL.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "IBBLBank" && (
                    <img
                      className="h-12 w-13 flex my-auto items-center mx-auto justify-center"
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
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-left">
                  {payment.note}
                </td>
               
             
              </tr>
            ))}
          </tbody>
          <tr style={{backgroundColor: 'var(--bg-color)',border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}} className=" font-bold">
              <td className="p-3 text-right" colSpan="3">
                Total :
              </td>
              <td className="p-3 text-left">
  ৳ {new Intl.NumberFormat('en-IN').format(total)}
</td>

              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
             
            
            </tr>
        </table>
      </div>
      </div>
     
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box text-black bg-white font-bold">
        <form onSubmit={(e) => handleUpdate(e, selectedPayment?._id)}>
        <div className="mb-4">
            <label className="block text-left text-gray-700">Date</label>
            <input
              type="date"
              defaultValue={selectedPayment?.date}
              name="date"
              className="w-full border bg-green-300 border-black p-2 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-left text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              defaultValue={selectedPayment?.amount}
              className="w-full border bg-white border-black p-2 rounded-lg"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-left text-gray-700">Method</label>
            <select
              name="paymentMethod"
              defaultValue={selectedPayment?.paymentMethod}
              className="w-full border bg-white border-black p-2 rounded-lg"
            >
             
              <option value="bkashMarchent">Bkash Marchent</option>
              <option value="bkashPersonal">Bkash Personal</option>
              <option value="nagadPersonal">Nagad Personal</option>
              <option value="rocketPersonal">Rocket Personal</option>
              <option value="bank">Brack Bank</option>
              <option value="DBBLBank">DBBL Bank</option>
              <option value="IBBLBank">IBBL Bank</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-left text-gray-700">Note</label>
            <input
              type="text"
              name="note"
              defaultValue={selectedPayment?.note}
              className="w-full border bg-white border-black p-2 rounded-lg"
            />
          </div>

          {/* Buttons at the bottom in a two-grid layout */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-red-700 bg-red-600 text-white text-center"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
            <button
              type="submit"
              className="font-avenir hover:bg-indigo-700 px-3 py-2 bg-[#05a0db] rounded-lg text-white text-center"
            >
              Update
            </button>
          </div>
        </form>
      </div>
        </div>
      )}
        {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}
    </div>
  );
};

export default AllClientsPayments;
