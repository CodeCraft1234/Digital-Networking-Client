import { useContext, useEffect, useState } from 'react';
import useUsers from '../../Hook/useUsers';  // Custom hook to fetch users
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Security/AuthProvider';

const MyHistory = () => {
  const [users, refetch] = useUsers(); // Fetch all users
  const { user } = useContext(AuthContext);

  const [ddd, setDdd] = useState(null);


  const initialTab = localStorage.getItem("activeTabadhistoryMont") || "All";
  const [sortMonth, setSortMonth] = useState(initialTab || new Date().getMonth() + 1)

  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTabadhistoryMont", tab); 
  };

  useEffect(() => {
    if (users && user) {
      const foundUser = users.find(u => u.email === user.email);
      setDdd(foundUser || {}); // Update state with found user or an empty object
    }
  }, [users, user]);

  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear().toString();

  // Set the default state for month and year
  const [sortEmployee, setSortEmployee] = useState(user?.email || ''); // Default to logged-in user's email
  const [sortYear, setSortYear] = useState(currentYear); // Default to current year

  // Flatten the monthlySpent data across all users
  const flattenedData = users.reduce((acc, user) => {
    if (user.monthlySpent) {
      const userSpentData = user.monthlySpent.map(spent => ({
        ...spent,
        employeeName: user.email, // Add employee email from user data
        employeeId: user._id, // Add employee ID for identification
      }));
      return [...acc, ...userSpentData];
    }
    return acc;
  }, []);

  // Filter data based on sort criteria (if applicable)
  const sortedAccounts = flattenedData
  .filter(account => {
    const matchEmployee = sortEmployee ? account.employeeName === sortEmployee : true;
    const matchMonth = sortMonth ? new Date(account.date).toLocaleString('default', { month: 'long' }) === sortMonth : true;
    const matchYear = sortYear ? new Date(account.date).getFullYear().toString() === sortYear : true;
    return matchEmployee && matchMonth && matchYear;
  })
  // Sort filtered data by accountName and date
  .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort in ascending order of date
  // Reduce to keep only the latest entry per accountName
  .reduce((acc, currentAccount) => {
    const existingAccount = acc.find(account => account.accountName === currentAccount.accountName);
    if (existingAccount) {
      // Replace the existing one if current account date is later
      if (new Date(currentAccount.date) > new Date(existingAccount.date)) {
        acc = acc.filter(account => account.accountName !== existingAccount.accountName); // Remove old entry
        acc.push(currentAccount); // Add new latest entry
      }
    } else {
      acc.push(currentAccount); // Add new account if it doesn't exist yet
    }
    return acc;
  }, [])
  // Sort by accountName in ascending order (A-Z)
  .sort((a, b) => a.accountName.localeCompare(b.accountName));


  const totalSpent = sortedAccounts.reduce((sum, account) => sum + account.totalSpentt, 0);
  const totalBill = totalSpent * 140; // Assuming conversion rate of 140






  return (
    <div className='mx-5 mt-5 lg:my-5 mb-5'>
      <div className="p-5 rounded-lg " style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} >
      <div className="flex justify-center lg:justify-start items-center gap-3 mb-5">
        <div>
          <select
            style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
            className="px-4 py-2 border rounded bg-white text-black border-black"
            onChange={(e) => changeTab(e.target.value)}
            value={sortMonth || ""}
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })).map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
            className="px-4 py-2 border rounded bg-white text-black border-black"
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

      <div  className="overflow-x-auto rounded-xl  text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
              <th className="p-3">SL</th>
              <th className="p-3">Payment Month</th>
            
              <th className="p-3">Ad Account Name</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Total Bill</th>
              {/* <th className="p-3">Action</th> */}
            </tr>
          </thead>
          <tbody>
          {sortedAccounts
  .sort((a, b) => a.accountName.localeCompare(b.accountName)) // Sort accounts by name (A to Z)
  .map((account, index) => (
    <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
    key={account._id}
    className={`${
      index % 2 === 0
        ? "bg-white text-left text-black border-b border-opacity-20"
        : "bg-gray-200  text-left text-black border-b border-opacity-20"
    }`}
  >
        {/* Index, starting from 1 */}
        <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center px-5">
          {index + 1}
        </td>

        {/* Displaying the month from account.date */}
        <td style={{  border: 'var(--border)'}} className="p-3 border-l-2 border-r-2 text-center border-gray-300">
          {new Date(account.date).toLocaleString('default', { month: 'long' })}
        </td>

        {/* Displaying the accountName */}
        <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-start px-5">
          {account.accountName}
        </td>

        {/* Displaying the total spent in USD with 2 decimal precision */}
        <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
          $ {account.totalSpentt.toFixed(2)}
        </td>

        {/* Converting and displaying the total spent in Bangladeshi Taka (৳) */}
        <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
          ৳ {(account.totalSpentt * 140).toFixed(2)}
        </td>
      </tr>
  ))}

          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}} className=''>
              <td colSpan="3" className="p-3  border-gray-300 text-center font-bold">
                Totals
              </td>
              <td className="p-3  border-gray-300 text-center font-bold">
                $ {totalSpent.toFixed(2)}
              </td>
              <td className="p-3 border-gray-300 text-center font-bold">
                ৳ {totalBill.toFixed(2)}
              </td>
              {/* <td className="p-3 border-r-2 border-gray-300"></td> */}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    </div>
  );
};

export default MyHistory;
