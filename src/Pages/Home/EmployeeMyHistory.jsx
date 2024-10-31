import { useEffect, useState } from 'react';
import useUsers from '../../Hook/useUsers';  
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const EmployeeMyHistory = ({email}) => {
  const [users, refetch] = useUsers(); // Fetch all users
  const [ddd, setDdd] = useState(null);

  const initialTab = localStorage.getItem("activeTabadhistoryMont") || "All";
  const [sortMonth, setSortMonth] = useState(initialTab || new Date().getMonth() + 1)

  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTabadhistoryMont", tab); 
  };

  useEffect(() => {
      const foundUser = users.find(u => u.email === email);
      setDdd(foundUser || {}); // Update state with found user or an empty object
  }, [users, email]);

  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear().toString();

  // Set the default state for month and year
  const [sortEmployee, setSortEmployee] = useState(email || ''); // Default to logged-in user's email
  const [sortYear, setSortYear] = useState(currentYear); // Default to current year

  // Flatten the monthlySpent data across all users
  const flattenedData = users.reduce((acc, user) => {
    if (user.monthlySpent) {
      const userSpentData = user.monthlySpent.map(spent => ({
        ...spent,
        employeeName: user.email, // Add employee email from user data
        employeeId: ddd?._id, // Add employee ID for identification
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

console.log(sortedAccounts);

  // Calculate totals
  const totalSpent = sortedAccounts.reduce((sum, account) => sum + account.totalSpentt, 0);
  const totalBill = totalSpent * 140; // Assuming conversion rate of 140

  const AxiosPublic = UseAxiosPublic();

  // Handle update function
  const handleUpdate2 = async (e, userId, spentId) => {
    e.preventDefault();
    const totalSpent = e.target.totalSpentt.value; 
    const totalSpentt = parseFloat(totalSpent);
    
    try {
      const response = await AxiosPublic.put(`/updateSpent/${userId}/${spentId}`, {
        totalSpentt,
      });
  
      if (response.status === 200) {
        toast.success('Total spent updated successfully');
        refetch(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating total spent:', error);
      toast.error('Failed to update total spent');
    }
  };

  const handleDelete = (e, userId, spentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/users/historyDelete/${userId}/${spentId}`).then((res) => {
          refetch();
          console.log(res.data);
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your history has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className='mx-5 mt-5 py-5 rounded-lg lg:my-5 mb-5'>
      <div  className="flex justify-center lg:justify-start pl-5 items-center gap-3 ">
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

      <div className='px-5  pt-5    rounded-lg' >
      <div  className="overflow-x-auto rounded-xl  text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
              <th style={{  border: 'var(--border)'}} className="p-3">SL</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Payment Month</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Ad Account Name</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Total Spent</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Total Bill</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Action</th>
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
                  ৳ {(account.totalSpentt * 140).toFixed(2)}
                </td>

                <td style={{  border: 'var(--border)'}} className="p-3 border-r text-center border-gray-400">
                  <div className="flex justify-center items-center gap-3">
                    <div>
                      <button
                        className="bg-green-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                        onClick={() =>
                          document.getElementById(`modal_${index}`).showModal()
                        }
                      >
                        Edit
                      </button>
                      <dialog id={`modal_${index}`} className="modal">
                        <div className="modal-box bg-white text-black">
                          <form onSubmit={(e) => handleUpdate2(e, account.employeeId, account.ids)}>
                            <div className="mb-4">
                              <label className="block text-start text-gray-700">Total Spent</label>
                              <input
                                type="text"
                                name="totalSpentt"
                                defaultValue={account.totalSpentt}
                                className="w-full bg-white border-black border rounded p-2 mt-1"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() =>
                                  document.getElementById(`modal_${index}`).close()
                                }
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                type="button"
                              >
                                Close
                              </button>
                              <button
                                type="submit"
                                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                              >
                                Update
                              </button>
                            </div>
                          </form>
                        </div>
                      </dialog>
                    </div>
                    <button
                      className="bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded"
                      onClick={(e) => handleDelete(e, account.employeeId, account.ids)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className=''>
              <td style={{  border: 'var(--border)'}} colSpan="3" className="p-3  border-gray-300 text-center font-bold">
                Totals
              </td>
              <td style={{  border: 'var(--border)'}} className="p-3  border-gray-300 text-center font-bold">
                $ {totalSpent.toFixed(2)}
              </td>
              <td style={{  border: 'var(--border)'}} className="p-3 border-gray-300 text-center font-bold">
                ৳ {totalBill.toFixed(2)}
              </td>
              <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300"></td>
            </tr>
          </tfoot>
        </table>
      </div>
      </div>
    </div>
  );
};

export default EmployeeMyHistory;
