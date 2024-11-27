import { useContext, useState } from 'react';
import useUsers from '../../Hook/useUsers';  // Custom hook to fetch users
import { AuthContext } from '../../Security/AuthProvider';

const MyHistory = () => {
  const [users] = useUsers(); 
  const { user } = useContext(AuthContext);
  const initialTab = localStorage.getItem("activeTabadhistoryMont") || "All";
  const [sortMonth, setSortMonth] = useState(initialTab || new Date().getMonth() + 1)

  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTabadhistoryMont", tab); 
  };


  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();

  const [sortEmployee, setSortEmployee] = useState(user?.email || ''); 
  const [sortYear, setSortYear] = useState(currentYear); 

  const flattenedData = users.reduce((acc, user) => {
    if (user.monthlySpent) {
      const userSpentData = user.monthlySpent.map(spent => ({
        ...spent,
        employeeName: user.email, 
        employeeId: user._id, 
      }));
      return [...acc, ...userSpentData];
    }
    return acc;
  }, []);

  const sortedAccounts = flattenedData
  .filter(account => {
    const matchEmployee = sortEmployee ? account.employeeName === sortEmployee : true;
    const matchMonth = sortMonth ? new Date(account.date).toLocaleString('default', { month: 'long' }) === sortMonth : true;
    const matchYear = sortYear ? new Date(account.date).getFullYear().toString() === sortYear : true;
    return matchEmployee && matchMonth && matchYear;
  })

  .sort((a, b) => new Date(a.date) - new Date(b.date)) 

  .reduce((acc, currentAccount) => {
    const existingAccount = acc.find(account => account.accountName === currentAccount.accountName);
    if (existingAccount) {
      if (new Date(currentAccount.date) > new Date(existingAccount.date)) {
        acc = acc.filter(account => account.accountName !== existingAccount.accountName); 
        acc.push(currentAccount); 
      }
    } else {
      acc.push(currentAccount); 
    }
    return acc;
  }, [])

  .sort((a, b) => a.accountName.localeCompare(b.accountName));


  const totalSpent = sortedAccounts.reduce((sum, account) => sum + account.totalSpentt, 0);
  const totalBill = totalSpent * 140; 

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
           
              <th className="p-3 text-left">Ad Account Name</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Total Bill</th>
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
       

        <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-start px-5">
          {account.accountName}
        </td>

        <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
          $ {account.totalSpentt.toFixed(2)}
        </td>

        <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
          ৳ {(account.totalSpentt * 140).toFixed(2)}
        </td>
      </tr>
  ))}

          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}} className=''>
              <td colSpan="1" className="p-3  border-gray-300 text-right font-bold">
                Total:
              </td>
              <td className="p-3  border-gray-300 text-center font-bold">
                $ {totalSpent.toFixed(2)}
              </td>
              <td className="p-3 border-gray-300 text-center font-bold">
                ৳ {totalBill.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    </div>
  );
};

export default MyHistory;
