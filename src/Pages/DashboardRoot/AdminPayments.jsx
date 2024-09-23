import { useContext, useEffect, useState } from "react";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useUsers from "../../Hook/useUsers";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";

const AdminPayments = () => {
  const { user } = useContext(AuthContext);
  const [employeePayment, refetch] = useEmployeePayment()
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAll, setShowAll] = useState(false);
  const [itemsToShow] = useState(200); 
  const displayedItems = showAll ? filteredData : filteredData.slice(0, itemsToShow);
  const AxiosPublic=UseAxiosPublic()

  const initialTab = localStorage.getItem("activeTaballClientspayss") ;
  const [sortMonth, setSortMonth] = useState(initialTab); 
  
  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballClientspayss", tab); 
  };

  const initialStatus = localStorage.getItem("activeTabSelectedStatuss") || 'All';
  const [selectedStatus2, setSelectedStatus2] = useState(initialStatus);

  const changeTab3 = (tab) => {
    setSelectedStatus2(tab);
    localStorage.setItem("activeTabSelectedStatuss", tab);
  };
  
  useEffect(() => {
    if (user && employeePayment) { 
      const dataa = employeePayment.filter(e => e.employeeEmail === user.email); 
      setEmployees(dataa); 
    }
  }, [user, employeePayment]);
  
  
  useEffect(() => {
    const filtered = employees.filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        (selectedStatus2 === 'All' || payment.status === selectedStatus2) &&
        (!sortMonth || paymentDate.getMonth() + 1 === parseInt(sortMonth)) &&

        (selectedCategory === 'All' || selectedCategory === '' || payment.paymentMethod === selectedCategory) &&
        (!selectedYear || paymentDate.getFullYear() === parseInt(selectedYear))
      );
    });
  
    setFilteredData(filtered);
  }, [
    sortMonth,
    selectedCategory, 
    employees,
    selectedStatus2,
    selectedYear,
  ]);
  
  const [bkashMarcent, setBkashMarcentTotal] = useState(0);
  const [nagadPersonal, setNagadPersonalTotal] = useState(0);
  const [bkashPersonal, setBkashPersonalTotal] = useState(0);
  const [rocketPersonal, setRocketPersonalTotal] = useState(0);
  const [bankTotal, setBankTotal] = useState(0);

  useEffect(() => {
    const filtered = filteredData; 
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
  }, [filteredData]);
  
  // Other functions (handlePayment, handleUpdatePayment, toggleDropdown, handleDelete, etc.) remain unchanged.
  



  const handlePayment = async (e) => {
    e.preventDefault();
    const employeeName = user?.displayName;
    const employeeEmail = user?.email;
    const payAmount = e.target.payAmount.value;
    const paymentMethod = e.target.paymentMethod.value;
    const note = e.target.note.value;
    const date = new Date()

    const data = {
      employeeName,
      employeeEmail,
      payAmount,
      note,
      paymentMethod,
      date,
      status:'pending'
    };

    AxiosPublic.post(
      "https://digital-networking-server.vercel.app/employeePayment",
      data
    )
      .then((res) => {
        toast.success("Send successful!");
        refetch();
        console.log(res.data);
        document.getElementById("my_modal_1").close()
       
      })

  };

  const handleUpdatePayment = (e, id) => {
    e.preventDefault();
    const payAmount = parseFloat(e.target.payAmount.value);
    const date = e.target.date.value;
    const note = e.target.note.value;
    const paymentMethod = e.target.paymentMethod.value;
    const status ='pending'
    const body = {status, note, payAmount, date, paymentMethod };

    AxiosPublic.patch(
      `https://digital-networking-server.vercel.app/employeePayment/${id}`,
      body
    ).then((res) => {
      refetch();
      document.getElementById(`modal_${id}`).close()
      toast.success("Update successful!");
    });
  };

  

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
        AxiosPublic.delete(`/employeePayment/${id}`)
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


  return (
    <div className="mb-5">
      <ToastContainer />
      <Helmet>
        <title>Admin Payment | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-5  lg:grid-cols-6  px-5">
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
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> { bankTotal }</p>
   </div>

   <div onClick={() => setSelectedCategory('All')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <h1 className="text-3xl font-bold text-black">Total BDT</h1>
     <p className="balance-card-text text-lg lg:text-2xl mt-8 font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashPersonal + bkashMarcent + nagadPersonal + rocketPersonal + bankTotal}</p>
   </div>
     </div>
<div className="flex flex-col md:flex-row justify-start lg:justify-between items-center gap-5 lg:px-5 lg:p-0 px-5">
<div className="flex justify-start">
    <button
      className="font-avenir px-6 hover:bg-indigo-700 py-2 bg-[#05a0db] rounded-lg text-white"
      onClick={() => document.getElementById("my_modal_1").showModal()}
    >
      Pay Admin
    </button>
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box bg-white text-black font-bold">
        <form onSubmit={(e) => handlePayment(e)}>
          <div className="mb-4">
            <h1
              className="text-black flex hover:text-red-500 justify-end text-end cursor-pointer"
              onClick={() => document.getElementById("my_modal_1").close()}
            >
              <ImCross />
            </h1>
            <label className="block text-gray-250">Pay Amount</label>
            <input
              required
              type="number"
              name="payAmount"
              placeholder="0"
              className="w-full border bg-white border-black rounded p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-250">Payment Method</label>
            <select
              required
              name="paymentMethod"
              className="w-full border bg-white border-black rounded p-2 mt-1"
            >
              <option value="bkashMarchent">Bkash Marchent</option>
              <option value="bkashPersonal">Bkash Personal</option>
              <option value="nagadPersonal">Nagad Personal</option>
              <option value="rocketPersonal">Rocket Personal</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-250">Note</label>
            <input
              type="text"
              name="note"
              required
              placeholder="type note..."
              className="w-full border bg-white border-black rounded p-2 mt-1"
            />
          </div>
          <div className="grid mt-8 lg:grid-cols-2 gap-3">
            <form method="dialog">
              <button className="p-2 w-full hover:bg-red-700 rounded-lg bg-red-600 text-white text-center">
                Close
              </button>
            </form>
            <button
              type="submit"
              className="font-avenir w-full hover:bg-indigo-700 px-3 pt-2 rounded-lg flex justify-center text-white bg-[#05a0db]"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>

  <div className="lg:flex text-black lg:justify-start my-3 lg:my-0 lg:ml-5  items-center">
        <div className="flex justify-center items-center lg:mr-5 ">


        </div>
        <div className="flex mt-2 lg:mt-0 justify-center text-center gap-2 lg:gap-5 items-center">
        <div className="flex  justify-center text-center items-center">
         <select
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



      <div className="overflow-x-auto border text-black border-gray-300 rounded-xl  mx-5 ">
        <table className="min-w-full bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3 ">SL</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3"> Note</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((payment, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
              >
                <td className="p-3  border-r-2 border-l-2 border-gray-200 text-center">
                  {index + 1}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  {new Date(payment.date).toLocaleDateString("en-GB")}
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
                  {" "}
                  {payment.note}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  {" "}
                  {payment.status === 'pending' ? <p className="text-blue-700 font-bold">Pending</p> : <p className="text-green-800 font-bold">Approved</p>}
                </td>

                <td className="p-3 border-r-2 flex justify-center gap-3 items-center border-gray-200 text-center">
                  <button
                  className="bg-green-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    onClick={() =>
                      document
                        .getElementById(`modal_${payment._id}`)
                        .showModal()
                    }
                  >
                    Edit
                  </button>
                  <dialog id={`modal_${payment._id}`} className="modal">
                    <div className="modal-box bg-white text-black font-bold">
                      <form
                        onSubmit={(e) => handleUpdatePayment(e, payment._id)}
                      >
                        <div className="mb-4">
                          <h1
                            className=" text-black flex hover:text-red-500  justify-end  text-end"
                            onClick={() =>
                              document
                                .getElementById(`modal_${payment._id}`)
                                .close()
                            }
                          >
                            <ImCross />
                          </h1>
                          <label className="block text-black text-xl font-bold">
                            {" "}
                           Edit Admin Pay Amount
                          </label>
                          
                        </div>
                        <div className="mb-4">
                          <label className="block text-left text-gray-700"> Date</label>
                          <input
                            type="date"
                            defaultValue={payment.date}
                            name="date"
                            className="w-full border bg-green-200 border-black rounded p-2 mt-1"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-left text-gray-700">
                            {" "}
                            New Amount
                          </label>
                          <input
                            required
                            type="number"
                            name="payAmount"
                            defaultValue={payment?.payAmount}
                            className="w-full border bg-white border-black rounded p-2 mt-1"
                          />
                        </div>

                        

                        <div className="mb-4">
                          <label className="block text-left text-gray-700">Method</label>
                          <select
                            required
                            name="paymentMethod"
                            defaultValue={payment.paymentMethod}
                            className="w-full border bg-white border-black rounded p-2 mt-1"
                          >
                            <option value="bkashMarchent">
                              Bkash Marchent
                            </option>
                            <option value="bkashPersonal">
                              Bkash Personal
                            </option>
                            <option value="nagadPersonal">
                              Nagad Personal
                            </option>
                            <option value="rocketPersonal">
                              Rocket Personal
                            </option>
                            <option value="bank">Bank</option>
                          </select>
                        </div>

                        <div className="mb-4">
                          <label className="block text-left text-gray-700">Note</label>
                          <input
                            required
                            type="text"
                            name="note"
                            defaultValue={payment?.note}
                            className="w-full border bg-white border-black rounded p-2 mt-1"
                          />
                        </div>

                        <div className="modal-action grid grid-cols-2 gap-3 mt-4">
                          <button
                            type="button"
                            className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white"
                            onClick={() =>
                              document
                                .getElementById(`modal_${payment._id}`)
                                .close()
                            }
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="font-avenir hover:bg-indigo-700 px-3 py-1 bg-[#05a0db] rounded-lg text-white"
                          >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                  </dialog>
                  <button
                   className="bg-red-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(payment._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-[#05a0db] text-white font-bold">
              <td className="p-3 text-right" colSpan="2">
                Total Amount :
              </td>
              <td className="p-3 text-center">৳ {bkashPersonal + bkashMarcent + nagadPersonal + rocketPersonal + bankTotal}</td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
