import { useEffect, useState } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import useMpayment from "../../Hook/UseMpayment";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useUsers from "../../Hook/useUsers";

const AllClientsPayments = () => {
  const [MPayment, refetch] = useMpayment();
  const AxiosPublic = UseAxiosPublic();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [totalPayment, setTotalPayment] = useState(0);
  const [users] = useUsers();
  const [employees, setEmployees] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAll, setShowAll] = useState(false);
  const [itemsToShow] = useState(200); 
  const displayedItems = showAll ? filteredData : filteredData.slice(0, itemsToShow);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const initialTab = localStorage.getItem("activeTaballClientspays") ;
  const [sortMonth, setSortMonth] = useState(initialTab); 
  
  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballClientspays", tab); 
  };

  const initialTab2 = localStorage.getItem("activeTaballClientsemp") ;
  const [selectedEmployee, setSelectedEmployee] = useState(initialTab2); 
  
  const changeTab2 = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem("activeTaballClientsemp", tab); 
  };

  
  // Fetch employees when users are available
  useEffect(() => {
    if (users) {
      setEmployees(users.filter((u) => u.role === "employee"));
    }
  }, [users]);
  
  // Filter MPayment data based on selected filters
  useEffect(() => {
    const filtered = MPayment.filter((payment) =>
      (selectedEmployee ? payment.employeeEmail === selectedEmployee : true) &&
      (sortMonth ? new Date(payment.date).getMonth() + 1 === parseInt(sortMonth) : true) &&
      (selectedDate ? payment.date === selectedDate : true) &&
      (selectedCategory ? payment.paymentMethod === selectedCategory : true) &&
      (selectedYear ? new Date(payment.date).getFullYear() === parseInt(selectedYear) : true)
    );
  
    setFilteredData(filtered);
  }, [sortMonth, selectedDate, selectedCategory,  MPayment, selectedEmployee, selectedYear]);
  
  // Calculate total payment based on displayed items
  useEffect(() => {
    const totalBill = displayedItems.reduce(
      (acc, campaign) => acc + parseFloat(campaign.amount),
      0
    );
    setTotalPayment(totalBill);
  }, [MPayment, displayedItems]);
  
  // Open and close modal for payment editing
  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
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
        AxiosPublic.delete(`/MPayment/${id}`).then((res) => {
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


  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedPayment = {
      ...selectedPayment,
      date: e.target.date.value,
      amount: parseFloat(e.target.amount.value),
      method: e.target.method.value,
      note: e.target.note.value,
    };

    AxiosPublic.patch(
      `https://digital-networking-server.vercel.app/MPayment/${selectedPayment._id}`,
      updatedPayment
    ).then((res) => {
      handleCancel();
      refetch();
    });
  };

  const [bkashMarcent, setBkashMarcentTotal] = useState(0);
  const [nagadPersonal, setNagadPersonalTotal] = useState(0);
  const [bkashPersonal, setBkashPersonalTotal] = useState(0);
  const [rocketPersonal, setRocketPersonalTotal] = useState(0);
  const [bankTotal, setBankTotal] = useState(0);

  useEffect(() => {
    AxiosPublic.get(`https://digital-networking-server.vercel.app/Mpayment`)
      .then((res) => {
        const da = res.data;
        const filtered = res.data;

        const filter2 = filtered.filter(
          (d) => d.paymentMethod === 'bkashMarchent'
        );
        const total = filter2.reduce((acc, datas) => acc + parseFloat(datas.amount), 0);
        setBkashMarcentTotal(total);

        const filter3 = filtered.filter(
          (d) => d.paymentMethod === 'nagadPersonal'
        );
        const total3 = filter3.reduce((acc, datas) => acc + parseFloat(datas.amount), 0);
        setNagadPersonalTotal(total3);

        const filter4 = filtered.filter(
          (d) => d.paymentMethod === 'bkashPersonal'
        );
        const total4 = filter4.reduce((acc, datas) => acc + parseFloat(datas.amount), 0);
        setBkashPersonalTotal(total4);

        const filter5 = filtered.filter(
          (d) => d.paymentMethod === 'rocketPersonal'
        );
        const total5 = filter5.reduce((acc, datas) => acc + parseFloat(datas.amount), 0);
        setRocketPersonalTotal(total5);

        const filter6 = filtered.filter(
          (d) => d.paymentMethod === 'bank'
        );
        const total6 = filter6.reduce((acc, datas) => acc + parseFloat(datas.amount), 0);
        setBankTotal(total6);
      });
  }, []);



  


  return (
    <div className="">
      <Helmet>
        <title>Clients Payment | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-6 gap-3 lg:gap-5   px-5 pb-5">
   <div onClick={() => setSelectedCategory('bkashMarchent')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center  transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashMarcent}</p>
   </div>
   <div onClick={() => setSelectedCategory('bkashPersonal')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashPersonal}</p>
   </div>
   <div onClick={() => setSelectedCategory('nagadPersonal')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {nagadPersonal}</p>
   </div>
   <div onClick={() => setSelectedCategory('rocketPersonal')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {rocketPersonal}</p>
   </div>

   <div onClick={() => setSelectedCategory('bank')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <h1 className="text-3xl font-bold text-black">Total BDT</h1>
     <p className="balance-card-text text-lg lg:text-2xl mt-8 font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashPersonal + bkashMarcent + nagadPersonal + rocketPersonal + bankTotal}</p>
   </div>
     </div>

{/* ///////////////////////////////////////////////////////////////// */}
      <div className="lg:flex text-black lg:justify-end gap-5 items-center">
        <div className="lg:flex space-y-5 lg:space-y-0 lg:justify-center items-center gap-5   ">

        <div className="flex justify-center gap-5">
        <div className="flex  justify-center text-start items-start">
         
         <select
           className="border bg-white text-black border-gray-400 rounded p-2 mt-1 "
           value={selectedEmployee}
           onChange={(e) => changeTab2(e.target.value)}
         >
           <option value="">All Employee</option>
           {employees.map((employee) => (
             <option key={employee._id} value={employee.email}>
               {employee.name}
             </option>
           ))}
         </select>
       </div>

     



     <div className="flex text-black justify-center gap-5 items-center ">
        
        <select
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
        
              <div className="flex justify-center gap-5">


    <div className="flex  justify-center items-start">
           
           <select
             className="border bg-white text-black border-gray-400 rounded p-2 mt-1"
             value={sortMonth}
             onChange={(e) => changeTab(e.target.value)}
           >
             <option value="">Select Month</option>
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
         <div className="flex  mr-5  justify-center items-start">
       
       <input
         type="date"
         className="border rounded bg-green-300 text-black border-gray-400 p-2 mt-1"
         value={selectedDate}
         onChange={(e) => setSelectedDate(e.target.value)}
       />
     </div>
      
              </div>
             
         
        </div>
       
      </div>

      <div className="overflow-x-auto text-black rounded-xl my-5 border border-gray-400 mx-5">
        <table className="min-w-full bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Client Name</th>
              <th className="p-3"> Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Note</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((payment, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">
                  {index + 1}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>

                <td className="p-3 hover:text-blue-700 hover:font-bold border-r-2 border-gray-200 text-start">
                <Link to={`/dashboard/client/${payment.clientEmail}`}>
                {payment.clientName}
                </Link>
                </td>
              
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  ৳ {payment.amount}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
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
                  {payment.paymentMethod === "bank" && (
                    <img
                      className="h-12 w-13 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png"
                      alt=""
                    />
                  )}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  {payment.note}
                </td>
               
                <td className="p-3 border-r-2 flex gap-3 justify-center items-center border-gray-200 text-center">
               
                       <button
                          className="bg-green-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                          onClick={() => handleEditClick(payment)}
                        >
                       Edit
                        </button>
                        <button
                         className="bg-red-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(payment._id)}
                        >
                          Delete
                        </button>
                  
                
                </td>
              </tr>
            ))}
          </tbody>
          <tr className="bg-[#05a0db] text-white font-bold">
              <td className="p-3 text-right" colSpan="3">
                Total Amount =
              </td>
              <td className="p-3 text-center">৳ {totalPayment}</td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
            
            </tr>
        </table>
      </div>
     
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4 text-center text-black">Edit Payment</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  defaultValue={selectedPayment.date}
                  className="w-full border bg-white border-black border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-700">
                  Payment Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  defaultValue={selectedPayment.amount}
                  className="w-full border bg-white border-black border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="method" className="block text-gray-700">
                  Payment Method
                </label>
                <select
                  id="method"
                  name="method"
                  defaultValue={selectedPayment.paymentMethod}
                  className="w-full border bg-white border-black border-gray-300 p-2 rounded-lg"
                  required
                >
                  <option value="bkashPersonal">bKash Personal</option>
                  <option value="bkashMarchent">bKash Marcent</option>
                  <option value="nagadPersonal">Nagad Personal</option>
                  <option value="rocketPersonal">Rocket Personal</option>
                  <option value="bank">Bank</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="note" className="block text-gray-700">
                  Note
                </label>
                <textarea
                  id="note"
                  name="note"
                  defaultValue={selectedPayment.note}
                  className="w-full border bg-white border-black border-gray-300 p-2 rounded-lg"
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-500 text-white hover:bg-red-700  px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {!showAll && filteredData.length > itemsToShow && (
  <button
    onClick={() => setShowAll(true)}
    className="mt-4 p-2 mx-auto flex justify-center my-10 bg-blue-500 text-white rounded"
  >
    Show All
  </button>
)}
{showAll && (
  <button
    onClick={() => setShowAll(false)}
    className="mt-4 p-2  mx-auto flex justify-center my-10 bg-gray-500 text-white rounded"
  >
    Show Less
  </button>
)}
    </div>
  );
};

export default AllClientsPayments;
