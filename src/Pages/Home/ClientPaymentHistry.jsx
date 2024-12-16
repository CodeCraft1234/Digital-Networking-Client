import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { useParams } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useClients from "../../Hook/useClient";
import Swal from "sweetalert2";
import useMpymentsByEmail from "../../Hook/useMpaymentByEmail";
import { FaMinusSquare } from "react-icons/fa";
import BalanceCard from "../DashboardRoot/BalanceCard";
import useFindClient from "./useFindClient";
import useUsers from "../../Hook/useUsers";

const ClientPaymentHistry = () => {
  const { user } = useContext(AuthContext);
  const param = useParams();
  const {findClients , refetch}=useFindClient(param?.email)
  const [Mpayments]=useMpymentsByEmail(param?.email)
  const AxiosPublic = UseAxiosPublic();
  const [datas, setdatas] = useState();
  const [clients] = useClients();
  const [Histryy, setHistryy] = useState([]);
  const [users] = useUsers();

  const initialTab2 = localStorage.getItem("activeTaballcampaignmonthsss2");
  const [selectedMonth, setSortMonth] = useState(initialTab2 || (new Date().getMonth() + 1).toString());

  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballcampaignmonthsss2", tab);
  };

  useEffect(() => {

    if (param?.email) {

      const sortedHistry = Mpayments.sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistryy(sortedHistry);
  
  
      const clientData = clients.find((m) => m.clientEmail === param.email);
      setdatas(clientData);
    }

  }, [users,selectedMonth,user?.email, Histryy,param?.email, Mpayments, clients]);

  const generateRandomId = () => {
    return Math.floor(Math.random() * 1e13); 
  };
  
  const handlePayment = async (e) => {
    e.preventDefault();
    const paymentMethod = e.target.paymentMethod.value;
    const amount = parseFloat(e.target.amount.value);
    const date = e.target.date.value;
    const note = e.target.note.value;
    const clientEmail = param?.email;
    const employeeEmail = user?.email;
    const ids = param?.email;
    const payments = {
      paymentMethod,
      amount,
      note,
      id: ids,
      ids: generateRandomId(),
      clientEmail,
      clientName: findClients.clientName,
      employeeEmail,
      date,
    };
    
    try {
      const res = await AxiosPublic.post("/clients/payments", { id: ids, payments });
      console.log("Payment successful:", res.data);
      refetch();
      document.getElementById("my_modal_8").close();
      toast.success(`Payment of ${amount} via ${paymentMethod} was successful!`);
    } catch (error) {
      console.error("Error posting payment:", error);
      toast.error(`Payment failed: ${error?.response?.data?.message || "An error occurred"}`);
    }
  };
  
  
  const handleUpdatePayment = async (e, id, clientName) => {
    e.preventDefault();
    const amount = parseFloat(e.target.amount.value);
    const date = e.target.date.value;
    const note = e.target.note.value;
    const paymentMethod = e.target.paymentMethod.value;
    const body = { note, amount, date, paymentMethod };
    const datas = { title: `Update Payment ${amount} from ${clientName} in ${paymentMethod}`, date: new Date(), user: user?.displayName };
    
    try {
      await AxiosPublic.patch(`/Mpayment/${id}`, body);
      await AxiosPublic.post("/activity", datas);
      refetch();
      document.getElementById(`modal_${id}`).close();
      toast.success(`Payment updated: ${amount} from ${clientName} via ${paymentMethod}`);
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error(`Failed to update payment: ${error?.response?.data?.message || "An error occurred"}`);
    }
  };
  
  
  const handledelete = (ids, id) => {
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
        AxiosPublic.delete(`/clientPayment/delete/${id}/${ids}`)
          .then((res) => {
            toast.success("Payment deleted successfully!");
            refetch(); // Refresh data after deletion
          })
          .catch((error) => {
            console.error("Error deleting payment:", error);
            toast.error(`Failed to delete payment: ${error?.response?.data?.message || "An error occurred"}`);
          });
      }
    });
  };
  

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];  

  return (
    <div>

            <div className=" my-5">
               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-3 lg:gap-5 mt-3 mb-3">
    
                 <BalanceCard img={`https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png`} amount={findClients?.payments?.filter(h => h?.paymentMethod === 'bkashMarchent')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co/520Py6s/bkash-1.png`} amount={findClients?.payments?.filter(h => h?.paymentMethod === 'bkashPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co/JQBQBcF/nagad-marchant.png`} amount={findClients?.payments?.filter(h => h?.paymentMethod === 'nagadPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co/QkTM4M3/rocket.png`} amount={findClients?.payments?.filter(h => h?.paymentMethod === 'rocketPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co.com/kG9cBXJ/BBBLBank.png`} amount={findClients?.payments?.filter(h => h?.paymentMethod === 'bank')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co.com/vH2fPBm/DBBLBank.png`} amount={findClients?.payments?.filter(h => h?.paymentMethod === 'DBBLBank')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
                 <BalanceCard img={`https://i.ibb.co.com/pnS6nt4/IBBLBank.png`} amount={findClients?.payments?.filter(h => h?.paymentMethod === 'IBBLBank')?.reduce((acc, payment) => acc + payment?.amount, 0)}></BalanceCard>
             
                 <div 
                   style={{ backgroundColor: '#d9f8d9', border: 'var(--border)' }} 
                   className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
                 >
                   <h1 className="px-3 text-black text-xl font-bold text-center">TOTAL</h1>
                   <p className="balance-card-text text-lg mt-2 lg:text-xl font-bold text-gray-700">
                     <span className="text-lg lg:text-xl font-extrabold">৳</span>
                     {findClients?.payments?.reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    ).toFixed(0)}
                   </p>
                 </div>
               </div>
              </div>

      <div className="  side-space ">
        <div>

       <div className="flex  items-center  mb-3 justify-between ">
        <button
      className="add"
       onClick={() => document.getElementById("my_modal_8").showModal()}
     >
        Pay Now
</button>

 <div className="mb-3">
   <select id="month" value={selectedMonth}   onChange={(e) => changeTab2(e.target.value)} className="select2">
     <option value="all">Select Months</option>
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
              className="input2"
            />
          </div>
       
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              required
              type="number"
              name="amount"
              className="input2"
            />
          </div>
          
          <div className="mb-4">

          <div className="mt-2 grid mb-4 lg:grid-cols-3">
  {[
    { value: "bkashMarchent", label: "Bkash Marchent" },
    { value: "bkashPersonal", label: "Bkash Personal" },
    { value: "nagadPersonal", label: "Nagad Personal" },
    { value: "rocketPersonal", label: "Rocket Personal" },
    { value: "bank", label: "Brack Bank" },
    { value: "DBBLBank", label: "DBBL Bank" },
    { value: "IBBLBank", label: "IBBL Bank" },
  ].map(({ value, label }) => (
    <div className="form-control" key={value}>
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="paymentMethod"
          value={value}
          className="radio radio-primary"
          required
        />
        <span className="label-text text-black">{label}</span>
      </label>
    </div>
  ))}
</div>



            <div className="mb-4">
            <label className="block text-gray-700">Note (optional)</label>
            <input
             placeholder="type note..."
              type="text"
              name="note"
              className="input2"
            />
          </div>
         </div>

        {/* Buttons at the bottom in a two-grid layout */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <button
            type="button"
            className="close"
            onClick={() => document.getElementById("my_modal_8").close()}
          >
            Close
          </button>
          <button
            type="submit"
            className="submit"
          >
            Pay Now
          </button>
        </div>
      </form>
    </div>
  </dialog>
       </div>

        <div  className="table-div " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1" >
                <th  className="text-center">{findClients?.payments?.length} Items</th>
                <th>Date</th>
                <th>Client Name</th>
                <th>Amount</th>
                <th className="text-center">Payment Method</th>
                <th> Note</th>
              </tr>
            </thead>
            <tbody>
              {findClients?.payments
  ?.filter(payment => payment && payment.date)
  .filter(payment => {
    const paymentDate = new Date(payment.date);
    if (selectedMonth === 'all') {
      return true; 
    }
    return paymentDate.getMonth() + 1 === parseInt(selectedMonth, 10); month
  })
  ?.sort((a, b) => new Date(b.date) - new Date(a.date)) 
  ?.map((payment, index) => (
                <tr 
                key={payment.id}
                className={`tr2`}
              >
                  <td  className=" text-center">
                  <button
    className=" hover:bg-blue-700 text-[#f86c6b] text-xl px-2 py-1 rounded"
    onClick={() => handledelete(payment.ids ,payment.id)}
  >
    <FaMinusSquare  />
  </button>
                  </td>
                  <td >
                  {new Date(payment.date).toLocaleDateString("en-GB")}
                  </td>
                
                  <td>
                    {payment.clientName}
                  </td>

                  <td >
                    <span className="text-md mr-1 font-extrabold">৳</span>{" "}
                    {payment.amount}
                  </td>

                  <td  className=" text-center">
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
                    {payment.paymentMethod === "DBBLBank" && (
                      <img
                        className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                        src="https://i.ibb.co.com/nnN8KW0/DBBL.png"
                        alt=""
                      />
                    )}
                    {payment.paymentMethod === "IBBLBank" && (
                      <img
                        className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
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
                  <td >
                    {" "}
                    {payment.note}
                  </td>

                      <dialog id={`modal_${payment?._id}`} className="modal">
      <div className="modal-box text-black bg-white font-bold">
        <form onSubmit={(e) => handleUpdatePayment(e, payment?._id,payment?.clientName)}>
        <div className="mb-4">
            <label className="block text-left text-gray-700">Date</label>
            <input
              type="date"
              defaultValue={payment?.date}
              name="date"
              className="input2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-left text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              defaultValue={payment?.amount}
              className="input2"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-left text-gray-700">Method</label>
            <select
              name="paymentMethod"
              defaultValue={payment?.paymentMethod}
              className="select2"
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
              defaultValue={payment?.note}
              className="input2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              className="close"
              onClick={() => document.getElementById(`modal_${payment._id}`).close()}
            >
              Close
            </button>
            <button
              type="submit"
              className="add"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </dialog>
      

                </tr>
              ))}
              <tr  className=" tr1 font-bold">
                <td  className="text-right" colSpan="3">
                  Total Amount :
                </td>
                <td >
                  <span className="text-md mr-1 font-extrabold">৳</span>{" "}
                  {findClients?.payments?.reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    ).toFixed(0)}
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientPaymentHistry;
