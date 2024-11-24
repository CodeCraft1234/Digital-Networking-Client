import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { useParams } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMpayment from "../../Hook/UseMpayment";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import Swal from "sweetalert2";
import useMpymentsByEmail from "../../Hook/useMpaymentByEmail";

const ClientPaymentHistry = () => {
  const { user } = useContext(AuthContext);
  const [users] = useUsers();
  const param = useParams();
  const [Mpayments,refetch]=useMpymentsByEmail(param?.email)
  const AxiosPublic = UseAxiosPublic();
  const [totalPayment, setTotalPayment] = useState(0);
  const [datas, setdatas] = useState();
  const [clients] = useClients();
  
  const [Histryy, setHistryy] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    if (param?.email) {

      const sortedHistry = Mpayments.sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistryy(sortedHistry);
  
      const totalBill = sortedHistry.reduce((acc, campaign) => acc + parseFloat(campaign.amount), 0);
      setTotalPayment(totalBill);
  
      const clientData = clients.find((m) => m.clientEmail === param.email);
      setdatas(clientData);
    }
  }, [param?.email, Mpayments, clients]);

  useEffect(() => {
    if (selectedMonth) {
      const filtered = Histryy.filter(payment => {
        const paymentDate = new Date(payment.date);
        return (
          paymentDate.getMonth() + 1 === parseInt(selectedMonth)
        );
      });
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(Histryy); 
    }
  }, [selectedMonth, Histryy]);

  
  const handlePayment = async (e) => {
    e.preventDefault();
    const paymentMethod = e.target.paymentMethod.value;
    const amount = parseFloat(e.target.amount.value);
    const date =  e.target.date.value;
    const note = e.target.note.value;
    const clientEmail = param?.email;
    const clientName = datas?.clientName;
    const employeeEmail = user?.email;
  
    const body = {
      paymentMethod,
      amount,
      note,
      clientEmail,
      clientName,
      employeeEmail,
      date,
    };
  
       AxiosPublic.post(`/MPayment`, body)
       .then(res=>{
        toast.success("Payment successful");
        refetch();
        document.getElementById("my_modal_8").close();
        console.log(res.data);
       })

    if (paymentMethod === "bank") {
      const employeeName = user?.displayName;
      const payAmount = e.target.amount.value;  // Use the amount for payAmount
      const bankData = {
        employeeName,
        employeeEmail,
        payAmount,
        note,
        paymentMethod,
        date,
        status: 'pending'
      };
  
      try {
        const response = await AxiosPublic.post("/employeePayment", bankData);
        toast.success("Bank payment request sent successfully!");
        refetch();
        console.log(response.data);
        document.getElementById("my_modal_1").close();
      } catch (error) {
        console.error("Error posting bank payment:", error);
        toast.error("Failed to send bank payment request");
      }
    }

    if (paymentMethod === "nagadMarchent") {
      const employeeName = user?.displayName;
      const payAmount = e.target.amount.value;  // Use the amount for payAmount
      const bankData = {
        employeeName,
        employeeEmail,
        payAmount,
        note,
        paymentMethod,
        date,
        status: 'pending'
      };
  
      try {
        const response = await AxiosPublic.post("/employeePayment", bankData);
        toast.success("Bank payment request sent successfully!");
        refetch();
        console.log(response.data);
        document.getElementById("my_modal_1").close();
      } catch (error) {
        console.error("Error posting bank payment:", error);
        toast.error("Failed to send bank payment request");
      }
    }

    if (paymentMethod === "bkashMarchent") {
      const employeeName = user?.displayName;
      const payAmount = e.target.amount.value;  // Use the amount for payAmount
      const bankData = {
        employeeName,
        employeeEmail,
        payAmount,
        note,
        paymentMethod,
        date,
        status: 'pending'
      };
  
      try {
        const response = await AxiosPublic.post("/employeePayment", bankData);
        toast.success("Bank payment request sent successfully!");
        refetch();
        console.log(response.data);
        document.getElementById("my_modal_1").close();
      } catch (error) {
        console.error("Error posting bank payment:", error);
        toast.error("Failed to send bank payment request");
      }
    }
  };
  
  const handleUpdatePayment = async (e, id) => {
    e.preventDefault();
    const amount = parseFloat(e.target.amount.value);
    const date = e.target.date.value;
    const note = e.target.note.value;
    const paymentMethod = e.target.paymentMethod.value;
    const body = { note, amount, date, paymentMethod };
  
    try {
      await AxiosPublic.patch(`/Mpayment/${id}`, body);
      refetch();
      document.getElementById(`modal_${id}`).close();
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Failed to update payment");
    }
  };
  
  const handledelete = async (id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        await AxiosPublic.delete(`/Mpayment/${id}`);
        toast.success("Payment deleted successfully");
        refetch(); // Update the data after deletion
      } catch (error) {
        console.error("Error deleting payment:", error);
        toast.error("Failed to delete payment");
      }
    }
  };

  const [ddd, setDdd] = useState(null);

  useEffect(() => {
      if (users && user) {
          const foundUser = users.find(u => u.email === user.email);
          setDdd(foundUser || {}); // Update state with found user or an empty object
      }
  }, [users, user]);

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];  // "YYYY-MM-DD" format


  return (
    <div>



<div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }} className="lg:mt-5 mt-5 px-5 rounded-lg mx-5">
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 lg:gap-5 mt-5 mb-5">
    
    {/* bKash Merchant Card */}
    <div 
      onClick={() => setSelectedCategory('bkashMarchent')} 
      style={{ backgroundColor: '#f7e8e8', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash Merchant" />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.filter(h => h.paymentMethod === 'bkashMarchent')?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>

    {/* bKash Personal Card */}
    <div 
      onClick={() => setSelectedCategory('bkashPersonal')} 
      style={{ backgroundColor: '#ffe6f7', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash Personal" />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.filter(h => h.paymentMethod === 'bkashPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>

    <div 
      onClick={() => setSelectedCategory('nagadMarchent')} 
      style={{ backgroundColor: '#fff2cc', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <img className="balance-card-img" src="https://i.ibb.co.com/WsDkLzc/Nagad-Marchant.png" alt="Nagad Personal" />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.filter(h => h.paymentMethod === 'nagadMarchent')?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>

    <div 
      onClick={() => setSelectedCategory('nagadPersonal')} 
      style={{ backgroundColor: '#fff2cc', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad Personal" />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.filter(h => h.paymentMethod === 'nagadPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>

    {/* Rocket Personal Card */}
    <div 
      onClick={() => setSelectedCategory('rocketPersonal')} 
      style={{ backgroundColor: '#e0f7fa', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket Personal" />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.filter(h => h.paymentMethod === 'rocketPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>

    {/* Bank Card */}
    <div 
      onClick={() => setSelectedCategory('bank')} 
      style={{ backgroundColor: '#f2f2f2', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <h1 className="p-3 text-black text-3xl font-bold text-center">Bank</h1>
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.filter(h => h.paymentMethod === 'bank')?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>

    {/* Total Card */}
    <div 
      style={{ backgroundColor: '#d9f8d9', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <h1 className="p-3 text-black text-3xl font-bold text-center">TOTAL</h1>
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>
    
  </div>
</div>


     
      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className="  rounded-lg px-5 m-5 ">
        <div>

       <div className="flex  items-center justify-between ">
        <button
      className="font-avenir hover:bg-indigo-700 px-4 p-2 w-full lg:w-auto   bg-[#05a0db]  rounded-lg text-white"
       onClick={() => document.getElementById("my_modal_8").showModal()}
     >
        Pay Now
</button>

 <div className="mb-4">
   <label htmlFor="month" className="block">Select Month:</label>
   <select id="month" value={selectedMonth}  style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}} onChange={(e) => setSelectedMonth(e.target.value)} className="border bg-white text-black rounded p-2">
     <option value="">Months</option>
     <option value="1">January</option>
     <option value="2">February</option>
     <option value="3">March</option>
     <option value="4">April</option>
     <option value="5">May</option>
     <option value="6">June</option>
     <option value="7">July</option>
     <option value="8">August</option>
     <option value="9">September</option>
     <option value="10">October</option>
     <option value="11">November</option>
     <option value="12">December</option>
   </select>
 </div>


      </div>
     
  <dialog id="my_modal_8" className="modal">
    <div className="modal-box text-black bg-white font-bold">
      <form onSubmit={(e) => handlePayment(e)}>

      <div className="mb-4">
            <label className="block text-gray-250">Date</label>
            <input
              type="date"
              name="date"
              required
              defaultValue={formattedDate}
              className="w-full border bg-white border-black rounded p-2 mt-1"
            />
          </div>
       

          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              required
              type="number"
              name="amount"
              className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
            />
          </div>
          

          <div className="mb-4">


  <div className="mt-2 grid mb-4 lg:grid-cols-3 ">

  <div className="form-control">
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="bkashMarchent"
          value="bkashMarchent"
          className="radio radio-primary"
        />
        <span className="label-text text-black">Bkash Marchent</span>
      </label>
    </div>

    <div className="form-control">
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="paymentMethod"
          value="bkashPersonal"
          className="radio radio-primary"
        />
        <span className="label-text text-black">Bkash Personal</span>
      </label>
    </div>


    <div className="form-control">
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="bank"
          value="bank"
          className="radio radio-primary"
        />
        <span className="label-text text-black">Bank Payment</span>
      </label>
    </div>

    <div className="form-control">
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="nagadMarchent"
          value="nagadMarchent"
          className="radio radio-primary"
        />
        <span className="label-text text-black">Nagad Marchent</span>
      </label>
    </div>


    
    <div className="form-control">
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="nagadPersonal"
          value="nagadPersonal"
          className="radio radio-primary"
        />
        <span className="label-text text-black">Nagad Personal</span>
      </label>
    </div>


   


    <div className="form-control">
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="paymentMethod"
          value="rocketPersonal"
          className="radio radio-primary"
        />
        <span className="label-text text-black">Rocket Personal</span>
      </label>
    </div>

   
   
  </div>

  <div className="mb-4">
            <label className="block text-gray-700">Note (optional)</label>
            <input
             placeholder="type note..."
              type="text"
              name="note"
              className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
            />
          </div>
         </div>

        {/* Buttons at the bottom in a two-grid layout */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <button
            type="button"
            className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white text-center"
            onClick={() => document.getElementById("my_modal_8").close()}
          >
            Close
          </button>
          <button
            type="submit"
            className="font-avenir hover:bg-indigo-700 px-3 py-2 bg-[#2220af] rounded-lg text-white text-center"
          >
            Pay Now
          </button>
        </div>
      </form>
    </div>
  </dialog>
</div>

<div  className="overflow-x-auto rounded-xl mb-5  text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
                <th style={{  border: 'var(--border)'}} className="p-3 ">SL</th>
                <th style={{  border: 'var(--border)'}} className="p-3">Payment Date</th>
                <th style={{  border: 'var(--border)'}} className="p-3 ">Client Name</th>
                <th style={{  border: 'var(--border)'}} className="p-3">Payment Amount</th>
                <th style={{  border: 'var(--border)'}} className="p-3">Payment Method</th>
                <th style={{  border: 'var(--border)'}} className="p-3"> Note</th>
                {
      ddd?.role === 'employee' && 
      <th className="p-3">Action</th>
      }
                
                
              </tr>
            </thead>
            <tbody>
              {filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date))?.sort((a, b) => new Date(b.date) - new Date(a.date))?.map((payment, index) => (
                <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
                key={payment._id}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-black border-b border-opacity-20"
                    : "bg-gray-200  text-left text-black border-b border-opacity-20"
                }`}
              >
                  <td style={{  border: 'var(--border)'}} className="p-3  border-r-2 border-l-2 border-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  {new Date(payment.date).toLocaleDateString("en-GB")}
                  </td>
                
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-start">
                    {payment.clientName}
                   
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                    <span className="text-md mr-1 font-extrabold">৳</span>{" "}
                    {payment.amount}
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
                    {payment.paymentMethod === "bank" && (
                      <img
                        className="h-12 w-13 flex my-auto items-center mx-auto justify-center"
                        src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png"
                        alt=""
                      />
                    )}
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 text-center border-gray-200 ">
                    {" "}
                    {payment.note}
                  </td>
              

                  {
      ddd?.role === 'employee' &&
      <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  <div className="flex justify-center items-center gap-3">
  <div>
    <button
     className="bg-green-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
      onClick={() =>
        document.getElementById(`modal_${payment._id}`).showModal()
      }
    >
      Edit
    </button>

    <dialog id={`modal_${payment?._id}`} className="modal">
      <div className="modal-box text-black bg-white font-bold">
        <form onSubmit={(e) => handleUpdatePayment(e, payment?._id)}>
        <div className="mb-4">
            <label className="block text-left text-gray-700">Date</label>
            <input
              type="date"
              defaultValue={payment?.date}
              name="date"
              className="w-full border bg-green-300 border-black p-2 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-left text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              defaultValue={payment?.amount}
              className="w-full border bg-white border-black p-2 rounded-lg"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-left text-gray-700">Method</label>
            <select
              name="paymentMethod"
              defaultValue={payment?.paymentMethod}
              className="w-full border bg-white border-black p-2 rounded-lg"
            >
              <option value="bkashMarchent">Bkash Marchent</option>
              <option value="bkashPersonal">Bkash Personal</option>
              <option value="nagadPersonal">Nagad Personal</option>
              <option value="rocketPersonal">Rocket Personal</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-left text-gray-700">Note</label>
            <input
              type="text"
              name="note"
              defaultValue={payment?.note}
              className="w-full border bg-white border-black p-2 rounded-lg"
            />
          </div>

          {/* Buttons at the bottom in a two-grid layout */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-red-700 bg-red-600 text-white text-center"
              onClick={() => document.getElementById(`modal_${payment._id}`).close()}
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
    </dialog>
  </div>
  <button
    className="bg-red-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
    onClick={() => handledelete(payment._id)}
  >
    Delete
  </button>
</div>

                  </td>
      }

                </tr>
              ))}
              <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}} className="  font-bold">
                <td style={{  border: 'var(--border)'}} className="p-3 text-center" colSpan="3">
                  Total Amount :
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 text-center">
                  <span className="text-md mr-1 font-extrabold">৳</span>{" "}
                  {totalPayment}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 text-center"></td>
                <td style={{  border: 'var(--border)'}} className="p-3 text-center"></td>
                 {
                    ddd?.role === 'employee' && 
                    <td style={{  border: 'var(--border)'}} className="p-3 text-center"></td>
                 }
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientPaymentHistry;
