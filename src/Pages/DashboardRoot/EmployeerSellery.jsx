import {  useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useUsers from '../../Hook/useUsers';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import useEmployeePayment from '../../Hook/useEmployeePayment';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const EmployeerSellery = () => {
  const [employeePayment] = useEmployeePayment();
  const { email } = useParams();
  const [users, refetch] = useUsers();
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [modalData, setModalData] = useState(null); // For payment modal
  const [monthlyData, setMonthlyData] = useState(null); // For monthly data modal
  const [currentuser,setCurrentuser]=useState([])
  console.log(currentuser);

  useEffect(() => {
    const employees = users.filter(user => user.role === 'employee');
    const filteredUser = employees.find(user => user.email === email);

    setCurrentuser(filteredUser)

    if (filteredUser) {
      const { monthlySpent, sellery } = filteredUser;

      const employeePayments = employeePayment.filter(payment => payment.employeeEmail === email);

      const paymentByMonth = months.reduce((acc, month) => {
        const monthPayments = employeePayments.filter(payment => new Date(payment.date).toLocaleString('default', { month: 'long' }) === month);
        const totalPayAmount = monthPayments.reduce((sum, payment) => sum + parseFloat(payment.payAmount), 0);
        acc[month] = totalPayAmount;
        return acc;
      }, {});

      const monthlyData = months.map(month => {
        const monthlySpentData = (monthlySpent || []).filter(spent => new Date(spent.date).toLocaleString('default', { month: 'long' }) === month);
        const selleryData = (sellery || []).filter(sell => sell.month === month);

        const totalSpent = monthlySpentData.reduce((acc, spent) => acc + spent.totalSpentt, 0);
        const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount || 0, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus || 0, 0);
        const totalAdminPay = paymentByMonth[month] || 0;

        return {
          month,
          totalSpent,
          totalSellery,
          totalBonus,
          totalBill: totalSpent * 140,
          totalDue: totalSpent * 140 - totalAdminPay,
          totalSelleryPaid: totalSpent * 7 - totalSellery,
          totalAdminPay,
          selleryData // Add sellery data to the monthly data
        };
      });

      setEmployeeData(monthlyData);
    }
  }, [users, email, employeePayment]);

  const AxiosPublic = UseAxiosPublic();

  const handleSellery = (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.amount.value);
    const bonus = parseFloat(e.target.bonus.value);
    const date = new Date(`${selectedMonth} 1, ${new Date().getFullYear()}`);

    const generateRandomId = () => Math.floor(Math.random() * 1e13);
    const id = generateRandomId();
    const selleryData = {
      id,
      amount,
      bonus,
      date,
      month: selectedMonth,
      email
    };

    AxiosPublic.post('/users/updateSellery', { email, selleryData })
      .then(res => {
        console.log(res.data);
        toast.success('sellery pay successfully')
        refetch();
        document.getElementById('paymentModal').close()
      })
      .catch(error => {
        console.error("Error posting user data:", error);
      });
  };

  // Modal handlers
  const [sellery,setSellery]=useState([])
  const handleMonthClick = (data) => {
    setSelectedMonth(data.month); 
    const datass=currentuser?.sellery?.filter(s=>s.month === data?.month)
    setSellery(datass)
    setMonthlyData(data); 
    document.getElementById('monthlyModal2').showModal(); 
  };

  const handlePayNowClick = (data) => {
    setSelectedMonth(data.month); // Store the selected month
    setModalData(data); // Store the selected month's data for the payment modal
    document.getElementById('paymentModal').showModal(); // Open the payment modal
  };


   // Handle update function
   const handleUpdate2 = async (e, spentId) => {
    e.preventDefault();
    const totalSpent = e.target.totalSpent.value;
    const totalSpentParsed = parseFloat(totalSpent);
  
    try {
      const response = await AxiosPublic.put(`/updateSellery/${currentuser?._id}/${spentId}`, {
        totalSpentt: totalSpentParsed,
      });
  
      if (response.status === 200) {
        alert('Total spent updated successfully');
        refetch()
      }
    } catch (error) {
      console.error('Error updating total spent:', error);
      alert('Failed to update total spent');
    }
  };

  const handleDelete = (e, spentId) => {
    document.getElementById('monthlyModal2').close()
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/deleteSellery/${currentuser?._id}/${spentId}`).then((res) => {
          if (res.status === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "The payment has been deleted.",
              icon: "success",
            });
           refetch() // Optionally reload to update the data
          } else {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the payment.",
              icon: "error",
            });
          }
        });
      }
    });
  };
  

  return (
    <div className='m-5'>
      <Helmet>
        <title>E.M Sellery | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="grid my-5 grid-cols-2 md:grid-cols-2 lg:grid-cols-6 text-black sm:grid-cols-2 gap-5 justify-around ">
        <div className="px-5 py-10 rounded-2xl  bg-[#91a33a] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Spent</h2>
          <p className="lg:text-xl text-xl font-bold mt-2"> $ {employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Salery</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
             <span className="lg:text-xl text-xl font-extrabold">৳</span> {(employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0)).toFixed(2)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-xl font-bold">Total Paid</h2>
          <p className="lg:text-xl text-xl font-bold mt-2"> <span className="text-2xl font-extrabold">৳</span>{employeeData.reduce((acc, data) => acc + data.totalSellery, 0).toFixed(2)} </p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#ce1a38] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Unpaid</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
          <span className="lg:text-xl text-xl font-extrabold">৳</span>  {employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(2)}
          </p>
        </div>
        <div className="px-5 py-10 rounded-2xl  bg-[#504491] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Due</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
          <span className="lg:text-xl text-xl font-extrabold">৳</span> {employeeData.reduce((acc, data) => acc + data.totalSellery, 0).toFixed(2) - employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(2)}
          </p>
        </div>
        <div className="px-5 py-10 rounded-2xl  bg-[#a6d427] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Bonus</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
          <span className="lg:text-xl text-xl font-extrabold">৳</span> {employeeData.reduce((acc, data) => acc + data.totalBonus, 0).toFixed(2)}
          </p>
        </div>
      </div>



      <div className="overflow-x-auto text-center rounded-xl border-l border-gray-400">
        <table className="min-w-full text-center bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Month</th>
              <th className="p-3">Spent</th>
              <th className="p-3">T. Sellery</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Unpaid</th>
              <th className="p-3">Bonus</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((data, index) => (
              <tr
                key={data.month}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-black border-b border-opacity-20"
                    : "bg-gray-200 text-left text-black border-b border-opacity-20"
                }`}
              >
                <td className="p-3 border-r-2 border-gray-300 text-center px-5">{index + 1}</td>
                <td onClick={() => handleMonthClick(data)} className="p-3 hover:text-blue-600 cursor-pointer border-r-2 border-gray-300 text-center px-5">
                  {data.month}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${data.totalSpent.toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {(data.totalSpent * 7).toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ৳{data.totalSellery.toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {data.totalSelleryPaid.toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {data.totalBonus.toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  <button
                    className="font-avenir px-2.5 hover:bg-red-700 hover:text-white mx-auto py-0.5 bg-[#05a0db] rounded-lg text-white"
                    onClick={() => handlePayNowClick(data)}
                  >
                    Pay Now 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#05a0db] font-bold text-white">
          <tr>
            <td className="p-3 text-right" colSpan="2">Total</td>
            <td className="p-3">
              ${employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)}
            </td>
            <td className="p-3">
              ৳ {(employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0)).toFixed(2)}
            </td>
            <td className="p-3">
              ৳ 
            </td>
            <td className="p-3">
              ৳ {employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(2)}
            </td>
            <td className="p-3">
              ৳ {employeeData.reduce((acc, data) => acc + data.totalBonus, 0).toFixed(2)}
            </td>
            <td className="p-3"></td> {/* Empty for Action column */}
          </tr>
        </tfoot>
        </table>
      </div>

      <dialog id="monthlyModal2" className="modal">
  <div className="relative modal-box bg-white text-black">
    <button
      onClick={() => document.getElementById('monthlyModal2').close()}
      className="absolute top-2 right-2 bg-transparent text-gray-600 hover:text-black"
    >
      &#10006; {/* "X" Close Icon */}
    </button>

    <table className="bg-white border border-gray-300 text-black w-full">
    <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
      <tbody>
        {sellery?.map((item) => (
          <tr key={item.id}>
            <td className="p-3 border-r-2 border-gray-300 text-center">
              ৳ {item.amount || 0}
            </td>
            <td className="p-3 border-r-2 border-gray-300 text-center">
              {item.date
                ? new Intl.DateTimeFormat('en-US').format(new Date(item.date))
                : '0'}
            </td>
            <td className="p-3 border-r text-center border-gray-400">
              <div className="flex justify-center items-center gap-3">
                <div>
                  <button
                    className="bg-green-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    onClick={() =>
                      document.getElementById(`monthlyModal-${item.id}`).showModal()
                    }
                  >
                    Edit
                  </button>

                  {/* Edit Modal for Each Item */}
                  <dialog id={`monthlyModal-${item.id}`} className="modal">
                    <div className="relative modal-box bg-white text-black">
                      {/* Close Icon for Item Modal */}
                      <button
                        onClick={() => document.getElementById(`monthlyModal-${item.id}`).close()}
                        className="absolute top-2 right-2 bg-transparent text-gray-600 hover:text-black"
                      >
                        &#10006;
                      </button>
                      <form onSubmit={(e) => handleUpdate2(e, item.id)}>
                        <div className="mb-4">
                          <label className="block text-start text-gray-700">Total Spent</label>
                          <input
                            type="text"
                            name="totalSpent"
                            defaultValue={item.amount}
                            className="w-full bg-white border-black border rounded p-2 mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="submit"
                            className="font-avenir px-3 py-1 bg-[#05a0db] rounded-lg text-white"
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
                  onClick={(e) => handleDelete(e, item.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</dialog>



      {/* Payment Modal */}
      {modalData && (
        <dialog id="paymentModal" className="modal">
          <div className="modal-box bg-white">
            <h1 className="text-black font-bold text-start">Pay for {modalData.month}</h1>
            <form onSubmit={handleSellery}>
              <input type="hidden" name="month" value={modalData.month} />
              <input type="hidden" name="email" value={email} />
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Amount</span>
                </label>
                <input type="number" name="amount" placeholder="Amount" className="input bg-white text-black border border-gray-400 input-bordered" required />
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Bonus</span>
                </label>
                <input type="number" name="bonus" placeholder="Bonus" className="input bg-white text-black border border-gray-400 input-bordered"  />
              </div>
              <div className="modal-action grid lg:grid-cols-2 justify-center gap-5">
              <button onClick={() => document.getElementById('paymentModal').close()} className="btn btn-secondary w-full">Close</button>
                <button type="submit" className="btn w-full btn-primary">Submit</button>
               
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default EmployeerSellery;

