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

const ClientPaymentHistry = () => {
  const { user } = useContext(AuthContext);
  const [users] = useUsers();
  const param = useParams();
  const [MPayment, refetch] = useMpayment();
  const AxiosPublic = UseAxiosPublic();
  const [totalPayment, setTotalPayment] = useState(0);
  const [Histryy, setHistryy] = useState([]);
  const [datas, setdatas] = useState();
  const [clients] = useClients();

  useEffect(() => {
    if (param?.email) {

      const filteredData = MPayment.filter((m) => m.clientEmail === param.email);
      const sortedHistry = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistryy(sortedHistry);
  
      const totalBill = filteredData.reduce((acc, campaign) => acc + parseFloat(campaign.amount), 0);
      setTotalPayment(totalBill);
  
      const clientData = clients.find((m) => m.clientEmail === param.email);
      setdatas(clientData);
    }
  }, [param?.email, MPayment, clients]);
  
  const handlePayment = async (e) => {
    e.preventDefault();
    const paymentMethod = e.target.paymentMethod.value;
    const amount = parseFloat(e.target.amount.value);
    const date = new Date();
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


  return (
    <div>
      <div className=" p-2 sm:p-4 dark:text-green-600">
        <div>
     {
      ddd?.role === 'employee' &&  <button
      className="font-avenir hover:bg-indigo-700 px-6 w-full lg:w-auto mx-auto py-2 bg-[#05a0db]  rounded-lg text-white"
       onClick={() => document.getElementById("my_modal_8").showModal()}
     >
        Pay Now
</button>
     }
  <dialog id="my_modal_8" className="modal">
    <div className="modal-box text-black bg-white font-bold">
      <form onSubmit={(e) => handlePayment(e)}>
       

          <div className="mb-4">
            <label className="block text-gray-700">New Amount</label>
            <input
              required
              type="number"
              name="amount"
              className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Note</label>
            <input
              required
              type="text"
              name="note"
              className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
            />
          </div>
 
       
          <div className="mb-4">
            <label className="block text-gray-700">Payment Method</label>
            <select
              name="paymentMethod"
              className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
            >
              <option disabled value="">
                Select a Method
              </option>
              <option value="bkashMarchent">Bkash Marchent</option>
              <option value="bkashPersonal">Bkash Personal</option>
              <option value="nagadPersonal">Nagad Personal</option>
              <option value="rocketPersonal">Rocket Personal</option>
              <option value="bank">Bank</option>
            </select>
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
            className="font-avenir hover:bg-indigo-700 px-3 py-2 bg-[#05a0db] rounded-lg text-white text-center"
          >
            Pay Now
          </button>
        </div>
      </form>
    </div>
  </dialog>
</div>

        <div className="overflow-x-auto mt-5 rounded-xl ">
          <table className="min-w-full bg-white">
            <thead className="bg-[#05a0db] text-white">
              <tr>
                <th className="p-3 ">SL</th>
                <th className="p-3">Payment Date</th>
                <th className="p-3 ">Client Name</th>
                <th className="p-3">Payment Amount</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3"> Note</th>
                {
      ddd?.role === 'employee' && 
      <th className="p-3">Action</th>
      }
                
                
              </tr>
            </thead>
            <tbody>
              {Histryy.map((payment, index) => (
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
                
                  <td className="p-3 border-r-2 border-gray-200 text-start">
                    {payment.clientName}
                   
                  </td>
                  <td className="p-3 border-r-2 border-gray-200 text-center">
                    <span className="text-md mr-1 font-extrabold">৳</span>{" "}
                    {payment.amount}
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
                  <td className="p-3 border-r-2 border-gray-200 text-start">
                    {" "}
                    {payment.note}
                  </td>
              

                  {
      ddd?.role === 'employee' &&
      <td className="p-3 border-r-2 border-gray-200 text-center">
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
              <tr className="bg-[#05a0db] text-white font-bold">
                <td className="p-3 text-center" colSpan="3">
                  Total Amount :
                </td>
                <td className="p-3 text-center">
                  <span className="text-md mr-1 font-extrabold">৳</span>{" "}
                  {totalPayment}
                </td>
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center"></td>
                 {
                    ddd?.role === 'employee' && 
                    <td className="p-3 text-center"></td>
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
