import React, { useState, useEffect } from 'react';
import useUsers from '../../Hook/useUsers';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useEmployeePayment from '../../Hook/useEmployeePayment';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 31 }, (_, index) => 2020 + index); // Creates an array of years from 2020 to 2050

const Sellery = () => {
  const [employeePayment] = useEmployeePayment();
  const [users] = useUsers();
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Filter users with role 'employee'
    const employees = users.filter(user => user.role === 'employee');

    // Aggregate totalSpent, sellery, and total pay for each employee
    const aggregatedData = employees.map(user => {
      const monthlySpentData = (user.monthlySpent || []).filter(spent => {
        const spentDate = new Date(spent.date);
        return spentDate.toLocaleString('default', { month: 'long' }) === selectedMonth && spentDate.getFullYear() === selectedYear;
      });

      const selleryData = (user.sellery || []).filter(sell => sell.month === selectedMonth);

      const adminPayData = (user.adminPay || []).filter(pay => {
        const payDate = new Date(pay.date);
        return payDate.toLocaleString('default', { month: 'long' }) === selectedMonth && payDate.getFullYear() === selectedYear;
      });

      const employeePaymentData = employeePayment.filter(payment => {
        const paymentDate = new Date(payment.date);
        return (
          payment.employeeEmail === user.email &&
          paymentDate.toLocaleString('default', { month: 'long' }) === selectedMonth &&
          paymentDate.getFullYear() === selectedYear
        );
      });

      const totalSpent = monthlySpentData.reduce((acc, spent) => acc + spent.totalSpentt, 0);
      const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
      const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
      const totalAdminPay = adminPayData.reduce((acc, pay) => acc + pay.adminPayAmount, 0);

      // Calculate total pay amount for the selected month and year
      const totalPayAmount = employeePaymentData.reduce((acc, payment) => acc + parseFloat(payment.payAmount), 0);

      return {
        ...user,
        totalSpent,
        totalSellery,
        totalBonus,
        totalAdminPay,
        totalPayAmount,
      };
    });

    setEmployeeData(aggregatedData);
  }, [users, employeePayment, selectedMonth, selectedYear]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  // Calculate totals for footer
  const totalSpent = employeeData.reduce((acc, user) => acc + user.totalSpent, 0);
  const totalSellery = employeeData.reduce((acc, user) => acc + user.totalSellery, 0);
  const totalBonus = employeeData.reduce((acc, user) => acc + user.totalBonus, 0);
  const totalAdminPay = employeeData.reduce((acc, user) => acc + user.totalAdminPay, 0);
  const totalPayAmount = employeeData.reduce((acc, user) => acc + user.totalPayAmount, 0);
  const totalDue = totalSpent * 140 - totalAdminPay;

  return (
    <div className='m-5 text-black'>
      <Helmet>
        <title>Sellery | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className="mb-5 flex justify-end gap-5 items-center">
        <div>
          
          <select id="monthSelect" value={selectedMonth} onChange={handleMonthChange} className="p-2 bg-white text-black border border-gray-700 rounded">
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div>
        
          <select id="yearSelect" value={selectedYear} onChange={handleYearChange} className="p-2 bg-white text-black border border-gray-700 rounded">
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl text-center border-l border-gray-300">
        <table className="min-w-full text-center bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Name</th>
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
          <tbody className='text-black'>
            {employeeData.map((user, index) => (
              <tr key={user.email} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-200"} text-black border-b border-opacity-20`}>
                <td className="p-3 border-r-2 text-black border-gray-300 text-center px-5">{index + 1}</td>
                <td className="p-3 border-r-2 hover:text-blue-700 hover:font-bold border-gray-300 text-start px-5">
                  <Link to={`/dashboard/employeerSellery/${user.email}`}>{user.name}</Link>
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">${user.totalSpent.toFixed(2)}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">৳ {(user.totalSpent * 140).toFixed(2)}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">৳ {user.totalPayAmount.toFixed(2)}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">৳ {(user.totalSpent * 140 - user.totalAdminPay).toFixed(2)}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">৳ {(user.totalSpent * 7).toFixed(2)}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">৳ {user.totalSellery.toFixed(2)}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">৳ {(user.totalSpent * 7 - user.totalSellery).toFixed(2)}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">৳ {user.totalBonus.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#05a0db] font-bold text-white">
            <tr>
              <td className="p-3 text-right border-gray-300" colSpan="2">Total:</td>
              <td className="p-3 border-gray-300 text-center">${totalSpent.toFixed(2)}</td>
              <td className="p-3 border-gray-300 text-center">৳ {(totalSpent * 140).toFixed(2)}</td>
              <td className="p-3 border-gray-300 text-center">৳ {totalPayAmount.toFixed(2)}</td>
              <td className="p-3 border-gray-300 text-center">৳ {totalDue.toFixed(2)}</td>
              <td className="p-3 border-gray-300 text-center">৳ {(totalSpent * 7).toFixed(2)}</td>
              <td className="p-3 border-gray-300 text-center">৳ {totalSellery.toFixed(2)}</td>
              <td className="p-3 border-gray-300 text-center">৳ {(totalSpent * 7 - totalSellery).toFixed(2)}</td>
              <td className="p-3 border-gray-300 text-center">৳ {totalBonus.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Sellery;
