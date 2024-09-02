
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { IoIosSearch } from "react-icons/io";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import Swal from "sweetalert2";
import useUsers from "../../Hook/useUsers";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const EmployeePayments = () => {
  const [employeePayment, refetch] = useEmployeePayment();
  const AxiosPublic = UseAxiosPublic();
  const [totalPayment, setTotalPayment] = useState(0);
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [filteredClients, setFilteredClients] = useState([]);
  const [sortMonth, setSortMonth] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (users && user) {
      const employeeList = users.filter((u) => u.role === "employee");
      setEmployees(employeeList);
    }
  }, [users, user]);

  useEffect(() => {
    if (employeePayment) {
      setFilteredClients(employeePayment);
    }
  }, [employeePayment]);

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    if (!sortMonth) {
      setSortMonth(currentMonth.toString());
    }
  }, [sortMonth]);

  useEffect(() => {
    let filtered = employeePayment;

    if (selectedEmployee) {
      filtered = filtered.filter((c) => c.employeeEmail === selectedEmployee);
    }

    if (sortMonth !== "") {
      filtered = filtered.filter((c) => {
        const month = new Date(c.date).getMonth() + 1;
        return month === parseInt(sortMonth);
      });
    }

    if (selectedDate) {
      filtered = filtered.filter((c) => {
        const paymentDate = new Date(c.date);
        const selected = new Date(selectedDate);
        return (
          paymentDate.getDate() === selected.getDate() &&
          paymentDate.getMonth() === selected.getMonth() &&
          paymentDate.getFullYear() === selected.getFullYear()
        );
      });
    }

    if (selectedStatus) {
      filtered = filtered.filter((c) => c.status === selectedStatus);
    }

    setFilteredClients(filtered);
  }, [selectedEmployee, sortMonth, selectedDate, selectedStatus, employeePayment]);

  const filteredByCategory = selectedCategory
    ? filteredClients.filter(
        (item) =>
          item.paymentMethod.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredClients;

  useEffect(() => {
    const totalBill = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount),
      0
    );
    setTotalPayment(totalBill);
  }, [filteredByCategory]);

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
        AxiosPublic.delete(`/employeePayment/${id}`).then((res) => {
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

  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (orderId) => {
    setActiveDropdown(activeDropdown === orderId ? null : orderId);
  };

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
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
      payAmount: parseFloat(e.target.amount.value),
      paymentMethod: e.target.method.value,
      note: e.target.note.value,
    };

    AxiosPublic.patch(
      `https://digital-networking-server.vercel.app/employeePayment/${selectedPayment._id}`,
      updatedPayment
    ).then((res) => {
      handleCancel();
      refetch();
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
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign");
      });
  };




  const [bkashMarcent, setBkashMarcentTotal] = useState(0);
  const [nagadPersonal, setNagadPersonalTotal] = useState(0);
  const [bkashPersonal, setBkashPersonalTotal] = useState(0);
  const [rocketPersonal, setRocketPersonalTotal] = useState(0);
  const [bankTotal, setBankTotal] = useState(0);

  useEffect(() => {
    const filtered = employeePayment;
    const filter2 = filtered.filter(d => d.paymentMethod === 'bkashMarchent');
    const total = filter2.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setBkashMarcentTotal(total);

    const filter3 = filtered.filter(d => d.paymentMethod === 'nagadPersonal');
    const total3 = filter3.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setNagadPersonalTotal(total3);

    const filter4 = filtered.filter(d => d.paymentMethod === 'bkashPersonal');
    const total4 = filter4.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setBkashPersonalTotal(total4);

    const filter5 = filtered.filter(d => d.paymentMethod === 'rocketPersonal');
    const total5 = filter5.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setRocketPersonalTotal(total5);

    const filter6 = filtered.filter(d => d.paymentMethod === 'bank');
    const total6 = filter6.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setBankTotal(total6);
  }, [employeePayment]);

  const sortByDateDescending = (items) => {
    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
  };


  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Set current year as default

  // Create an array of years from 2020 to 2050
  const years = Array.from({ length: 31 }, (_, i) => 2020 + i);

  // Filter employee payments by selected year
  useEffect(() => {
    const filteredByYear = employeePayment.filter(payment => {
      const paymentYear = new Date(payment.date).getFullYear();
      return paymentYear === selectedYear;
    });
    setFilteredClients(filteredByYear);
  }, [employeePayment, selectedYear]);

  // Sorted items
  const sortedItems = sortByDateDescending(filteredByCategory);

  const [showAll, setShowAll] = useState(false); // State to handle showing all data
  const [itemsToShow, setItemsToShow] = useState(200); // Number of items to show initially
  const displayedItems = showAll ? sortedItems : sortedItems.slice(0, itemsToShow);



  return (
    <div className="">
      <Helmet>
        <title>Employee Payments | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>


      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3   lg:grid-cols-6 gap-5  p-5">
   <div  onClick={() => setSelectedCategory('bkashMarchent')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center  transition-transform transform hover:scale-105 border-0">
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

   <div onClick={() => setSelectedCategory('bank')} className="balance-card bg-white rounded-2xl shadow-lg p-5  text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img  " src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
     {/* <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Received : ৳</span> {bankTotal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Cashout : ৳</span> {bankTotal2}</p> */}
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> { bankTotal }</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <h1 className="text-3xl font-bold text-black">Total BDT</h1>
     {/* <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Received : ৳</span> {bankTotal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Cashout : ৳</span> {bankTotal2}</p> */}
     <p className="balance-card-text text-lg lg:text-2xl mt-8 font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashPersonal + bkashMarcent + nagadPersonal + rocketPersonal + bankTotal}</p>
   </div>
     </div>
      <div className="flex text-black justify-between ml-5  items-center">
      <div className="flex flex-col justify-start text-start items-start">
         
         <select
           className="border bg-white text-black border-gray-400 rounded p-2 mt-1 "
           value={selectedEmployee}
           onChange={(e) => setSelectedEmployee(e.target.value)}
         >
           <option value="">All Employee</option>
           {employees.map((employee) => (
             <option key={employee._id} value={employee.email}>
               {employee.name}
             </option>
           ))}
         </select>
       </div>
        <div className="flex justify-end items-center gap-5 ">
         
          <div className="flex flex-col justify-center items-start">
         
            <select
              className="border bg-white text-black border-gray-400 rounded p-2 mt-1"
              value={sortMonth}
              onChange={(e) => setSortMonth(e.target.value)}
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

          <div className="filter-options">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="year-selector py-2 px-6 border border-gray-600 mt-1 bg-white text-black"
        >
          {years.map((year) => (
            <option className="bg-white text-black" key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
          <div className="flex flex-col justify-center items-start">
           
            <input
              type="date"
              className="border mr-5 rounded bg-green-300 text-black border-gray-400 p-2 mt-1"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

        </div>

      </div>

      <div className="overflow-x-auto mt-5 text-black rounded-xl border border-gray-400 mx-5">
        <table className="min-w-full bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3"><span  onClick={() => setSelectedStatus('pending')} >OFF</span> / <span  onClick={() => setSelectedStatus('')} >ON</span></th>
              <th className="p-3">Date</th>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Note</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((payment, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                 <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">  <label className="inline-flex items-center cursor-pointer">
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
    className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${
      payment.status !== "pending" ? "bg-blue-700" : "bg-gray-500"
    }`}
  >
    <span
      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-linear transform ${
        payment.status !== "pending" ? "translate-x-6" : ""
      }`}
    ></span>
  </div>
</label>
</td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>
               
                <td className="p-3 border-r-2 hover:text-blue-700 hover:font-bold text-start border-gray-200 ">
                  <Link to={`/dashboard/userInfo/${payment?.employeeEmail}`}>
                  {payment.employeeName}
                  </Link>
                  
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  ৳ {payment.payAmount}
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

                <td className="p-3 border-r-2 border-gray-200 text-center">
                {payment.status === 'pending' ? (
    <button
     
      className=" text-blue-700 font-bold px-2 py-1 rounded"
    >
       Pending
    </button>
  ) : (
    <button

      className="text-green-700 font-bold px-2 py-1 rounded"
    >
     Approved
    </button>
  )}
                </td>

               
   
                <td className="p-3 border-r-2 flex justify-center gap-3 items-center border-gray-200 text-center">
               
                <button
                          className="bg-green-700 text-white px-2 py-1 rounded"
                          onClick={() => handleEditClick(payment)}
                        >
                               Edit
                        </button>
                        <button
                        className="bg-red-700 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(payment._id)}
                        >
                          Delete
                        </button>
                       
                    
                 
                </td>
              </tr>
            ))}
 <tr className="bg-[#05a0db] text-white font-bold">
              <td className="p-3 text-right" colSpan="3">
                Total Amount :
              </td>
              <td className="p-3 text-center">৳ {totalPayment}</td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>

            </tr>
          </tbody>
        </table>
      </div>
     

      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 flex items-center text-black justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-medium text-center text-black mb-4">Edit Payment</h2>
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
                  className="w-full border bg-white border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4 text-black">
                <label htmlFor="amount" className="block text-black">
                  Payment Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  defaultValue={selectedPayment.payAmount}
                  className="w-full border bg-white border-gray-300 p-2 rounded-lg"
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
                  className="w-full border bg-white border-gray-300 p-2 rounded-lg"
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
                  className="w-full border bg-white border-gray-300 p-2 rounded-lg"
                ></textarea>
              </div>
              <div className="flex w-full justify-center">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded mr-2"
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
      {!showAll && filteredByCategory.length > itemsToShow && (
  <button
    onClick={() => setShowAll(true)}
    className="mt-4 p-2  mx-auto flex justify-center my-10 bg-blue-500 text-white rounded"
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

export default EmployeePayments;
