import  { useState,  } from 'react';
import useUsers from '../../Hook/useUsers';  // Custom hook to fetch users

import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const History = () => {
  const [users,refetch] = useUsers(); // Fetch all users

  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear().toString();

  // Set the default state for month and year
  const [sortMonth, setSortMonth] = useState(currentMonth); // Default to current month
  const [sortYear, setSortYear] = useState(currentYear); // Default to current year



  const initialTab = localStorage.getItem("activeTaballhistory") ;
  const [sortEmployee, setSortEmployee] = useState(initialTab);
  

  const changeTab = (tab) => {
    setSortEmployee(tab);
    localStorage.setItem("activeTaballhistory", tab); 
  };


  // Flatten the monthlySpent data across all users
  const flattenedData = users.reduce((acc, user) => {
    if (user.monthlySpent) {
      const userSpentData = user.monthlySpent.map(spent => ({
        ...spent,
        employeeName: user.name, // Add employee name from user data
        employeeEmail: user.email, // Add employee name from user data
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
    });

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
        alert('Total spent updated successfully');
        window.location.reload(); // Optionally reload the page to fetch updated data
      }
    } catch (error) {
      console.error('Error updating total spent:', error);
      alert('Failed to update total spent');
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
              text: "Your histroy has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  return (
    <div className='mx-5 my-5'>
      <div className="flex justify-end items-center gap-3 mb-5">
        <div>
        <div>
        
         </div>
          <select
            className="px-4 py-2 border rounded bg-white text-black border-black"
            onChange={(e) => changeTab(e.target.value)}
            value={sortEmployee || ""}
          >
            <option value="">Select Employee</option>
            {users.map(user => (
              user.role === 'employee' && (
                <option key={user._id} value={user.name}>{user.name}</option>
              )
            ))}
          </select>
        </div>
        <div className='flex justify-end items-center gap-3'>
         <div>
         <div>
          <div>
        
         </div>
         <select
            className=" px-4 py-2 border rounded bg-white text-black border-black"
            onChange={(e) => setSortMonth(e.target.value)}
            value={sortMonth || ""}
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })).map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          </div>
         </div>
         
            <div >
            <div>
    
         </div>
         <div>
         <select
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
       
        </div>
      </div>

      <div className="overflow-x-auto text-center rounded-xl border-l border-gray-400">
        <table className="min-w-full text-center bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Month</th>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Ad Account Name</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Total Bill</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedAccounts.map((account, index) => (
              <tr
                key={account.ids} // Use `ids` as the key
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-black border-b border-opacity-20"
                    : "bg-gray-200 text-left text-black border-b border-opacity-20"
                }`}
              >
                <td className="p-3 border-r-2 border-gray-300 text-center px-5">{index + 1}</td>
                <td className="p-3 border-l-2 border-r-2 text-center border-gray-300">
                  {new Date(account.date).toLocaleString('default', { month: 'long'})}
                </td>
                <td className="p-3 border-r-2 hover:text-blue-700 hover:font-bold border-gray-300 text-start px-5">
                <Link to={`/dashboard/userInfo/${account?.employeeEmail}`}>
                {account.employeeName}
                </Link>
                
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-start px-5">
                  {account.accountName}
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
  $ {account.totalSpentt.toFixed(2)}
</td>
<td className="p-3 border-r-2 border-gray-300 text-center">
  ৳ {(account.totalSpentt * 140).toFixed(2)}
</td>

                <td className="p-3 border-r text-center border-gray-400">
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
                                type="button"
                                className="font-avenir px-3 py-1 bg-red-600 rounded-lg text-white"
                              >
                                Close
                              </button>
                              <button
                                type="submit"
                                className="font-avenir px-3 py-1 bg-[#05a0db] rounded-lg text-white"
                              >
                                Update
                              </button>
                            </div>
                          </form>
                        </div>
                      </dialog>
                    </div>
                    <button
                      className="bg-red-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                      onClick={(e) => handleDelete(e, account.employeeId, account.ids)} // Ensure correct ID for deletion
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot className="bg-[#05a0db] border-t border-gray-700 text-white">
  <tr>
    <td colSpan="4" className="p-3 font-bold text-right">Total</td>
    <td className="p-3 font-bold text-center">
      $ {sortedAccounts.reduce((sum, acc) => sum + acc.totalSpentt, 0).toFixed(2)}
    </td>
    <td className="p-3 font-bold text-center">
      ৳ {(sortedAccounts.reduce((sum, acc) => sum + acc.totalSpentt, 0) * 140).toFixed(2)}
    </td>
    <td className="p-3 font-bold text-center"></td>
  </tr>
</tfoot>

        </table>
      </div>
    </div>
  );
};

export default History;