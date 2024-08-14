import React, { useState, useEffect } from 'react';
import useMonthlySpent from "../../Hook/useMonthlySpent";
import useEmployeePayment from '../../Hook/useEmployeePayment';
import { Link } from 'react-router-dom';
import useSellery from '../../Hook/useSellery';

const Sellery = () => {
  const [monthlySpent] = useMonthlySpent();
  const [employeePayment] = useEmployeePayment();
  const [sellery, refetch] = useSellery();
  
  const [sortMonth, setSortMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [sortByEmployeeName, setSortByEmployeeName] = useState(null);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // Function to aggregate totalSpent by employee names and months
  const aggregateAccountsByEmployee = (data) => {
    const aggregated = {};

    data.forEach(account => {
      const date = new Date(account.date);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const key = `${account.employeeName}-${month}-${year}`;

      if (!aggregated[key]) {
        aggregated[key] = { 
          employeeName: account.employeeName,
          accountName: account.accountName,
          totalSpentt: 0, 
          month, 
          year,
          employeeEmail: account.employeeEmail // Add employeeEmail to key
        };
      }
      aggregated[key].totalSpentt += account.totalSpentt;
    });

    return Object.values(aggregated);
  };

  // Function to calculate total payment for the given month and employee
  const calculateTotalPayment = (month, employeeName) => {
    const currentYear = new Date().getFullYear();
    let total = 0;

    employeePayment.forEach(payment => {
      const paymentDate = new Date(payment.date);
      const paymentMonth = paymentDate.toLocaleString('default', { month: 'long' });
      const paymentYear = paymentDate.getFullYear();
      
      if (paymentMonth === month && paymentYear === currentYear) {
        if (!employeeName || payment.employeeName === employeeName) {
          total += parseFloat(payment.payAmount) || 0;
        }
      }
    });

    return total;
  };

  // Function to calculate total spent for the given month and employee
  const calculateTotalSpent = (month, employeeName) => {
    let total = 0;

    monthlySpent.forEach(spent => {
      const spentDate = new Date(spent.date);
      const spentMonth = spentDate.toLocaleString('default', { month: 'long' });
      
      if (spentMonth === month) {
        if (!employeeName || spent.employeeName === employeeName) {
          total += spent.totalSpentt || 0;
        }
      }
    });

    return total;
  };

  // Function to calculate Admin Pay
  const calculateAdminPay = (email, month) => {
    const payments = employeePayment.filter(payment => {
      const paymentDate = new Date(payment.date);
      const paymentMonth = paymentDate.toLocaleString('default', { month: 'long' });
      return paymentMonth === month && payment.employeeEmail === email;
    });

    return payments.reduce((acc, payment) => acc + (parseFloat(payment.payAmount) || 0), 0);
  };

  const calculateSelleryAmount = (email, month) => {
    const payments = sellery.filter(payment => {
      const paymentDate = new Date(payment.date);
      const paymentMonth = paymentDate.toLocaleString('default', { month: 'long' });
      return paymentMonth === month && payment.email === email;
    });
  
    return payments.reduce((acc, payment) => acc + (parseFloat(payment.amount) || 0), 0);
  };

  const calculateBonusAmount = (email, month) => {
    const payments = sellery.filter(payment => {
      const paymentDate = new Date(payment.date);
      const paymentMonth = paymentDate.toLocaleString('default', { month: 'long' });
      return paymentMonth === month && payment.email === email;
    });
  
    return payments.reduce((acc, payment) => acc + (parseFloat(payment.bonus) || 0), 0);
  };

  // Filter and aggregate data
  const aggregatedAccounts = aggregateAccountsByEmployee(monthlySpent);
  const sortedAccounts = aggregatedAccounts.filter(account => account.month === sortMonth);
  const currentTotalPayment = calculateTotalPayment(sortMonth, sortByEmployeeName);
  const currentTotalSpent = calculateTotalSpent(sortMonth, sortByEmployeeName);

  // Calculate totals for the footer
  const totalSpentSum = sortedAccounts.reduce((acc, account) => acc + (parseFloat(account.totalSpentt) || 0), 0);
  const totalBillSum = totalSpentSum * 140;
  const totalAdminPay = sortedAccounts.reduce((acc, account) => acc + calculateAdminPay(account.employeeEmail, sortMonth), 0);
  const totalDue = totalBillSum - totalAdminPay;
  const totalSalary = totalSpentSum * 7;
  const salaryPaid = sortedAccounts.reduce((acc, account) => acc + calculateSelleryAmount(account.employeeEmail, sortMonth), 0);
  const salaryUnpaid = totalSalary - salaryPaid;
  const bonus = sortedAccounts.reduce((acc, account) => acc + calculateBonusAmount(account.employeeEmail, sortMonth), 0);

  useEffect(() => {
    setTotalPayment(currentTotalPayment);
    setTotalSpent(currentTotalSpent);
  }, [sortMonth, sortByEmployeeName, employeePayment, monthlySpent]);

  return (
    <div className='m-5'>
      <div className="flex justify-between mb-4">
        <select
          className="px-4 py-2 border rounded bg-white text-black border-gray-700 "
          onChange={(e) => setSortByEmployeeName(e.target.value)}
          value={sortByEmployeeName || ""}
        >
          <option value="">Select Employee</option>
          {[...new Set(aggregatedAccounts.map(account => account.employeeName))].map(employeeName => (
            <option key={employeeName} value={employeeName}>{employeeName}</option>
          ))}
        </select>
        <select
          className=" px-4 py-2 border rounded bg-white text-black border-gray-700"
          onChange={(e) => setSortMonth(e.target.value)}
          value={sortMonth || ""}
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })).map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto text-center border border-black">
        <table className="min-w-full text-center bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Months</th>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Total Bill</th>
              <th className="p-3">Admin Pay</th>
              <th className="p-3">Total Due</th>
              <th className="p-3">Total Salary</th>
              <th className="p-3">Salary Paid</th>
              <th className="p-3">Salary Unpaid</th>
              <th className="p-3">Bonus</th>
            </tr>
          </thead>
          <tbody>
            {sortedAccounts.map((account, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-gray-500 border-b border-opacity-20"
                    : "bg-gray-200 text-left text-gray-500 border-b border-opacity-20"
                }`}
              >
                <td className="p-3 border-r-2 border-gray-300 text-center px-5">{index + 1}</td>
                <td className="p-3 border-l-2 border-r-2 text-center border-gray-300">
                  {account.month}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center px-5">
                  <Link to={`/dashboard/employeerSellery/${account.employeeEmail}`} >
                  {account?.employeeName}
                  </Link>
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  $ {account.totalSpentt}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  $ {(account.totalSpentt * 140).toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  $ {calculateAdminPay(account.employeeEmail, sortMonth).toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  $ {(account.totalSpentt * 140 - calculateAdminPay(account.employeeEmail, sortMonth)).toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  $ {(account.totalSpentt * 7).toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  $ {calculateSelleryAmount(account.employeeEmail, sortMonth).toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  $ {(account.totalSpentt * 7 - calculateSelleryAmount(account.employeeEmail, sortMonth)).toFixed(2)}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  $ {calculateBonusAmount(account.employeeEmail, sortMonth).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#05a0db] text-white font-bold">
              <td className="p-3" colSpan="3">Total</td>
              <td className="p-3">${totalSpentSum.toFixed(2)}</td>
              <td className="p-3">৳{totalBillSum.toFixed(2)}</td>
              <td className="p-3">৳{totalAdminPay.toFixed(2)}</td>
              <td className="p-3">৳{totalDue.toFixed(2)}</td>
              <td className="p-3">৳{totalSalary.toFixed(2)}</td>
              <td className="p-3">৳{salaryPaid.toFixed(2)}</td>
              <td className="p-3">৳{salaryUnpaid.toFixed(2)}</td>
              <td className="p-3">৳{bonus.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Sellery;
