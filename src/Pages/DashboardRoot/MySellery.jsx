import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useUsers from '../../Hook/useUsers';
import { FaEdit } from 'react-icons/fa';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import useEmployeePayment from '../../Hook/useEmployeePayment';
import { AuthContext } from '../../Security/AuthProvider';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const MySellery = () => {
  const [employeePayment] = useEmployeePayment();
  const [users, refetch] = useUsers();
  const {user}=useContext(AuthContext)
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(''); // State to track the selected month

  useEffect(() => {
    // Filter users with role 'employee'
    const employees = users.filter(user => user.role === 'employee');

    // Find the specific user based on the email
    const filteredUser = employees.find(user => user.email === user?.email);

    if (filteredUser) {
      const { monthlySpent, sellery } = filteredUser;

      // Filter employee payments by email
      const employeePayments = employeePayment.filter(payment => payment.employeeEmail === user?.email);

      // Create a mapping of total payAmount by month
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
        const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
        const totalAdminPay = paymentByMonth[month] || 0;

        return {
          month,
          totalSpent,
          totalSellery,
          totalBonus,
          totalBill: totalSpent * 140,
          totalDue: totalSpent * 140 - totalAdminPay,
          totalSelleryPaid: totalSpent * 7 - totalSellery,
          totalAdminPay // Add totalAdminPay to the data
        };
      });

      setEmployeeData(monthlyData);
    }
  }, [users, user?.email, employeePayment]);

  return (
    <div className='m-5'>
      <div className="overflow-x-auto text-center rounded-xl border-l border-gray-400">
        <table className="min-w-full text-center bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Month</th>
              <th className="p-3">Spent</th>
              <th className="p-3">T. Bill</th>
              <th className="p-3">Admin Pay</th>
              <th className="p-3">T. Due</th>
              <th className="p-3">T. Sellery</th>
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
                    ? "bg-white text-left text-black border-b border-opacity-20"
                    : "bg-gray-200 text-left text-black border-b border-opacity-20"
                }`}
              >
                <td className="p-3 border-r-2 border-gray-300 text-center px-5">{index + 1}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center px-5">
                  {data.month}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${data.totalSpent.toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {data.totalBill.toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {data.totalAdminPay.toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {data.totalDue.toFixed(2)}
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
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#05a0db] font-bold text-white">
            <tr>
              <td className="p-3 text-right border-gray-300" colSpan="2">Total</td>
              <td className="p-3 border-gray-300">
                ${employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)}
              </td>
              <td className="p-3 border-gray-300">
                ৳ {(employeeData.reduce((acc, data) => acc + data.totalBill, 0)).toFixed(2)}
              </td>
              <td className="p-3 border-gray-300">
                ৳ {(employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)).toFixed(2)}
              </td>
              <td className="p-3 border-gray-300">
                ৳ {(employeeData.reduce((acc, data) => acc + data.totalDue, 0)).toFixed(2)}
              </td>
              <td className="p-3 border-gray-300">
                ৳ {(employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0)).toFixed(2)}
              </td>
              <td className="p-3 border-gray-300">
                ৳ {(employeeData.reduce((acc, data) => acc + data.totalSellery, 0)).toFixed(2)}
              </td>
                             
              <td className="p-3 border-gray-300">
                ৳ {(employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0)).toFixed(2)}
              </td>
              <td className="p-3 border-gray-300">
                ৳ {(employeeData.reduce((acc, data) => acc + data.totalBonus, 0)).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

export default MySellery;
