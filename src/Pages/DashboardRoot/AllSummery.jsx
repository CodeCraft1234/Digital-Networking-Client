import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../Security/AuthProvider';
import useUsers from '../../Hook/useUsers';
import useEmployeePayment from '../../Hook/useEmployeePayment';
import useMpayment from '../../Hook/UseMpayment';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const AllSummery = () => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [employeePayment] = useEmployeePayment();
  const [Mpayment] = useMpayment();

  const [employees, setEmployees] = useState([]);
  const initialTab = localStorage.getItem("activeTabsummeryEmployee") || "allEmployee";
  const [selectedEmployee, setSelectedEmployee] = useState(initialTab);

  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem("activeTabsummeryEmployee", tab); // Store the active tab in local storage
  };

  useEffect(() => {
    if (users && user) {
      const employeeList = users.filter((u) => u.role === "employee");
      setEmployees(employeeList);
    }
  }, [users, user]);

  const getRecentMonths = () => {
    const today = new Date();
    let monthsList = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthsList.push(month.toLocaleString('default', { month: 'long' }));
    }
    return monthsList.reverse();
  };

  const recentMonths = getRecentMonths();

  const employeeData = useMemo(() => {
    const relevantUsers = selectedEmployee !== "allEmployee"
      ? users.filter(u => u.role === 'employee' && u.email === selectedEmployee)
      : users.filter(u => u.role === 'employee');

    return relevantUsers.flatMap(user => {
      const employeePayments = employeePayment.filter(
        payment => selectedEmployee !== "allEmployee"
          ? payment.employeeEmail === selectedEmployee
          : payment.employeeEmail === user.email
      );

      const mPayments = Mpayment.filter(
        payment => selectedEmployee !== "allEmployee"
          ? payment.employeeEmail === selectedEmployee
          : payment.employeeEmail === user.email
      );

      const paymentByMonth = employeePayments.reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.payAmount);
        return acc;
      }, {});

      const paymentByMonth2 = mPayments.reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.amount);
        return acc;
      }, {});

      return recentMonths.map(month => {
        const monthlySpentData = (user.monthlySpent || []).filter(spent =>
          new Date(spent.date).toLocaleString('default', { month: 'long' }) === month
        );
        const selleryData = (user.sellery || []).filter(sell => sell.month === month);

        const totalSpent = monthlySpentData.reduce((acc, spent) => acc + spent.totalSpentt, 0);
        const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
        const totalAdminPay = paymentByMonth[month] || 0;
        const totalClientPay = paymentByMonth2[month] || 0;

        return {
          month,
          totalSpent,
          totalSellery,
          totalBonus,
          totalBill: totalSpent * 140,
          totalDue: totalSpent * 140 - totalAdminPay,
          totalSelleryPaid: totalSpent * 7 - totalSellery,
          totalAdminPay,
          totalClientPay 
        };
      }).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month)); // Sort by month
    });
  }, [users, selectedEmployee, employeePayment, Mpayment, recentMonths]);

  // Calculate totals for the footer
  const totalSpentSum = employeeData.reduce((acc, data) => acc + data.totalSpent, 0);
  const totalBillSum = employeeData.reduce((acc, data) => acc + data.totalBill, 0);
  const totalClientPaySum = employeeData.reduce((acc, data) => acc + data.totalClientPay, 0);
  const totalAdminPaySum = employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0);

  return (
    <div className='m-3 lg:m-5'>
      <Helmet>
        <title>Activity | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 text-black sm:grid-cols-2 gap-3 lg:gap-5 justify-around ">
        <div className="px-5 py-10 rounded-2xl  bg-[#91a33a] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm font-bold">Total Spent</h2>
          <p className="lg:text-2xl text-xm font-bold mt-2"> $ {totalSpentSum.toFixed(2)}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm  font-bold">Total BDT</h2>
          <p className="lg:text-2xl text-xm font-bold mt-2">
             <span className="lg:text-2xl text-xmfont-extrabold">৳</span> {totalBillSum.toFixed(2)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm font-bold">Client Pay</h2>
          <p className="lg:text-2xl text-xm font-bold mt-2"> <span className="lg:text-2xl text-xm font-extrabold">৳</span>{totalClientPaySum.toFixed(2)} </p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#ce1a38] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm font-bold">Employee Pay</h2>
          <p className="lg:text-2xl text-xm font-bold mt-2">
          <span className="lg:text-2xl text-xm font-extrabold">৳</span> {totalAdminPaySum.toFixed(2)}
          </p>
        </div>
        <div className="px-5 py-10 rounded-2xl  bg-[#ce1a38] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm font-bold">Employee Due</h2>
          <p className="lg:text-2xl text-xm font-bold mt-2">
          <span className="lg:text-2xl text-xm font-extrabold">৳</span> {(totalClientPaySum - totalAdminPaySum).toFixed(2)}
          </p>
        </div>
        <div className="px-5 py-10 rounded-2xl  bg-[#ce1a38] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm font-bold">Client Due</h2>
          <p className="lg:text-2xl text-xm font-bold mt-2">
          <span className="lg:text-2xl text-xm font-extrabold">৳</span> {(totalBillSum - totalClientPaySum).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex mt-3 lg:mt-5 ml-1 lg:justify-end justify-center ">
        <select
          className="border bg-white text-black lg:w-56 w-full border-gray-400 rounded p-2 mt-1"
          value={selectedEmployee}
          onChange={(e) => changeTab(e.target.value)}
        >
          <option value="allEmployee">All Employees</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto text-black text-center mt-3 lg:mt-5 rounded-xl border border-gray-600">
  <table className="min-w-full text-center bg-white">
    <thead className="bg-[#05a0db] text-white">
      <tr>
        <th className="p-3">SL</th>
        <th className="p-3">Month</th>
        <th className="p-3">Total Spent</th>
        <th className="p-3">Total BDT</th>
        <th className="p-3">Client Pay</th>
        <th className="p-3">Employee Pay</th>
        <th className="p-3">Employee Due</th>
        <th className="p-3">Client Due</th>
      </tr>
    </thead>
    <tbody>
  {employeeData.map((data, index) => (
    <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
      <td className="p-3 border">{index + 1}</td>
      <td className="p-3 border">{data.month}</td>
      <td className="p-3 border">{data.totalSpent.toFixed(2)}</td>
      <td className="p-3 border">{data.totalBill.toFixed(2)}</td>
      <td className="p-3 border">{data.totalClientPay.toFixed(2)}</td>
      <td className="p-3 border">{data.totalAdminPay.toFixed(2)}</td>
      <td className="p-3 border">{(data.totalClientPay - data.totalAdminPay).toFixed(2)}</td>
      <td className="p-3 border">{(data.totalBill - data.totalClientPay).toFixed(2)}</td>
    </tr>
  ))}
</tbody>

    <tfoot>
      <tr className="bg-[#05a0db] text-white">
      <td className="p-3 text-right" colSpan="2">
                Total :
              </td>
        
        <td className="p-3  font-semibold">
          {employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)}
        </td>
        <td className="p-3  font-semibold">
          {employeeData.reduce((acc, data) => acc + data.totalBill, 0).toFixed(2)}
        </td>
        <td className="p-3  font-semibold">
          {employeeData.reduce((acc, data) => acc + data.totalClientPay, 0).toFixed(2)}
        </td>
        <td className="p-3  font-semibold">
          {employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(2)}
        </td>
        <td className="p-3  font-semibold">
          {(employeeData.reduce((acc, data) => acc + data.totalClientPay - data.totalAdminPay, 0)).toFixed(2)}
        </td>
        <td className="p-3 font-semibold">
          {(employeeData.reduce((acc, data) => acc + data.totalBill - data.totalClientPay, 0)).toFixed(2)}
        </td>
      </tr>
    
    </tfoot>
  </table>
</div>

    </div>
  );
};

export default AllSummery;
