import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useMonthlySpent from "../../Hook/useMonthlySpent";
import useEmployeePayment from '../../Hook/useEmployeePayment';
import { Link } from 'react-router-dom';
import useSellery from '../../Hook/useSellery';

const Sellery = () => {
  const [monthlySpent] = useMonthlySpent();
  const [employeePayment] = useEmployeePayment();
  const [sellery] = useSellery();

  const [sortMonth, setSortMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [sortByEmployeeName, setSortByEmployeeName] = useState("");

  const [aggregatedAccounts, setAggregatedAccounts] = useState([]);

  // Aggregating data only once during initial render or when data changes
  useEffect(() => {
    const aggregateAccounts = () => {
      const aggregated = {};

      monthlySpent.forEach(account => {
        const date = new Date(account.date);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const key = `${account.employeeName}-${month}-${year}`;

        if (!aggregated[key]) {
          aggregated[key] = {
            employeeName: account.employeeName,
            totalSpentt: 0,
            month,
            year,
            employeeEmail: account.employeeEmail,
          };
        }
        aggregated[key].totalSpentt += account.totalSpentt;
      });

      setAggregatedAccounts(Object.values(aggregated));
    };

    aggregateAccounts();
  }, [monthlySpent]);

  const calculateAdminPay = useCallback((email, month) => {
    const payments = employeePayment.filter(payment => {
      const paymentDate = new Date(payment.date);
      const paymentMonth = paymentDate.toLocaleString('default', { month: 'long' });
      return paymentMonth === month && payment.employeeEmail === email;
    });

    return payments.reduce((acc, payment) => acc + (parseFloat(payment.payAmount) || 0), 0);
  }, [employeePayment]);

  const calculateSelleryAmount = useCallback((email, month) => {
    const payments = sellery.filter(payment => {
      const paymentDate = new Date(payment.date);
      const paymentMonth = paymentDate.toLocaleString('default', { month: 'long' });
      return paymentMonth === month && payment.email === email;
    });

    return payments.reduce((acc, payment) => acc + (parseFloat(payment.amount) || 0), 0);
  }, [sellery]);

  const calculateBonusAmount = useCallback((email, month) => {
    const payments = sellery.filter(payment => {
      const paymentDate = new Date(payment.date);
      const paymentMonth = paymentDate.toLocaleString('default', { month: 'long' });
      return paymentMonth === month && payment.email === email;
    });

    return payments.reduce((acc, payment) => acc + (parseFloat(payment.bonus) || 0), 0);
  }, [sellery]);

  const sortedAccounts = useMemo(() => {
    return aggregatedAccounts.filter(account =>
      account.month === sortMonth &&
      (sortByEmployeeName === "" || account.employeeName === sortByEmployeeName)
    );
  }, [aggregatedAccounts, sortMonth, sortByEmployeeName]);

  const totalSpentSum = useMemo(() => {
    return sortedAccounts.reduce((acc, account) => acc + (parseFloat(account.totalSpentt) || 0), 0);
  }, [sortedAccounts]);

  const totalBillSum = useMemo(() => totalSpentSum * 140, [totalSpentSum]);

  const totalAdminPay = useMemo(() => {
    return sortedAccounts.reduce((acc, account) => acc + calculateAdminPay(account.employeeEmail, sortMonth), 0);
  }, [sortedAccounts, calculateAdminPay, sortMonth]);

  const totalDue = useMemo(() => totalBillSum - totalAdminPay, [totalBillSum, totalAdminPay]);

  const totalSalary = useMemo(() => totalSpentSum * 7, [totalSpentSum]);

  const salaryPaid = useMemo(() => {
    return sortedAccounts.reduce((acc, account) => acc + calculateSelleryAmount(account.employeeEmail, sortMonth), 0);
  }, [sortedAccounts, calculateSelleryAmount, sortMonth]);

  const salaryUnpaid = useMemo(() => totalSalary - salaryPaid, [totalSalary, salaryPaid]);

  const bonus = useMemo(() => {
    return sortedAccounts.reduce((acc, account) => acc + calculateBonusAmount(account.employeeEmail, sortMonth), 0);
  }, [sortedAccounts, calculateBonusAmount, sortMonth]);

  return (
    <div className='m-5'>
      <div className="flex justify-between mb-4">
        <select
          className="px-4 py-2 border rounded bg-white text-black border-gray-700"
          onChange={(e) => setSortByEmployeeName(e.target.value)}
          value={sortByEmployeeName}
        >
          <option value="">Select Employee</option>
          {[...new Set(aggregatedAccounts.map(account => account.employeeName))].map(employeeName => (
            <option key={employeeName} value={employeeName}>{employeeName}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 border rounded bg-white text-black border-gray-700"
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
                  {account.month} {account.years}
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
            <tr className="bg-[#05a0db] text-white text-center">
              <td className="p-3 font-semibold text-lg" colSpan="3">
                Total:
              </td>
              <td className="p-3 font-semibold text-lg">
                $ {totalSpentSum.toFixed(2)}
              </td>
              <td className="p-3 font-semibold text-lg">
                $ {totalBillSum.toFixed(2)}
              </td>
              <td className="p-3 font-semibold text-lg">
                $ {totalAdminPay.toFixed(2)}
              </td>
              <td className="p-3 font-semibold text-lg">
                $ {totalDue.toFixed(2)}
              </td>
              <td className="p-3 font-semibold text-lg">
                $ {totalSalary.toFixed(2)}
              </td>
              <td className="p-3 font-semibold text-lg">
                $ {salaryPaid.toFixed(2)}
              </td>
              <td className="p-3 font-semibold text-lg">
                $ {salaryUnpaid.toFixed(2)}
              </td>
              <td className="p-3 font-semibold text-lg">
                $ {bonus.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Sellery;
