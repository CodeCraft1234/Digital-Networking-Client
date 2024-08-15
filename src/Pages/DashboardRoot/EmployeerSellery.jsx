import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useUsers from '../../Hook/useUsers';
import { FaEdit } from 'react-icons/fa';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const EmployeerSellery = () => {
  const { email } = useParams();
  const [users,refetch] = useUsers();
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(''); // State to track the selected month

  useEffect(() => {
    // Filter users with role 'employee'
    const employees = users.filter(user => user.role === 'employee');

    // Find the specific user based on the email
    const filteredUser = employees.find(user => user.email === email);

    if (filteredUser) {
      const { monthlySpent, sellery, adminPay } = filteredUser;

      const monthlyData = months.map(month => {
        const monthlySpentData = (monthlySpent || []).filter(spent => new Date(spent.date).toLocaleString('default', { month: 'long' }) === month);
        const selleryData = (sellery || []).filter(sell => sell.month === month);
        const adminPayData = (adminPay || []).filter(pay => new Date(pay.date).toLocaleString('default', { month: 'long' }) === month);

        const totalSpent = monthlySpentData.reduce((acc, spent) => acc + spent.totalSpentt, 0);
        const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
        const totalAdminPay = adminPayData.reduce((acc, pay) => acc + pay.adminPayAmount, 0);

        return {
          month,
          totalSpent,
          totalSellery,
          totalBonus,
          totalAdminPay,
          totalBill: totalSpent * 140,
          totalDue: totalSpent * 140 - totalAdminPay,
          totalSelleryPaid: totalSpent * 7 - totalSellery
        };
      });

      setEmployeeData(monthlyData);
    }
  }, [users, email]);

  const AxiosPublic = UseAxiosPublic();

  const handleSellery = (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.amount.value);
    const bonus = parseFloat(e.target.bonus.value);
    const date = new Date(`${selectedMonth} 1, ${new Date().getFullYear()}`); // Create a date based on the selected month

    const selleryData = {
      amount,
      bonus,
      date,
      month: selectedMonth, // Use the selected month
      email
    };

    AxiosPublic.post('/users/updateSellery', { email, selleryData })
      .then(res => {
        console.log(res.data);
        refetch()
        // Optional: Close the modal or do additional actions here
      })
      .catch(error => {
        console.error("Error posting user data:", error);
      });
  };

  return (
    <div className='m-5'>
      <div className="overflow-x-auto text-center border border-black">
        <table className="min-w-full text-center bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Month</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Total Bill</th>
              <th className="p-3">Admin Pay</th>
              <th className="p-3">Total Due</th>
              <th className="p-3">Total Sellery</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Unpaid</th>
              <th className="p-3">Bonus</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((data, index) => (
              <tr
                key={data.month}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-gray-500 border-b border-opacity-20"
                    : "bg-gray-200 text-left text-gray-500 border-b border-opacity-20"
                }`}
              >
                <td className="p-3 border-r-2 border-gray-300 text-center px-5">{index + 1}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center px-5">
                  {data.month}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${data.totalSpent}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {data.totalBill}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {data.totalAdminPay || "00.00"}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${data.totalDue}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${data.totalSpent * 7}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                
                  <div className="relative group flex items-center justify-center">
                    {data.totalSellery}
                    <button
                      className="text-black text-right px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => {
                        setSelectedMonth(data.month); // Set the selected month before opening the modal
                        document.getElementById(`my_modal_6d-${index}`).showModal();
                      }}
                    >
                      <FaEdit />
                    </button>

                    <dialog id={`my_modal_6d-${index}`} className="modal">
                      <div className="modal-box bg-white">
                        <form onSubmit={handleSellery}>
                          <h1 className="text-black font-bold text-start">Sellery Amount for {data.month}</h1>
                          <input
                            type="number"
                            name="amount"
                            step="0.01"
                            placeholder="0"
                            className="w-full rounded p-2 mt-3 bg-white text-black border border-gray-700"
                          />
                          <h1 className="text-black mt-3 font-bold text-start">Bonus</h1>
                          <input
                            type="number"
                            name="bonus"
                            step="0.01"
                            placeholder="0"
                            className="w-full rounded p-2 mt-3 bg-white text-black border border-gray-700"
                          />

                          <button
                            type="submit"
                            className="mt-4 font-avenir px-3 mx-auto py-1 rounded-lg text-white bg-[#05a0db]"
                          >
                            Update
                          </button>
                        </form>
                        <form method="dialog">
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                      </div>
                    </dialog>
                  </div>
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${data.totalSelleryPaid}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${data.totalBonus}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#05a0db] text-white">
            <tr>
              <td className="p-3 text-right border-gray-300 " colSpan="2">Total</td>
              <td className="p-3  border-gray-300">${employeeData.reduce((acc, data) => acc + data.totalSpent, 0)}</td>
              <td className="p-3  border-gray-300">৳ {employeeData.reduce((acc, data) => acc + data.totalBill, 0)}</td>
              <td className="p-3  border-gray-300">৳ {employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)}</td>
              <td className="p-3  border-gray-300">${employeeData.reduce((acc, data) => acc + data.totalDue, 0)}</td>
              <td className="p-3  border-gray-300">${employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0)}</td>
              <td className="p-3  border-gray-300">${employeeData.reduce((acc, data) => acc + data.totalSellery, 0)}</td>
              <td className="p-3  border-gray-300">${employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0)}</td>
              <td className="p-3  border-gray-300">${employeeData.reduce((acc, data) => acc + data.totalBonus, 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default EmployeerSellery;
