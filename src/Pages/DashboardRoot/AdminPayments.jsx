import { useContext, useEffect, useState } from "react";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import Swal from "sweetalert2";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useUsers from "../../Hook/useUsers";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import { MdDelete, MdEditSquare } from "react-icons/md";

const AdminPayments = () => {
  const { user } = useContext(AuthContext);
  const [employeePayment, refetch] = useEmployeePayment();
  const AxiosPublic = UseAxiosPublic();
  const [users] = useUsers();

  const [payment, setPayment] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [sortMonth, setSortMonth] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [totalPayment, setTotalPayment] = useState(0);
  useEffect(() => {
    const realdata = employeePayment.filter(
      (m) => m.employeeEmail === user?.email
    );
    setPayment(realdata);
    const totalBill = realdata.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount),
      0
    );
    setTotalPayment(totalBill);
  }, [employeePayment, user?.email]);


  useEffect(() => {
    if (payment) {
      setFilteredClients(payment);
    }
  }, [payment]);

  useEffect(() => {
    let filtered = payment;

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

    setFilteredClients(filtered);
  }, [selectedEmployee, sortMonth, selectedDate, employeePayment]);

  const filteredItems = filteredClients.filter((item) =>
    item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) =>
          item.paymentMethod.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;

  useEffect(() => {
    const totalBill = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount),
      0
    );
    setTotalPayment(totalBill);
  }, [filteredByCategory]);



  const [userdata,setUserData]=useState()
  console.log(userdata);

  useEffect(()=>{
    const finder=users.find(use=>use.email === user?.email)
    setUserData(finder)
  },[users,user?.email])

  const handlePayment =async (e) => {
    e.preventDefault();
    const employeeName=user?.displayName
    const employeeEmail = user?.email;
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
    };

    AxiosPublic.post(
      "https://digital-networking-server.vercel.app/employeePayment",
      data
    )
      .then((res) => {
        toast.success("Send successful!");
        refetch();
        console.log(res.data);
       
      })

      const generateRandomId = () => {
        return Math.floor(Math.random() * 1e13); // 1e13 generates a number between 0 and 9999999999999 (13 digits)
      };
      const id=generateRandomId()
      const adminPayAmount = parseFloat(payAmount);
      const adminPay = {
        id,
        adminPayAmount,
        date,
      };
    
      AxiosPublic.post('/users/adminPay', { email: employeeEmail, adminPay })
        .then(res => {
          console.log(res.data);
          // Optional: Close the modal here if you prefer
        })
        .catch(error => {
          console.error("Error posting user data:", error);
        });


      const fields = {
        bkashMarchent: (userdata.bkashMarchent || 0) - payAmount,
        bkashPersonal: (userdata.bkashPersonal || 0) - payAmount,
        nagadPersonal: (userdata.nagadPersonal || 0) - payAmount,
        rocketPersonal: (userdata.rocketPersonal || 0) - payAmount,
      };
    
      if (!fields[paymentMethod]) {
        console.error("Invalid payment method");
        return;
      }
    
      const body2 = { [paymentMethod]: fields[paymentMethod] };
    
      try {
        const res = await axios.put(`https://digital-networking-server.vercel.app/users/${paymentMethod}/${userdata._id}`, body2);
        console.log(res.data);
        refetch();  // Make sure this function correctly refetches the updated data
      } catch (error) {
        console.error("Error updating account:", error);
      }
  };

  const handleUpdatePayment = (e, id) => {
    e.preventDefault();
    const payAmount = parseFloat(e.target.payAmount.value);
    const date = e.target.date.value;
    const note = e.target.note.value;
    const paymentMethod = e.target.paymentMethod.value;
    const body = { note, payAmount, date, paymentMethod };

    AxiosPublic.patch(
      `https://digital-networking-server.vercel.app/employeePayment/${id}`,
      body
    )
      .then((res) => {
        refetch();
        toast.success("Update successful!");
      })
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
  

  const handleDelete = (id) => {
      AxiosPublic.delete(`/employeePayment/${id}`).then((res) => {
        toast.success("Delete successful!");
          refetch();
        });
      }


  const [bkashMarcent2,setBkashMarcentTotal2]=useState(0)
  const [nagadPersonal2,setNagadPersonalTotal2]=useState(0)
  const [bkashPersonal2,setBkashPersonalTotal2]=useState(0)
  const [rocketPersonal2,setRocketPersonalTotal2]=useState(0)
  const [bankTotal2,setBankTotal2]=useState(0)
  
  useEffect(()=>{
          const filter2=payment.filter(d=>d.paymentMethod === 'bkashMarchent')
          const total = filter2.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setBkashMarcentTotal2(total)

          const filter3=payment.filter(d=>d.paymentMethod === 'nagadPersonal')
          const total3 = filter3.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setNagadPersonalTotal2(total3)

          const filter4=payment.filter(d=>d.paymentMethod === 'bkashPersonal')
          const total4 = filter4.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setBkashPersonalTotal2(total4)

          const filter5=payment.filter(d=>d.paymentMethod === 'rocketPersonal')
          const total5 = filter5.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setRocketPersonalTotal2(total5)
          const filter6=payment.filter(d=>d.paymentMethod === 'bank')
          const total6 = filter6.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setBankTotal2(total6)
  
  },[payment])

  return (
    <div>
      <ToastContainer />
      <Helmet>
        <title>Admin Payment | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
     <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 mb-3  lg:grid-cols-6 gap-5 mt-4 p-4">
   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center  transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashMarcent2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashPersonal2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {nagadPersonal2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {rocketPersonal2}</p>
   </div>

   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
     {/* <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Received : ৳</span> {bankTotal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Cashout : ৳</span> {bankTotal2}</p> */}
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <h1 className="text-xl text-black font-bold">Total BDT</h1>
     
     <p className="balance-card-text mt-9 text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {totalPayment}</p>
   </div>
     </div>
   
{/* ///////////////////////////////////////////////////////////////// */}
    <div className="flex mt-5 justify-between items-center gap-5   ">
         <div className="">
        <button
          className="font-avenir px-3 mt-7 mx-auto py-1 bg-[#05a0db] ml-5 rounded-lg text-white"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
         Pay Admin
        </button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box bg-white text-black font-bold">
            <form onSubmit={(e) => handlePayment(e)}>
            <div className="mb-4">
                  <label className="block text-gray-250">Pay Amount</label>
                  <input
                    required
                    type="number"
                    name="payAmount"
                    defaultValue={0}
                    className="w-full border-2 bg-white border-black rounded p-2 mt-1"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-250">Note</label>
                  <input
                    type="text"
                    name="note"
                    required
                    placeholder="type note..."
                    className="w-full border-2 bg-white border-black rounded p-2 mt-1"
                  />
                </div>
             
              
                <div className="mb-4">
                  <label className="block text-gray-250">Payment Method</label>
                  <select
                    required
                    name="paymentMethod"
                    className="w-full border-2 bg-white border-black rounded p-2 mt-1"
                  >
                    <option value="bkashMarchent">Bkash Marchent</option>
                    <option value="bkashPersonal">Bkash Personal</option>
                    <option value="nagadPersonal">Nagad Personal</option>
                    <option value="rocketPersonal">Rocket Personal</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-250">Date</label>
                  <input
                    required
                    type="date"
                    name="date"
                    className="w-full border-2 bg-green-300 text-black border-black rounded p-2 mt-1"
                  />
                </div>
            
              <button
                type="submit"
                className="font-avenir px-3 mx-auto py-1 rounded-lg flex justify-center text-white bg-[#05a0db]"
              >
                Send
              </button>
            </form>
            <div className="modal-action">
              <form method="dialog">
                <button className="p-2 rounded-lg bg-red-600 text-white text-center">
                  Close
                </button>
              </form>
            </div>
          </div>
        </dialog>
         </div>
          <div className="flex  justify-end items-center gap-5  ml-2 ">

          <div className="flex flex-col justify-center items-center">
      <label className="block">By Date</label>
      <input
        type="date"
        className="border rounded bg-blue-200 text-black border-gray-400 p-2 mt-1"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>
  
    <div className="flex flex-col justify-end items-center">
      <label>By Month</label>
      <select
        className="border bg-blue-200 text-black border-gray-400 rounded p-2 mt-1"
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

    <div className="flex flex-col justify-center items-center">
      <label className="block ml-2">Payment Method</label>
      <select
        className="border bg-blue-200 text-black border-gray-400 rounded p-2 mt-1"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Methods</option>
        <option value="bkashPersonal">bKash Personal</option>
        <option value="bkashMarchent">bKash Merchant</option>
        <option value="nagadPersonal">Nagad Personal</option>
        <option value="rocketPersonal">Rocket Personal</option>
        <option value="bank">Bank</option>
      </select>
    </div>
    <div className="mt-6 flex justify-center items-center mr-5">
    <input
      type="text"
      placeholder="Payment Method"
      className="rounded-lg w-full placeholder-black border-2 border-black p-2 font-bold   text-sm bg-white text-black"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  
  </div>
          </div>
  
     </div>




      <div className="overflow-x-auto mt-6 mx-4">
        <table className="min-w-full bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3 ">SL</th>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Payment Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3"> Note</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredByCategory.map((payment, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
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

             

                <td className="p-3 border-r-2 flex justify-center gap-3 items-center border-gray-200 text-center">
                <button
                    className="font-avenir text-3xl  py-1 px-4 rounded-lg text-blue-700"
                    onClick={() =>
                      document
                        .getElementById(`modal_${payment._id}`)
                        .showModal()
                    }
                  >
                   <MdEditSquare />
                  </button>
                  <dialog id={`modal_${payment._id}`} className="modal">
                    <div className="modal-box bg-white text-black font-bold">
                      <form
                        onSubmit={(e) => handleUpdatePayment(e, payment._id)}
                      >
                       
                          <div className="mb-4">
                            <label className="block text-gray-700">
                              {" "}
                              Previous Amount
                            </label>
                            <input
                              type="number"
                              name="previousAmount"
                              disabled
                              defaultValue={payment?.payAmount}
                              className="w-full border-2 bg-white border-black rounded p-2 mt-1"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700">
                              {" "}
                              New Amount
                            </label>
                            <input
                              required
                              type="number"
                              name="payAmount"
                              defaultValue={payment?.payAmount}
                              className="w-full border-2 bg-white border-black rounded p-2 mt-1"
                            />
                          </div>
                     
                       
                          <div className="mb-4">
                            <label className="block text-gray-700"> Date</label>
                            <input
                              type="date"
                              defaultValue={payment.date}
                              name="date"
                              className="w-full border-2 bg-white border-black rounded p-2 mt-1"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700">
                              Method
                            </label>
                            <select
                              required
                              name="paymentMethod"
                              defaultValue={payment.paymentMethod}
                              className="w-full border-2 bg-white border-black rounded p-2 mt-1"
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
                          <label className="block text-gray-700">Note</label>
                          <input
                            required
                            type="text"
                            name="note"
                            defaultValue={payment?.note}
                            className="w-full border-2 bg-white border-black rounded p-2 mt-1"
                          />
                        </div>
                        <button
                          onClick={() =>
                            document
                              .getElementById(`modal_${payment._id}`)
                              .close()
                          }
                          type="submit"
                          className="font-avenir px-3 mx-auto py-1 rounded-lg flex justify-center text-white bg-[#05a0db]"
                        >
                          Update
                        </button>
                      </form>
                      <div className="modal-action">
                        <button
                          className="p-2 rounded-lg bg-red-600 text-white text-center"
                          onClick={() =>
                            document
                              .getElementById(`modal_${payment._id}`)
                              .close()
                          }
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </dialog>
                  <button
                          className="text-start flex justify-start text-black text-3xl"
                          onClick={() => handleDelete(payment._id)}
                        >
                          <MdDelete />
                        </button>
                </td>


                 

                
              </tr>
            ))}
            <tr className="bg-[#05a0db] text-white font-bold">
              <td className="p-3 text-center" colSpan="2">
                Total Amount :
              </td>
              <td className="p-3 text-center">৳ {totalPayment}</td>
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
