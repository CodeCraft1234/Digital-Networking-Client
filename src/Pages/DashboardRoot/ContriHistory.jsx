import  { useContext, useState,  } from 'react';
import useUsers from '../../Hook/useUsers';  // Custom hook to fetch users
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Security/AuthProvider';

const ContriHistory = () => {
  const [users,refetch] = useUsers(); 
  const {user}=useContext(AuthContext)
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear().toString();
  const [sortYear, setSortYear] = useState(currentYear);


  const initialTab = localStorage.getItem("activeTaballhistory") ;
  const [sortEmployee, setSortEmployee] = useState(initialTab);
  

  const initialTab2 = localStorage.getItem("activeTaballhistoryMonth") ;
  const [sortMonth, setSortMonth] = useState(initialTab2 || currentMonth);
  
  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballhistoryMonth", tab); 
  };

  
  const flattenedData = users.filter(u=>u.role === 'contributor')?.filter(u=>u?.email === user?.email).reduce((acc, user) => {
    if (user.monthlySpent) {
      const userSpentData = user.monthlySpent.map(spent => ({
        ...spent,
        employeeName: user.name, 
        employeeEmail: user.email, 
        employeeId: user._id, 
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
    });







  return (
    <div className=' m-5'>

      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className=" rounded-lg p-5 ">

      <div className="lg:flex lg:justify-start items-center gap-3 mb-5">
      
        <div className='flex justify-center mt-5 lg:mt-0 gap-5 items-center'>
        <div>
         <select
          style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
            className=" px-4 py-2 border rounded bg-white text-black border-black"
            onChange={(e) => changeTab2(e.target.value)}
            value={sortMonth || ""}
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })).map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          </div>
         
        </div>
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

      <div  className="overflow-x-auto rounded-xl  text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
              <th style={{  border: 'var(--border)'}} className="p-3">SL</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Employee Name</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Month</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Ad Account Name</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Total Spent</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Total Bill</th>
             
            </tr>
          </thead>
          <tbody>
            {sortedAccounts.map((account, index) => (
              <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
              key={account._id}
              className={`${
                index % 2 === 0
                  ? "bg-white text-left text-black border-b border-opacity-20"
                  : "bg-gray-200  text-left text-black border-b border-opacity-20"
              }`}
            >
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center px-5">{index + 1}</td>

                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 font-semibold hover:text-blue-700 hover:font-bold border-gray-300 text-start px-5">
  <Link to={`/dashboard/userInfo/${account?.employeeEmail}`} className="flex items-center">
    {
      // Find the user based on their email
      users?.find(u => u.email === account.employeeEmail)?.photo && (
        <img 
          className='h-10 w-10 rounded-full mr-3' 
          src={users.find(u => u.email === account.employeeEmail).photo} 
          alt={`${account.employeeName}'s profile`} 
        />
      )
    }
    <span>{account.employeeName}</span>
  </Link>
</td>


                <td style={{  border: 'var(--border)'}} className="p-3 border-l-2 border-r-2 text-center border-gray-300">
                  {new Date(account.date).toLocaleString('default', { month: 'long'})}
                </td>
              
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-start px-5">
                  {account.accountName}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
  $ {account.totalSpentt.toFixed(2)}
</td>
<td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
  ৳ {(account.totalSpentt * parseInt(account?.dollerRate)).toFixed(2)}
</td>

              </tr>
            ))}
          </tbody>

          <tfoot className="  text-white">

  <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
    <td style={{  border: 'var(--border)'}} colSpan="4" className="p-3 font-bold text-right">Total</td>
    <td style={{  border: 'var(--border)'}} className="p-3 font-bold text-center">
      $ {sortedAccounts.reduce((sum, acc) => sum + acc.totalSpentt, 0).toFixed(2)}
    </td>
    <td style={{  border: 'var(--border)'}} className="p-3 font-bold text-center">
      ৳ {(sortedAccounts.reduce((sum, acc) => sum + acc.totalSpentt, 0) * 140).toFixed(2)}
    </td>
  
  </tr>

</tfoot>

        </table>
      </div>
      </div>

    </div>
  );
};

export default ContriHistory;