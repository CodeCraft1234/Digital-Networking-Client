import React, { useState, useEffect } from 'react';
import useUsers from '../../Hook/useUsers';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const Sellery = () => {
  const [users] = useUsers();
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));

  useEffect(() => {
    // Filter users with role 'employee'
    const employees = users.filter(user => user.role === 'employee');

    // Aggregate totalSpentt and amount for each employee
    const aggregatedData = employees.map(user => {
      // Ensure monthlySpent and sellery arrays exist before reducing
      const monthlySpentData = (user.monthlySpent || []).filter(spent => new Date(spent.date).toLocaleString('default', { month: 'long' }) === selectedMonth);
      const selleryData = (user.sellery || []).filter(sell => sell.month === selectedMonth);

      // Filter adminPay for the selected month
      const adminPayData = (user.adminPay || []).filter(pay => new Date(pay.date).toLocaleString('default', { month: 'long' }) === selectedMonth);

      const totalSpent = monthlySpentData.reduce((acc, spent) => acc + spent.totalSpentt, 0);
      const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
      const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);

      // Aggregate adminPayAmount for the selected month
      const totalAdminPay = adminPayData.reduce((acc, pay) => acc + pay.adminPayAmount, 0);

      return {
        ...user,
        totalSpent,
        totalSellery,
        totalBonus,
        totalAdminPay,
      };
    });

    setEmployeeData(aggregatedData);
  }, [users, selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Calculate totals for footer
  const totalSpent = employeeData.reduce((acc, user) => acc + user.totalSpent, 0);
  const totalSellery = employeeData.reduce((acc, user) => acc + user.totalSellery, 0);
  const totalBonus = employeeData.reduce((acc, user) => acc + user.totalBonus, 0);
  const totalAdminPay = employeeData.reduce((acc, user) => acc + user.totalAdminPay, 0);
  const totalDue = totalSpent * 140 - totalAdminPay;

  return (
    <div className='m-5'>
       <Helmet>
        <title>Selary | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className="mb-4 ">
        <label htmlFor="monthSelect" className="mr-2 text-black">Sort by Month:</label>
        <select id="monthSelect" value={selectedMonth} onChange={handleMonthChange} className="p-2 bg-white text-black border border-gray-700 rounded">
          {months.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto text-center border border-black">
        <table className="min-w-full text-center bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Total Bill</th>
              <th className="p-3">Admin Pay</th>
              <th className="p-3">Total Due</th>
              <th className="p-3">Total Sellery</th>
              <th className="p-3"> Paid</th>
              <th className="p-3">Unpaid</th>
              <th className="p-3">Bonus</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((user, index) => (
              <tr
                key={user.email}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-gray-500 border-b border-opacity-20"
                    : "bg-gray-200 text-left text-gray-500 border-b border-opacity-20"
                }`}
              >
                <td className="p-3 border-r-2 border-gray-300 text-center px-5">{index + 1}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center px-5">
                  <Link to={`/dashboard/employeerSellery/${user.email}`}>
                    {user.name}
                  </Link>
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${user.totalSpent}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {user.totalSpent * 140 }
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {user.totalAdminPay || "00.00"}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${user.totalSpent * 140 - user.totalAdminPay || 0}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${user.totalSpent * 7}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${user.totalSellery}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${user.totalSpent * 7 - user.totalSellery}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ${user.totalBonus}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#05a0db] text-white">
            <tr>
              <td className="p-3 text-right border-gray-300 " colSpan="2">Total</td>
              <td className="p-3  border-gray-300 r">${totalSpent}</td>
              <td className="p-3  border-gray-300 r">৳ {totalSpent * 140}</td>
              <td className="p-3  border-gray-300 r">৳ {totalAdminPay || "00.00"}</td>
              <td className="p-3  border-gray-300 r">${totalDue}</td>
              <td className="p-3  border-gray-300 r">${totalSpent * 7}</td>
              <td className="p-3  border-gray-300 r">${totalSellery}</td>
              <td className="p-3  border-gray-300 r">${totalSpent * 7 - totalSellery}</td>
              <td className="p-3  border-gray-300 text-center">${totalBonus}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Sellery;
