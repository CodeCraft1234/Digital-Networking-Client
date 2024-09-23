import  { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Security/AuthProvider';
import useUsers from '../../Hook/useUsers';
import { useLoaderData, useParams } from 'react-router-dom';
import useAdsAccountCenter from '../../Hook/useAdsAccountCenter';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import useAdsPayment from '../../Hook/useAdsPayment';
import { MdDelete, MdEditSquare } from 'react-icons/md';
import Swal from 'sweetalert2';
import axios from 'axios';

const AdsUserPayments = () => {
    const { user } = useContext(AuthContext);
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    const {email}=useParams()
    const AxiosPublic=UseAxiosPublic()
    const [adsPayment,refetch] = useAdsPayment();
    const [payment, setPayment] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [sortMonth, setSortMonth] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [totalPayment, setTotalPayment] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [userdata,setUserData]=useState()
  
  
    useEffect(() => {
        if (users && user) {
            const fff = users.find(u => u.email === email);
            console.log(fff);
            setDdd(fff || {}); // Update state with found user or an empty object
        }
    
        const realdata = adsPayment.filter(
          (m) => m.employeeEmail === email
        );
        setPayment(realdata);
        const totalBill = realdata.reduce(
          (acc, campaign) => acc + parseFloat(campaign.payAmount),
          0
        );
        setTotalPayment(totalBill);

    }, [users, user,adsPayment, email]);
  

  
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Blog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete blog",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/adsAccountCenter/${id}`).then((res) => {
          refetch();
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your blog has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };





  useEffect(() => {
    if (payment) {
      setFilteredClients(payment);
    }

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
  }, [selectedEmployee, sortMonth, selectedDate,payment, adsPayment]);

  const filteredItems = filteredClients.filter((item) =>
    item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) =>
          item.paymentMethod.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;

  useEffect(()=>{
    const totalBill = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount),
      0
    );
    setTotalPayment(totalBill);

    const finder=users.find(use=>use.email === user?.email)
    setUserData(finder)
  },[users,user?.email,filteredByCategory])

  const handlePayment =async (e) => {
    e.preventDefault();
    const employeeName=ddd?.name
    const employeeEmail = email;
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
      "https://digital-networking-server.vercel.app/adsPayment",
      data
    )
      .then((res) => {
        refetch();
        document.getElementById("my_modal_1").close()
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



  const userr=useLoaderData()
 const [data,setData]=useState([])
  console.log(data)

    useEffect(()=>{
      AxiosPublic.get(`https://digital-networking-server.vercel.app/users/${userr.email}`)
      .then(res=>{
        console.log(res.data)
        setData(res.data)
      })
    },[])


    const handleUpdate2 = (id, newStatus) => {
      const body = { status: newStatus };
      AxiosPublic.patch(`/adsPayment/status/${id}`, body)
        .then((res) => {
          console.log(res.data);
          refetch();
        })
        .catch((error) => {
          console.error("Error updating campaign:", error);
        });
    };
    
    return (
        <div>
                 <div className="grid grid-cols-2 text-white sm:grid-cols-2 md:grid-cols-3 mb-3  lg:grid-cols-6 gap-3 lg:gap-5 mt-4 ">
   <div onClick={(e) => setSelectedCategory('bkashMarchent')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center  transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
     <p className="balance-card-text text-black text-lg lg:text-2xl font-bold "> <span className="text-lg lg:text-2xl text-white font-extrabold"> ৳</span> {bkashMarcent2}</p>
   </div>
   <div onClick={(e) => setSelectedCategory('bkashPersonal')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
     <p className="balance-card-text text-black text-lg lg:text-2xl font-bold "> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashPersonal2}</p>
   </div>
   <div onClick={(e) => setSelectedCategory('nagadPersonal')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
     <p className="balance-card-text text-black text-lg lg:text-2xl font-bold "><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {nagadPersonal2}</p>
   </div>
   <div onClick={(e) => setSelectedCategory('rocketPersonal')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
     <p className="balance-card-text text-black text-lg lg:text-2xl font-bold "><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {rocketPersonal2}</p>
   </div>

   <div onClick={(e) => setSelectedCategory('bank')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
     
     <p className="balance-card-text text-black text-lg lg:text-2xl font-bold "><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal2}</p>
   </div>
   <div className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <h1 className='text-2xl text-black font-bold'>Total</h1>
     
     <p className="balance-card-text pt-8 text-black text-lg lg:text-2xl font-bold "><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal2+nagadPersonal2+rocketPersonal2+bkashMarcent2+bkashPersonal2}</p>
   </div>
     </div>
   
{/* ///////////////////////////////////////////////////////////////// */}
<div className="flex lg:justify-between flex-col lg:flex-row my-5 gap-5 mx-2">
  <div className="w-full lg:w-auto">
    <button
      className="font-avenir px-5 mt-1 py-2 bg-[#05a0db] rounded-lg text-white w-full lg:w-auto"
      onClick={() => document.getElementById("my_modal_1").showModal()}
    >
      Pay Now
    </button>

    <dialog id="my_modal_1" className="modal">
      <div className="modal-box bg-white text-black font-bold">
        <form onSubmit={(e) => handlePayment(e)}>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              required
              type="date"
              name="date"
              className="w-full border-2 bg-green-300 border-black rounded p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Pay Amount</label>
            <input
              required
              type="number"
              name="payAmount"
              placeholder='0'
              className="w-full border-2 bg-white border-black rounded p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Note</label>
            <input
              type="text"
              name="note"
              required
              placeholder="type note..."
              className="w-full border-2 bg-white border-black rounded p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Payment Method</label>
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
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              className="font-avenir px-3 py-2 w-full rounded-lg text-white bg-red-600"
              onClick={() => document.getElementById("my_modal_1").close()}
            >
              Close
            </button>
            <button
              type="submit"
              className="font-avenir px-3 py-2 w-full rounded-lg text-white bg-[#05a0db]"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>

  <div className="hidden lg:flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
    <select
      className="border bg-blue-200 text-black border-gray-400 rounded p-2 mt-1 w-full"
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

    <input
      type="date"
      className="border rounded bg-blue-200 text-black border-gray-400 p-2 mt-1 w-full"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
    />
  </div>
</div>


      <div className="overflow-x-auto text-black rounded-xl border border-gray-700 mt-5 ">
        <table className="min-w-full bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3 ">OFF/ON</th>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Payment Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3"> Note</th>
              <th className="p-3"> Status</th>
              <th className="p-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredByCategory.map((payment, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
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
                {payment.status !== 'pending' ? (
    <button
     
      className="text-green-700 font-bold px-2 py-1 rounded"
    >
      Approve
    </button>
  ) : (
    <button
     
      className="text-blue-700 font-bold px-2 py-1 rounded"
    >
      Pending
    </button>
  )}
                </td>

               

                <td className="p-3 border-r-2 border-gray-200 text-center">
                <div className='flex gap-3 justify-center items-center'>
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
                  <button
                          className="bg-red-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(payment._id)}
                        >
                          Delete
                        </button>
                </div>
                
                <dialog id={`modal_${payment._id}`} className="modal">
  <div className="modal-box bg-white text-black font-bold">
    <form onSubmit={(e) => handleUpdatePayment(e, payment._id)}>
      <div className="mb-4">
        <label className="block text-gray-700">Previous Amount</label>
        <input
          type="number"
          name="previousAmount"
          disabled
          defaultValue={payment?.payAmount}
          className="w-full border-2 bg-white border-black rounded p-2 mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">New Amount</label>
        <input
          required
          type="number"
          name="payAmount"
          defaultValue={payment?.payAmount}
          className="w-full border-2 bg-white border-black rounded p-2 mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Date</label>
        <input
          type="date"
          defaultValue={payment.date}
          name="date"
          className="w-full border-2 bg-white border-black rounded p-2 mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Method</label>
        <select
          required
          name="paymentMethod"
          defaultValue={payment.paymentMethod}
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
        <label className="block text-gray-700">Note</label>
        <input
          required
          type="text"
          name="note"
          defaultValue={payment?.note}
          className="w-full border-2 bg-white border-black rounded p-2 mt-1"
        />
      </div>
      
      <div className="flex gap-3 mt-4">
      <button
          type="button"
          className="font-avenir px-3 py-2 rounded-lg text-white bg-red-600 flex-1"
          onClick={() => document.getElementById(`modal_${payment._id}`).close()}
        >
          Close
        </button>
        <button
          type="submit"
          className="font-avenir px-3 py-2 rounded-lg text-white bg-[#05a0db] flex-1"
        >
          Update
        </button>
       
      </div>
    </form>
  </div>
</dialog>

              
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
              <td className="p-3 text-center"></td>

            </tr>
          </tbody>
        </table>
      </div>
        </div>
    );
};

export default AdsUserPayments;