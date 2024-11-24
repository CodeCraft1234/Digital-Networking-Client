
import { useEffect, useState } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useUsers from "../../Hook/useUsers";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import { toast } from "react-toastify";

const EmployeePayments = () => {
  const [employeePayment, refetch] = useEmployeePayment()
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [users] = useUsers();
  const [employees, setEmployees] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const initialStatus = localStorage.getItem("activeTabSelectedStatus") || 'All';
  const [selectedStatus2, setSelectedStatus2] = useState(initialStatus);

  const changeTab3 = (tab) => {
    setSelectedStatus2(tab);
    localStorage.setItem("activeTabSelectedStatus", tab);
  };
  
  useEffect(() => {
    if (users) {
      setEmployees(users.filter((u) => u.role === "employee"));
    }
  }, [users]);
  
  useEffect(() => {
    const filtered = employeePayment.filter((payment) => {
      const paymentDate = new Date(payment.date);
      const selectedDateObject = selectedDate ? new Date(selectedDate) : null;
  
      return (
        (!selectedEmployee || payment.employeeEmail === selectedEmployee) &&
        (selectedStatus2 === 'All' || payment.status === selectedStatus2) &&
        (!sortMonth || paymentDate.getMonth() + 1 === parseInt(sortMonth)) &&
        (!selectedDateObject || paymentDate.toDateString() === selectedDateObject.toDateString()) &&
        (selectedCategory === 'All' || selectedCategory === '' || payment.paymentMethod === selectedCategory) &&
        (!selectedYear || paymentDate.getFullYear() === parseInt(selectedYear))
      );
    });
  
    setFilteredData(filtered);
  }, [
    sortMonth,
    selectedDate,
    selectedCategory, 
    employeePayment,
    selectedStatus2,
    selectedEmployee,
    selectedYear,
  ]);

  const [filteredData2,setFilteredData2]=useState([])

  useEffect(() => {
    const filtered = employeePayment?.filter((payment) => {
      const paymentDate = new Date(payment.date);
      const selectedDateObject = selectedDate ? new Date(selectedDate) : null;
  
      return (
        (!selectedEmployee || payment.employeeEmail === selectedEmployee) &&
        (selectedStatus2 === 'All' || payment.status === selectedStatus2) &&
        (!sortMonth || paymentDate.getMonth() + 1 === parseInt(sortMonth)) &&
        (!selectedDateObject || paymentDate.toDateString() === selectedDateObject.toDateString()) &&
        (!selectedYear || paymentDate.getFullYear() === parseInt(selectedYear))
      );
    });
  
    setFilteredData2(filtered);
  }, [
    sortMonth,
    selectedDate,
    employeePayment,
    selectedStatus2,
    selectedEmployee,
    selectedYear,
  ]);
  
  const [bkashMarcent, setBkashMarcentTotal] = useState(0);
  const [nagadPersonal, setNagadPersonalTotal] = useState(0);
  const [bkashPersonal, setBkashPersonalTotal] = useState(0);
  const [rocketPersonal, setRocketPersonalTotal] = useState(0);
  const [bankTotal, setBankTotal] = useState(0);
  const [nagadMarchent, setNagadMarchentTotal] = useState(0);

  useEffect(() => {
    const filtered = filteredData2 || 0; 
    const filter2 = filtered?.filter(d => d.paymentMethod === 'bkashMarchent');
    const total = filter2?.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setBkashMarcentTotal(total);

    const filter3 = filtered?.filter(d => d.paymentMethod === 'nagadPersonal');
    const total3 = filter3?.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setNagadPersonalTotal(total3);

    const filter4 = filtered?.filter(d => d.paymentMethod === 'bkashPersonal');
    const total4 = filter4?.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setBkashPersonalTotal(total4);

    const filter5 = filtered?.filter(d => d.paymentMethod === 'rocketPersonal');
    const total5 = filter5?.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setRocketPersonalTotal(total5);

    const filter6 = filtered?.filter(d => d.paymentMethod === 'bank');
    const total6 = filter6?.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setBankTotal(total6);

    const filter7 = filtered.filter(d => d.paymentMethod === 'nagadMarchent');
    const total7 = filter7.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setNagadMarchentTotal(total7);
  }, [filteredData2]);

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
   
     const handleUpdate = (e) => {
      e.preventDefault();
      const updatedPayment = {
        ...selectedPayment,
        date: e.target.date.value,
        payAmount: parseFloat(e.target.amount.value),
        paymentMethod: e.target.method.value,
        note: e.target.note.value,
      };
  
      AxiosPublic.patch(`/employeePayment/${selectedPayment._id}`,
        updatedPayment
      ).then((res) => {
        handleCancel();
        refetch();
      });
    };
  
  const AxiosPublic=UseAxiosPublic()
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

  return (
    <div className="m-5">
      <Helmet>
        <title>Employee Payments | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }} className="grid grid-cols-2 p-5 rounded-lg sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-5 lg:grid-cols-7 px-5">
  {[
    { category: 'bkashMarchent', img: 'https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png', amount: bkashMarcent, bgColor: '#f7e8e8',charge: filteredData2?.filter(d => d.paymentMethod === 'bkashMarchent')?.reduce((acc, datas) => acc + parseFloat(datas.charge || 0), 0) },

    { category: 'bkashPersonal', img: 'https://i.ibb.co/520Py6s/bkash-1.png', amount: bkashPersonal, bgColor: '#ffe6f7',charge: filteredData2?.filter(d => d.paymentMethod === 'bkashPersonal')?.reduce((acc, datas) => acc + parseFloat(datas.charge || 0), 0) },

    { category: 'nagadMarchent', img: 'https://i.ibb.co.com/WsDkLzc/Nagad-Marchant.png', amount: nagadMarchent, bgColor: '#fff2cc',charge: filteredData2?.filter(d => d.paymentMethod === 'nagadMarchent')?.reduce((acc, datas) => acc + parseFloat(datas.charge || 0), 0) },

    { category: 'nagadPersonal', img: 'https://i.ibb.co/JQBQBcF/nagad-marchant.png', amount: nagadPersonal, bgColor: '#fff2cc',charge: filteredData2?.filter(d => d.paymentMethod === 'nagadPersonal')?.reduce((acc, datas) => acc + parseFloat(datas.charge || 0), 0) },


    { category: 'rocketPersonal', img: 'https://i.ibb.co/QkTM4M3/rocket.png', amount: rocketPersonal, bgColor: '#e0f7fa',charge: filteredData2?.filter(d => d.paymentMethod === 'rocketPersonal')?.reduce((acc, datas) => acc + parseFloat(datas.charge || 0), 0) },

    { category: 'bank', img: 'https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png', amount: bankTotal, bgColor: '#f2f2f2',charge: filteredData2?.filter(d => d.paymentMethod === 'bank')?.reduce((acc, datas) => acc + parseFloat(datas.charge || 0), 0) }

  ].map(({ category, img, amount,charge, bgColor }) => (
    <div style={{ backgroundColor: bgColor, border: 'var(--border)' }} key={category} onClick={() => setSelectedCategory(category)} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
      <img className="balance-card-img" src={img} alt={category} />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-xl font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(amount)}
      </p>

      <p className="balance-card-text text-lg lg:text-xl font-bold text-red-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(charge)}
      </p>
    </div>
  ))}

  <div style={{ backgroundColor: '#d9f8d9', border: 'var(--border)' }} onClick={() => setSelectedCategory('All')} className="balance-card bg-white pt-3 rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
    <h1 className="text-xl lg:text-3xl mt-3 font-bold text-black">
      Total
    </h1>
    <h1 className="text-lg lg:text-2xl mt-7 text-black font-bold">
    <span className="text-lg lg:text-xl font-extrabold">৳ </span> 
      {new Intl.NumberFormat('en-IN').format(
        Number(bkashPersonal) + Number(bkashMarcent) + Number(nagadPersonal) + Number(rocketPersonal) + Number(bankTotal) + Number(nagadMarchent)
      )}
    </h1>
    <h1 className="text-lg mt-1 lg:text-xl text-red-700 font-extrabold">
     <span >৳ </span> 
      {new Intl.NumberFormat('en-IN').format(
        displayedItems.reduce((acc, item) => acc + (isNaN(parseFloat(item?.charge)) ? 0 : parseFloat(item?.charge)), 0)
      )}
    </h1>
   
  </div>
</div>



     <div className='  my-5 mt-5 rounded-lg' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>

      <div className="lg:flex text-black lg:justify-start my-3 lg:my-0 lg:ml-5  items-center">
        <div className="flex justify-center items-center lg:mr-3 ">


        <div className="flex  justify-center text-center items-center">
         <select
          style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
           className="border bg-white w-full     text-black border-gray-400 rounded p-2 mt-1 "
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
      
        </div>
        <div className="flex mt-2 lg:mt-0 justify-center text-center gap-2 lg:gap-3 items-center">
        <div className="flex  justify-center text-center items-center">
         <select
          style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
           className="border bg-white w-full     text-black border-gray-400 rounded p-2 mt-1 "
           value={selectedStatus2}
           onChange={(e) => changeTab3(e.target.value)}
         >
           <option value="All">All Status</option>
           <option value="pending">Pending</option>
           <option value="Approved">Approved</option>
          
         </select>
       </div>
          <div className="flex lg:mt-1 justify-center text-center items-center">
            <select
             style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
              className="border bg-white w-full  mt-1  lg:my-5  text-black border-gray-400 rounded p-2 "
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
          <div className=" lg:flex text-black justify-center items-center">
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

      <div className="overflow-x-auto rounded-xl mx-5 mb-5 text-center " >
          <table className="min-w-full text-center ">
            <thead style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}  className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
              <th className="p-3"><span   >OFF</span> / <span >ON</span></th>
              <th className="p-3">Date</th>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Charge</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Note</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.sort((a, b) => new Date(b.date) - new Date(a.date))?.map((payment, index) => (
              <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
              key={payment._id}
              className={`${
                index % 2 === 0
                  ? "bg-white text-left text-black border-b border-opacity-20"
                  : "bg-gray-200  text-left text-black border-b border-opacity-20"
              }`}
            >
                 <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-l-2 border-gray-200 text-center">  <label className="inline-flex items-center cursor-pointer">
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
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>
               
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 hover:text-blue-700 hover:font-bold text-start border-gray-200 ">
                  <Link to={`/dashboard/userInfo/${payment?.employeeEmail}`}>
                  {payment.employeeName}
                  </Link>
                  
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  ৳ {payment.payAmount}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  ৳ {payment.charge || 0}
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
                  {payment.paymentMethod === "bank" && (
                    <img
                      className="h-12 w-13 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png"
                      alt=""
                    />
                  )}
                </td>

                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  {payment.note}
                </td>

                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
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

                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2  items-center border-gray-200 text-center">
                <div className="flex justify-center gap-3">
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
                </div>
                </td>
              </tr>
            ))}
         <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}} className=" font-bold">
              <td className="p-3 text-right" colSpan="3">
                Total Amount :
              </td>
              <td className="p-3 text-center">৳ {bkashPersonal + bkashMarcent + nagadPersonal + rocketPersonal + bankTotal}</td>
              <td className="p-3 text-center">৳ {displayedItems.reduce((acc, item) => {
    const charge = parseFloat(item?.charge);
    return acc + (isNaN(charge) ? 0 : charge); 
  }, 0)}
</td>

              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
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
        {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}
    </div>
  );
};

export default EmployeePayments;

