import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { useLocation, useParams } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMpayment from "../../Hook/UseMpayment";
import useCampaings from "../../Hook/useCampaign";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import axios from "axios";
import Swal from "sweetalert2";
import { MdDelete, MdEditSquare } from "react-icons/md";

const PaymentHistry = () => {
  const { user } = useContext(AuthContext);
  const [ users ]=useUsers()
  const param = useParams();
  console.log(param);
  const [MPayment, refetch] = useMpayment();
  const AxiosPublic = UseAxiosPublic();
  const [totalPayment, setTotalPayment] = useState(0);
  const [Histry, setHistry] = useState([]);
  const [Histryy, setHistryy] = useState([]);
 
  const [userdata,setUserData]=useState()
  console.log(userdata);


  useEffect(() => {
    // Sort the Histry array by date in descending order
    const sortedHistry = [...Histry].sort((a, b) => new Date(b.date) - new Date(a.date));
    setHistryy(sortedHistry);
  }, [Histry]);

  useEffect(() => {
    if (param?.email) {
      const realdata = MPayment.filter((m) => m.clientEmail === param.email);
      setHistry(realdata);
      console.log("Filtered Data:", realdata);
      const totalBill = realdata.reduce(
        (acc, campaign) => acc + parseFloat(campaign.amount),
        0
      );
      setTotalPayment(totalBill);
    }
 
  }, [param?.email, MPayment]);

  useEffect(()=>{
    const finder=users.find(use=>use.email === user?.email)
    setUserData(finder)
  },[users,user?.email])


    const [clients]=useClients()
    const [datas,setdatas]=useState()
    console.log(datas);
    useEffect(() => {
    if (param?.email) {
        const realdata = clients.find((m) => m.clientEmail === param?.email);
        setdatas(realdata)
      }
    }, [param?.email, clients]);

  const [dataa2, setData2] = useState([]);

  const [campaign] = useCampaings();

  const [totalSpent, setTotalSpent] = useState(0);
  const [dollerRate, setDollerRate] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  console.log(param?.email);

  useEffect(() => {
    const filtered = campaign.filter(
      (campaign) => campaign.clientEmail === param?.email
    );
    console.log("hdjklhgsfdakgDSAOPJGIOJFDJGJHJFD", filtered);
    setData2(filtered);

    const totalBill = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tSpent),
      0
    );
    setTotalSpent(totalBill);

    const dollerRate = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.dollerRate),
      0
    );
    const vag = dollerRate / filtered.length;
    setDollerRate(vag);

    const total = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tBudged),
      0
    );
    setTotalBudged(total);
  }, [campaign, param?.email]);

  const location=useLocation()
  const handlePayment = async (e) => {
    e.preventDefault();
    const paymentMethod = e.target.paymentMethod.value;
    const amount = parseFloat(e.target.amount.value);
    const date = e.target.date.value;
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
    console.log(body);
    try {
      await AxiosPublic.post(`https://digital-networking-server.vercel.app/MPayment`,body);
      toast.success("Payment successful");
      refetch(); // Automatically refetch after successful payment
      setTimeout(() => {
        window.location.reload();
      }, 500); 
  
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    }

    const tSpent = totalSpent;
    const tBill = totalSpent * dollerRate;
    const tPayment = totalPayment + amount; // Ensure this variable is defined and correct
    const tBudged = totalBudged;
    const data = { tSpent, tBill, tPayment, tBudged };
    AxiosPublic.patch(`https://digital-networking-server.vercel.app/clients/${param?.email}`,data)
    .then((res) => {
        console.log(res.data);
        refetch(); // Ensure this function is defined and correct
        toast.success("Campaign updated successfully");
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign");
      });

      const fields = {
        bkashMarchent: (userdata.bkashMarchent || 0) + amount + (paymentMethod === 'bkashMarchent' ? amount : 0),
        bkashPersonal: (userdata.bkashPersonal || 0) + amount,
        nagadPersonal: (userdata.nagadPersonal || 0) + amount,
        rocketPersonal: (userdata.rocketPersonal || 0) + amount,
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
    const amount = parseFloat(e.target.amount.value);
    const previousAmount = parseFloat(e.target.previousAmount.value);
    const date = e.target.date.value;
    const note = e.target.note.value;
    const paymentMethod = e.target.paymentMethod.value;
    const body = { note, amount, date, paymentMethod };
    AxiosPublic.patch(
      `https://digital-networking-server.vercel.app/Mpayment/${id}`,
      body
    )
      .then((res) => {
        console.log(res.data);
        refetch();
        toast.success("Campaign updated successfully");
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign");
      });

    const calculate = amount - previousAmount;
    const tSpent = totalSpent;
    const tBill = totalSpent * dollerRate;
    const tPayment = totalPayment + calculate; // Ensure this variable is defined and correct
    const tBudged = totalBudged;

    const data = { tSpent, tBill, tPayment, tBudged };

    AxiosPublic.patch(
      `https://digital-networking-server.vercel.app/clients/${param?.email}`,
      data
    )
      .then((res) => {
        console.log(res.data);
        refetch(); // Ensure this function is defined and correct
        toast.success("Campaign updated successfully");
        // window.location.reload(); // Generally better to avoid reloading the page
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign");
      });
  };

  const handledelete = (id) => {
    AxiosPublic.delete(`/Mpayment/${id}`).then((res) => {
      toast.success("Delete successfully");
      refetch();
    });

 }
  return (
    <div>

      <div className=" p-2 sm:p-4 dark:text-green-600">
        <h6 className="text-center font-bold text-xl md:text-5xl text-green-600">
          Payment History
        </h6>
        <div>
  <button
    className="font-avenir px-3 mx-auto py-1 bg-[#05a0db]  rounded-lg text-white"
    onClick={() => document.getElementById("my_modal_8").showModal()}
  >
    Pay Now
  </button>
  <dialog id="my_modal_8" className="modal">
    <div className="modal-box text-black bg-white font-bold">
      <form onSubmit={(e) => handlePayment(e)}>
       
      <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              required
              type="date"
              name="date"
              defaultValue={0}
              className="w-full border-2 border-black bg-green-300 text-black rounded p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">New Amount</label>
            <input
              required
              type="number"
              name="amount"
              className="w-full border-2 bg-white border-black rounded p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Note</label>
            <input
              required
              type="text"
              name="note"
              className="w-full border-2 bg-white border-black rounded p-2 mt-1"
            />
          </div>
 
       
          <div className="mb-4">
            <label className="block text-gray-700">Payment Method</label>
            <select
              name="paymentMethod"
              className="w-full border-2 border-black bg-white rounded p-2 mt-1"
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
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            className="p-2 rounded-lg bg-red-600 text-white text-center"
            onClick={() => document.getElementById("my_modal_8").close()}
          >
            Close
          </button>
          <button
            type="submit"
            className="font-avenir px-3 py-2 bg-[#05a0db] rounded-lg text-white text-center"
          >
            Pay Now
          </button>
        </div>
      </form>
    </div>
  </dialog>
</div>

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white">
            <thead className="bg-[#05a0db] text-white">
              <tr>
                <th className="p-3 ">SL</th>
                <th className="p-3">Payment Date</th>
                <th className="p-3 ">Client Name</th>
                <th className="p-3">Payment Amount</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3"> Note</th>
                <th className="p-3">Action</th>
                
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
              
                  <td className="p-3 border-r-2 border-gray-200 text-center">
                  <div className="flex justify-start items-center gap-3">
  <div>
    <button
      className="text-blue-700 text-3xl"
      onClick={() =>
        document.getElementById(`modal_${payment._id}`).showModal()
      }
    >
      <MdEditSquare />
    </button>

    <dialog id={`modal_${payment._id}`} className="modal">
      <div className="modal-box text-black bg-white font-bold">
        <form onSubmit={(e) => handleUpdatePayment(e, payment._id)}>
          <div className="mb-4">
            <label className="block text-gray-700">Previous Amount</label>
            <input
              type="number"
              name="previousAmount"
              disabled
              defaultValue={payment?.amount}
              className="w-full border-2 bg-white border-black rounded p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">New Amount</label>
            <input
              type="number"
              name="amount"
              defaultValue={payment.amount}
              className="w-full border-2 bg-white border-black rounded p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              defaultValue={payment.date}
              name="date"
              className="w-full border-2 border-black bg-green-300 rounded p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Method</label>
            <select
              name="paymentMethod"
              defaultValue={payment.paymentMethod}
              className="w-full border-2 border-black bg-white rounded p-2 mt-1"
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
              type="text"
              name="note"
              defaultValue={payment?.note}
              className="w-full border-2 border-black bg-white rounded p-2 mt-1"
            />
          </div>

          {/* Buttons at the bottom in a two-grid layout */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              className="p-2 rounded-lg bg-red-600 text-white text-center"
              onClick={() => document.getElementById(`modal_${payment._id}`).close()}
            >
              Close
            </button>
            <button
              type="submit"
              className="font-avenir px-3 py-2 bg-[#05a0db] rounded-lg text-white text-center"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
  <button
    className="text-start flex justify-start text-black text-3xl"
    onClick={() => handledelete(payment._id)}
  >
    <MdDelete />
  </button>
</div>

                  </td>
                 
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
                <td className="p-3 text-center"></td>
                
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistry;
