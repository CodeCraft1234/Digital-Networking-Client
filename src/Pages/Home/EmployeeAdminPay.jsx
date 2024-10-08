import {  useEffect, useState } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import { toast } from "react-toastify";
import { ImCross } from "react-icons/im";
import useUsers from "../../Hook/useUsers";

const EmployeeAdminPay = ({email}) => {
  const [employeePayment,refetch] = useEmployeePayment();
  const AxiosPublic = UseAxiosPublic();
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [users]=useUsers()

  const initialTab = localStorage.getItem("activeTabadminpayMonts") || "All";
  const [sortMonth, setSortMonth] = useState(initialTab || new Date().getMonth() + 1)

  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTabadminpayMonts", tab); 
  };

  useEffect(() => {
    const totalBill = filteredData.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount),
      0
    );
    setTotalPayment(totalBill);
  }, [filteredData]);

  useEffect(() => {
    const finds = employeePayment.filter((f) => f.employeeEmail === email);
    setData(finds);
    const finds2 = users.filter((f) => f.email === email);
    setData2(finds2);
  }, [employeePayment,users, email]);

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

    const totalBill = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount),
      0
    );
    setTotalPayment(totalBill);

    setFilteredData(filtered);
  }, [sortMonth, selectedDate, selectedCategory,  data]);


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


        const handleUpdate = (e, id) => {
        e.preventDefault();
        const payAmount = parseFloat(e.target.payAmount.value);
        const date = e.target.date.value;
        const note = e.target.note.value;
        const paymentMethod = e.target.paymentMethod.value;
        const body = { note, payAmount, date, paymentMethod };
    
        AxiosPublic.patch(`/employeePayment/${id}`,body
        ).then((res) => {
          refetch();
          toast.success("Update successful!");
        });
      };
    
      const handleDelete = (id) => {
        AxiosPublic.delete(`/employeePayment/${id}`).then((res) => {
          toast.success("Delete successful!");
          refetch();
        });
      };

  const [bkashMarcent,setBkashMarcentTotal]=useState(0)
  const [nagadPersonal,setNagadPersonalTotal]=useState(0)
  const [bkashPersonal,setBkashPersonalTotal]=useState(0)
  const [rocketPersonal,setRocketPersonalTotal]=useState(0)
  const [bankTotal,setBankTotal]=useState(0)
  const [total,setTotal]=useState(0)

  useEffect(()=>{
          const da=filteredData
          const filtered=filteredData

          const filter2=filtered.filter(d=>d.paymentMethod === 'bkashMarchent')
          const total = filter2.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setBkashMarcentTotal(total)

          const filter3=filtered.filter(d=>d.paymentMethod === 'nagadPersonal')
          const total3 = filter3.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setNagadPersonalTotal(total3)

          const filter4=filtered.filter(d=>d.paymentMethod === 'bkashPersonal')
          const total4 = filter4.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setBkashPersonalTotal(total4)

          const filter5=filtered.filter(d=>d.paymentMethod === 'rocketPersonal')
          const total5 = filter5.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setRocketPersonalTotal(total5)

          const filter6=filtered.filter(d=>d.paymentMethod === 'bank')
          const total6 = filter6.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setBankTotal(total6)

          const total7 = filtered.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
          setTotal(total7)
  },[employeePayment,email])


  const handlePayment = async (e) => {
    e.preventDefault();
    const employeeName = data2?.name;
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
       
      })

  };

  return (
    <div className="mt-5">
      <Helmet>
        <title>Admin Payment | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-5 mt-5 p-5">
   <div onClick={() => setSelectedCategory('bkashMarchent')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center  transition-transform transform hover:scale-105 border-0">
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

   <div onClick={() => setSelectedCategory('bank')} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform transform hover:scale-105 border-0">
     <img className="balance-card-img" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
  
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {bankTotal}</p>
   </div>

   <div  className="balance-card bg-white rounded-2xl shadow-lg p-5 pt-8 text-center transition-transform transform hover:scale-105 border-0">
   <h1 className="text-black text-xl font-bold">Total BDT </h1>
     <p className="balance-card-text text-lg pt-8 lg:text-2xl font-bold text-gray-700"><span className="text-lg lg:text-2xl font-extrabold"> ৳</span> {total}</p>
   </div>
     </div>

{/* ///////////////////////////////////////////////////////////////// */}
      <div className="flex text-black justify-center lg:justify-between ml-5 mb-5 gap-5 items-center">
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
            <div className="mb-4">
              <label className="block text-gray-250">Date</label>
              <input
                required
                type="date"
                name="date"
                className="w-full border bg-green-300 border-black rounded p-2 mt-1"
              />
            </div>
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
              <option value="bank">Bank</option>
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

     <div className="flex justify-end gap-3 lg:gap-5">
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
        <div className="flex flex-col justify-center items-center">
           <input
             type="date"
             className="border rounded bg-green-300 mr-5 text-black border-gray-400 p-2 mt-1"
             value={selectedDate}
             onChange={(e) => setSelectedDate(e.target.value)}
           />
         </div>
     </div>
      </div>

      <div className="overflow-x-auto rounded-xl text-black border border-black mx-5">
        <table className="min-w-full bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Payment Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Status</th>
              <th className="p-3">Note</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((payment, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">
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
                  {payment.status === 'pending' ? <p className="text-blue-700 font-bold">Pending</p> : <p className="text-green-800 font-bold">Approved</p>}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  {payment.note}
                </td>
                  <td className="p-3 border-r-2 flex gap-3 justify-center items-center border-gray-200 text-center">
                       <button
                            className="bg-green-700 text-white px-2 py-1 rounded"
                            onClick={() => handleEditClick(payment)}
                              >
                             Edit
                        </button>
                        <button
                          className="bg-red-700 text-white px-2  py-1 rounded"
                          onClick={() => handleDelete(payment._id)}
                        >
                          Delete
                        </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tr className="bg-[#05a0db] text-white font-bold">
              <td className="p-3 text-center" colSpan="2">
                Total Amount =
              </td>
              <td className="p-3 text-center">৳ {totalPayment}</td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
            </tr>
        </table>
      </div>
      
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Edit Payment</h2>
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
                  className="w-full border bg-white border-black  p-2 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-700">
                  Payment Amount
                </label>
                <input
                  type="number"
                  id="payAmount"
                  name="payAmount"
                  defaultValue={selectedPayment.payAmount}
                  className="w-full border bg-white border-black p-2 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="method" className="block text-gray-700">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  defaultValue={selectedPayment.paymentMethod}
                  className="w-full border bg-white border-black p-2 rounded-lg"
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
                  className="w-full border bg-white border-black p-2 rounded-lg"
                ></textarea>
              </div>
              <div className="flex gap-3 items-center justify-center">
                <button
                  type="button"
                  onClick={handleCancel}
                   className="bg-green-700 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
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

export default EmployeeAdminPay;
