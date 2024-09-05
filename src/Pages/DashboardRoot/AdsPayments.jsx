import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useUsers from "../../Hook/useUsers";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import useAdsPayment from "../../Hook/useAdsPayment";
import { toast } from "react-toastify";

const  AllAdsPayments = () => {
  const { user } = useContext(AuthContext);
  const [adsPayment, refetch] = useAdsPayment();
  const AxiosPublic = UseAxiosPublic();
  const [users] = useUsers();
  const [payment, setPayment] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [sortMonth, setSortMonth] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [totalPayment, setTotalPayment] = useState(0);

  const [ddd, setDdd] = useState(null);

  useEffect(() => {
      if (users && user) {
          const foundUser = users.find(u => u.email === user?.email);
          setDdd(foundUser || {}); // Update state with found user or an empty object
      }
  }, [users, user]);

  useEffect(() => {
    const realdata = adsPayment.filter(
      (m) => m.employeeEmail === user?.email
    );
    setPayment(realdata);
    const totalBill = realdata.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount),
      0
    );
    setTotalPayment(totalBill);
  }, [adsPayment, user?.email]);


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
  }, [selectedEmployee, sortMonth, selectedDate, adsPayment]);

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
      status:'pending'
    };

    AxiosPublic.post(
      "https://digital-networking-server.vercel.app/adsPayment",
      data
    )
      .then((res) => {
        toast.success('pay successfully')
        refetch();
     
      })

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
      `https://digital-networking-server.vercel.app/adsPayment/${id}`,
      body
    )
      .then((res) => {
        window.location.reload();
        refetch();
        Swal.fire({
          title: "Good job!",
          text: "Payment updated successfully!",
          icon: "success",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to update payment!",
        });
      });
  };

  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (orderId) => {
    setActiveDropdown(activeDropdown === orderId ? null : orderId);
  };



  

  const handleDelete = (id) => {
      AxiosPublic.delete(`/employeePayment/${id}`).then((res) => {
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
      <Helmet>
        <title>Admin Payment | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
     <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3   lg:grid-cols-6 gap-3 lg:gap-5 mt-4 lg:mt-5 p-5">
   <div onClick={(e) => setSelectedCategory('bkashMarchent')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center  transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashMarcent2}</p>
   </div>
   <div onClick={(e) => setSelectedCategory('bkashPersonal')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashPersonal2}</p>
   </div>
   <div onClick={(e) => setSelectedCategory('nagadPersonal')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {nagadPersonal2}</p>
   </div>
   <div onClick={(e) => setSelectedCategory('rocketPersonal')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {rocketPersonal2}</p>
   </div>

   <div onClick={(e) => setSelectedCategory('bank')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
     {/* <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Received : ৳</span> {bankTotal}</p>
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold">Bank Cashout : ৳</span> {bankTotal2}</p> */}
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal2}</p>
   </div>
   <div  className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
<h1 className="text-2xl font-bold text-black">Total</h1>
     <p className="balance-card-text text-lg mt-9 lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashMarcent2+bankTotal2+bkashPersonal2+nagadPersonal2+rocketPersonal2}</p>
   </div>
     </div>
   
{/* ///////////////////////////////////////////////////////////////// */}
    <div className="lg:flex  lg:justify-between items-center gap-5  ">
         <div className="flex justify-center items-center">
          
        <button
          className="font-avenir px-3 hover:bg-indigo-700 w-full lg:w-auto mr-5 py-2 lg:mr-0  mx-auto  bg-[#05a0db] ml-5 rounded-lg text-white"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
         Pay Admin
        </button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box bg-white text-black font-bold">
            <form onSubmit={(e) => handlePayment(e)}>
            <div className="mb-4">
                  <label className="block text-gray-250">Date</label>
                  <input
                    required
                    type="date"
                    name="date"
                    className="w-full border-2 bg-green-300 text-black border-black rounded p-2 mt-1"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-250">Pay Amount</label>
                  <input
                    required
                    type="number"
                    name="payAmount"
                    placeholder="0"
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
               
            <div className="grid lg:grid-cols-2 gap-3">
            <form method="dialog">
                <button className="p-2 hover:bg-red-700 rounded-lg w-full bg-red-600 text-white text-center">
                  Close
                </button>
              </form>
              <button
                type="submit"
                className="font-avenir hover:bg-indigo-700 px-3 w-full mx-auto pt-2 py-1 rounded-lg flex justify-center text-white bg-[#05a0db]"
              >
                Send
              </button>
            </div>
              
            </form>
            <div className="modal-action">
            
            </div>
          </div>
        </dialog>
         </div>
          <div className="flex  mt-4 lg:mt-0 justify-center lg:mr-5 lg:justify-end items-center gap-5   ">
  
    <div className="flex justify-center   lg:justify-end items-center">
   
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
    <div className="flex flex-col justify-center items-center">
   
      <input
        type="date"
        className="border rounded bg-green-300  text-black border-gray-400 p-2 mt-1"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>
   

          </div>
  
     </div>




      <div className="overflow-x-auto text-black border mb-5 border-gray-300 rounded-xl mt-5  mx-5">
        <table className="min-w-full bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3 ">SL</th>
              <th className="p-3">Payment Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3"> Note</th>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredByCategory.map((payment, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
              >
                <td className="p-3  border-r-2 border-l-2 border-gray-400 text-center">
                  {index + 1}
                </td>
               
                <td className="p-3 border-r-2 border-gray-400 text-center">
                  ৳ {payment.payAmount}
                </td>

                <td className="p-3 border-r-2 border-gray-400 text-center">
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
                <td className="p-3 border-r-2 border-gray-400 text-center">
                  {" "}
                  {payment.note}
                </td>

                <td className="p-3 border-r-2 border-gray-400 text-center">
                {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>

                <td className="p-3 border-r-2 border-gray-400 text-center">
<div className="fles justify-center items-center gap-3">
<button
                    className="bg-green-700 mr-3 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    onClick={() =>
                      document
                        .getElementById(`modal_${payment._id}`)
                        .showModal()
                    }
                  >
                   Edit
                  </button>
                  <button
                        className="bg-red-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(payment._id)}
                        >
                          Delete
                        </button>
</div>
                        <dialog id={`modal_${payment._id}`} className="modal">
                    <div className="modal-box bg-white text-black font-bold">
                      <form
                        onSubmit={(e) => handleUpdatePayment(e, payment._id)}
                      >
                        <div className="flex justify-center items-center gap-3">
                          <div className="mb-4">
                            <label  className="block text-start text-gray-700">
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
                            <label className="block text-start text-gray-700">
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
                        </div>
                       
                          <div className="mb-4">
                            <label className="block text-start text-gray-700"> Date</label>
                            <input
                              type="date"
                              defaultValue={payment.date}
                              name="date"
                              className="w-full border-2 bg-white border-black rounded p-2 mt-1"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-start text-gray-700">
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
                          <label className="block text-start text-gray-700">Note</label>
                          <input
                            required
                            type="text"
                            name="note"
                            defaultValue={payment?.note}
                            className="w-full border-2 bg-white border-black rounded p-2 mt-1"
                          />
                        </div>
                        <div>
                        <div className="modal-action grid lg:grid-cols-2 gap-3">
                        <button
                          className="p-2 hover:bg-red-700  rounded-lg bg-red-600 text-white text-center"
                          onClick={() =>
                            document
                              .getElementById(`modal_${payment._id}`)
                              .close()
                          }
                        >
                          Close
                        </button>
                        <button
                          onClick={() =>
                            document
                              .getElementById(`modal_${payment._id}`)
                              .close()
                          }
                          type="submit"
                          className="font-avenir px-3 mx-auto py-1 rounded-lg flex justify-center text-white bg-blue-500 hover:bg-blue-700 pt-2"
                        >
                          Update
                        </button>
                      </div>
                        </div>
                       
                      </form>
                     
                    </div>
                  </dialog>
                </td>


                 

                
              </tr>
            ))}
            <tr className="bg-[#05a0db] text-white font-bold">
              <td className="p-3 text-center" colSpan="1">
                Total Amount:
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
     
    </div>
  );
};

export default AllAdsPayments;
