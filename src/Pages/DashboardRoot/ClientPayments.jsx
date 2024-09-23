import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import useMpayment from "../../Hook/UseMpayment";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ClientPayments = () => {
  const [MPayment, refetch] = useMpayment();
  const AxiosPublic = UseAxiosPublic();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  
  const initialTab = localStorage.getItem("activeTabclientpayMont") || "All";
  const [sortMonth, setSortMonth] = useState(initialTab || new Date().getMonth() + 1)

  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTabclientpayMont", tab); 
  };
  
  useEffect(() => {
    const totalBill = filteredData.reduce((acc, campaign) => acc + parseFloat(campaign.amount), 0);
    setTotalPayment(totalBill);
  }, [MPayment,filteredData, user?.email]);
  
  useEffect(() => {
    let filtered = data;
    if (sortMonth) {
      filtered = filtered.filter(
        (payment) =>
          new Date(payment.date).getMonth() + 1 === parseInt(sortMonth)
      );
    }
  
    if (selectedDate) {
      filtered = filtered.filter((payment) => payment.date === selectedDate);
    }
  
    if (selectedCategory) {
      filtered = filtered.filter(
        (payment) => payment.paymentMethod === selectedCategory
      );
    }

    setFilteredData(filtered);
  }, [sortMonth, selectedDate, selectedCategory, data]);
  
  useEffect(() => {
    const finds = MPayment.filter((f) => f.employeeEmail === user?.email);
    setData(finds);
  }, [MPayment, user]);

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
      amount: parseFloat(e.target.amount.value),
      paymentMethod: e.target.paymentMethod.value,
      note: e.target.note.value,
    };

    AxiosPublic.patch(
      `https://digital-networking-server.vercel.app/Mpayment/${selectedPayment._id}`,
      updatedPayment
    ).then((res) => {
      toast.success("Payment Update successful!");
      refetch();
      handleCancel();
    });
  };


  const [bkashMarcent,setBkashMarcentTotal]=useState(0)
  const [nagadPersonal,setNagadPersonalTotal]=useState(0)
  const [bkashPersonal,setBkashPersonalTotal]=useState(0)
  const [rocketPersonal,setRocketPersonalTotal]=useState(0)
  const [bankTotal,setBankTotal]=useState(0)

  useEffect(()=>{
      AxiosPublic.get(`https://digital-networking-server.vercel.app/Mpayment`)
      .then(res => {
          const da=res.data
          const filtered=da.filter(f=> f.employeeEmail === user?.email) 

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
      })
  },[user?.email])

  return (
    <div className="">
      <ToastContainer />
      <Helmet>
        <title>Client Payment | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-6 gap-5  p-5">
   <div onClick={(e) => setSelectedCategory('bkashMarchent')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center  transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashMarcent}</p>
   </div>
   <div onClick={(e) => setSelectedCategory('bkashPersonal')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bkashPersonal}</p>
   </div>
   <div onClick={(e) => setSelectedCategory('nagadPersonal')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {nagadPersonal}</p>
   </div>
   <div  onClick={(e) => setSelectedCategory('rocketPersonal')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {rocketPersonal}</p>
   </div>

   <div  onClick={(e) => setSelectedCategory('bank')}  className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal}</p>
   </div>
   <div  onClick={(e) => setSelectedCategory('bank')}  className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <h1 className="text-2xl text-black font-bold">Total BDT</h1>
     <p className="balance-card-text mt-9 text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal+rocketPersonal+bkashMarcent+bkashPersonal+nagadPersonal}</p>
   </div>
     </div>

{/* ///////////////////////////////////////////////////////////////// */}


<div className="flex flex-wrap lg:justify-end justify-center ml-5 items-center gap-5 mr-5 mb-5">
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

  <input
    type="date"
    className="border bg-green-300 text-black border-gray-400 rounded p-2 mt-1"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
  />
</div>






  


      <div className="overflow-x-auto text-black rounded-xl mb-5 mx-5">
        <table className="min-w-full bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Date</th>
              <th className="p-3">Client Name</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Note</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((payment, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-200" : "bg-white"}
              >
                <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">
                  {index + 1}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>
                <td className="p-3 hover:text-blue-700 hover:font-bold border-r-2 border-gray-200 text-center">
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
                
                <td className="p-3 border-r-2 gap-3 flex justify-center items-center border-gray-200 text-center">
              
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-center text-black font-semibold">
            Edit Client Pay Amount
          </h2>
          <button onClick={handleCancel} className="text-black text-xl">
            &times;
          </button>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              defaultValue={selectedPayment.date}
              className="w-full border bg-white text-black border-gray-400 p-2 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-medium mb-1">
              New Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              defaultValue={selectedPayment.amount}
              className="w-full border bg-white text-black border-gray-400 p-2 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="method" className="block text-gray-700 font-medium mb-1">
              Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              defaultValue={selectedPayment.paymentMethod}
              className="w-full border bg-white text-black border-gray-400 p-2 rounded-md"
              required
            >
              <option value="bkashPersonal">Bkash Personal</option>
              <option value="bkashMarchent">Bkash Marchent</option>
              <option value="nagadPersonal">Nagad Personal</option>
              <option value="rocketPersonal">Rocket Personal</option>
              <option value="bank">Bank</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="note" className="block text-gray-700 font-medium mb-1">
              Note
            </label>
            <textarea
              id="note"
              name="note"
              defaultValue={selectedPayment.note}
              className="w-full border bg-white text-black border-gray-400 p-2 rounded-md"
            ></textarea>
          </div>
          <div className="flex justify-between gap-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-700 text-white px-6 w-full py-2 rounded-md font-medium"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-indigo-700 text-white w-full px-6 py-2 rounded-md font-medium"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
    
      )}
    </div>
  );
};

export default ClientPayments;
