import React, { useState, useEffect } from 'react';
import usemonthlySpent from "../../Hook/useMonthlySpent";

const MyHistory = () => {
  const [monthlySpent] = usemonthlySpent();
  const [sortMonth, setSortMonth] = useState('');
  const [sortYear, setSortYear] = useState('');
  const [sortEmployee, setSortEmployee] = useState(null); // State for sorting by employee name

  // Get current month and year
  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();

  // Function to aggregate totalSpent by account names, months, and years
  const aggregateAccountsByMonth = (data) => {
    const aggregated = {};

    data.forEach(account => {
      const date = new Date(account.date);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const key = `${account.accountName}-${month}-${year}`;

      if (!aggregated[key]) {
        aggregated[key] = { ...account, totalSpentt: 0, month, year };
      }
      aggregated[key].totalSpentt += account.totalSpentt;
    });

    return Object.values(aggregated);
  };

  const aggregatedAccounts = aggregateAccountsByMonth(monthlySpent);

  // Sorting function
  const sortAccounts = (accounts, month, year, employee) => {
    return accounts.filter(account => {
      const matchesMonth = month ? account.month === month : true;
      const matchesYear = year ? account.year === parseInt(year) : true;
      const matchesEmployee = employee ? account.employeeName === employee : true;
      return matchesMonth && matchesYear && matchesEmployee;
    });
  };

  const sortedAccounts = sortAccounts(aggregatedAccounts, sortMonth, sortYear, sortEmployee);

  // Set default sort values to current month and year when component mounts
  useEffect(() => {
    setSortMonth(currentMonth);
    setSortYear(currentYear);
  }, [currentMonth, currentYear]);

  // Get a unique list of employee names for the dropdown
  const employeeNames = [...new Set(aggregatedAccounts.map(account => account.employeeName))];

  return (
    <div className='m-5'>
      
      <div className="flex justify-between mb-4">
        <div>
        <select
          className="px-4 py-2 border rounded bg-white  text-black border-black"
          onChange={(e) => setSortEmployee(e.target.value)}
          value={sortEmployee || ""}
        >
          <option value="">Select Employee</option>
          {employeeNames.map(employee => (
            <option key={employee} value={employee}>{employee}</option>
          ))}
        </select>
        </div>
        <div>
        <select
          className="mr-4 px-4 py-2 border rounded bg-white  text-black border-black"
          onChange={(e) => setSortMonth(e.target.value)}
          value={sortMonth || ""}
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })).map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <select
          className=" px-4 py-2 border rounded bg-white  text-black border-black"
          onChange={(e) => setSortYear(e.target.value)}
          value={sortYear || ""}
        >
          <option value="">Select Year</option>
          {Array.from({ length: 31 }, (_, i) => 2020 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        </div>


       
      </div>

      <div className="overflow-x-auto text-center border border-black">
        <table className="min-w-full text-center bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Ad Account Name</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Total Bill</th>
              <th className="p-3">Payment Month</th>
            </tr>
          </thead>
          <tbody>
            {sortedAccounts.map((account, index) => (
              <tr
                key={account._id}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-gray-500 border-b border-opacity-20"
                    : "bg-gray-200 text-left text-gray-500 border-b border-opacity-20"
                }`}
              >
                <td className="p-3 border-r-2 border-gray-300 text-center px-5">{index + 1}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center px-5">
                  {account.employeeName}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-start px-5">
                  {account.accountName}
                </td>
               
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  $ {account.totalSpentt}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  ৳  {account.totalSpentt * 140}
                </td>
                <td className="p-3 border-l-2 border-r-2 text-center border-gray-300">
                  {account.month} {account.year}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyHistory;
