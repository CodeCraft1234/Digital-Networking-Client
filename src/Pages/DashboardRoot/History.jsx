import  { useState,  } from 'react';
import useUsers from '../../Hook/useUsers';  // Custom hook to fetch users
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FaEdit, FaMinusSquare } from 'react-icons/fa';

const History = () => {
  const [users,refetch] = useUsers(); 
  const currentDate = new Date();

  const [modalData2, setModalData2] = useState(null);

  // Function to close the modal
  const closeModal = () => {
    setModalData2(null);
  };

  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear().toString();
  const [sortYear, setSortYear] = useState(currentYear);

  const initialTab = localStorage.getItem("activeTaballhistory") ;
  const [sortEmployee, setSortEmployee] = useState(initialTab);
  
  const changeTab = (tab) => {
    setSortEmployee(tab);
    localStorage.setItem("activeTaballhistory", tab); 
  };

  const initialTab2 = localStorage.getItem("activeTaballhistoryMonth") ;
  const [sortMonth, setSortMonth] = useState(initialTab2 || currentMonth);
  
  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballhistoryMonth", tab); 
  };

  

  // Flatten the monthlySpent data across all users
  const flattenedData = users.filter(u=>u.role === 'employee').reduce((acc, user) => {
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

  const sortedAccounts = flattenedData
  .filter(account => {
    const matchEmployee = sortEmployee ? account.employeeName === sortEmployee : true;
    const matchMonth = sortMonth ? new Date(account.date).toLocaleString('default', { month: 'long' }) === sortMonth : true;
    const matchYear = sortYear ? new Date(account.date).getFullYear().toString() === sortYear : true;
    return matchEmployee && matchMonth && matchYear;
  })
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
  .sort((a, b) => a.accountName.localeCompare(b.accountName, undefined, { sensitivity: 'base' }));


  const AxiosPublic = UseAxiosPublic();

  const handleUpdate2 = async (e, userId, spentId) => {
    e.preventDefault();
    const totalSpent = e.target.totalSpentt.value; 
    const totalSpentt = parseFloat(totalSpent);
    console.log(totalSpentt);
    
   AxiosPublic.put(`/updateSpent/${userId}/${spentId}`, {
        totalSpentt,
      })
      .then(res=>{
        setModalData2(null);
        console.log(res.data);
        refetch()
      })
       
    }
  
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
      <div className='px-5 py-5 rounded-md' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>
      <div className="lg:flex lg:justify-start items-center gap-3 mb-5">
        <div className='flex justify-center items-center'>
          <select
           style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
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
              <th className="p-3">{sortedAccounts?.length}</th>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Ad Account Name</th>
              <th className="p-3">Month</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Total Bill</th>
          
            </tr>
          </thead>
          <tbody >
            {sortedAccounts?.map((account, index) => (
              <tr  style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
              key={account._id}
              className={`${
                index % 2 === 0
                  ? "bg-white text-left text-black border-b border-opacity-20"
                  : "bg-gray-200  text-left text-black border-b border-opacity-20"
              }`}
            >
                <td style={{  border: 'var(--border)',}} className="p-3 border-r-2 border-gray-300 text-center px-5"> <button
                      className=" hover:bg-blue-700 text-[#f86c6b] text-xl px-2 py-1 rounded" 
                      onClick={(e) => handleDelete(e, account.employeeId, account.ids)} // Ensure correct 
                    >
                      <FaMinusSquare />
                    </button></td>

                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2  font-semibold hover:text-blue-700 hover:font-bold border-gray-300 text-start px-5">
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


               
              
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-start px-5">

                <div onClick={() => setModalData2(account)} className="flex justify-left items-center gap-1">
                    <div>
                      <button
                      className=" flex justify-center items-center gap-1   px-2 py-1 rounded"
                      
                      >
                       <FaEdit />  <span>{account.accountName}</span>
                      </button>
                    </div>
                  
                   
                  </div>
                
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-l-2 border-r-2 text-center border-gray-300">
                  {new Date(account.date).toLocaleString('default', { month: 'long'})}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                <span className='font-extrabold '>$</span> {account.totalSpentt.toFixed(2)}
</td>
<td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
<span className='font-extrabold '>৳</span> {(account.totalSpentt * 140).toFixed(0)}
</td>

               
              </tr>
            ))}
          </tbody>

          <tfoot className="">
  <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
    <td colSpan="4" className="p-3 font-bold text-right">Total</td>
    <td className="p-3 font-bold text-center">
      $ {sortedAccounts.reduce((sum, acc) => sum + acc.totalSpentt, 0).toFixed(2)}
    </td>
    <td className="p-3 font-bold text-center">
    <span className='font-extrabold '>৳</span> {(sortedAccounts.reduce((sum, acc) => sum + acc.totalSpentt, 0) * 140).toFixed(0)}
    </td>
  
  </tr>
</tfoot>

        </table>
      </div>
      </div>

       {modalData2 && (
      <dialog className="modal" open>
        <div className="modal-box bg-white text-black">
          <h1 className='text-center my-3 text-xl text-blue-500 font-bold'>{modalData2.accountName}</h1>
          <form onSubmit={(e) => handleUpdate2(e, modalData2.employeeId, modalData2.ids)}>
            <div className="mb-4">
              <label className="block text-start text-gray-700">Total Spent</label>
              <input
                type="text"
                name="totalSpentt"
                defaultValue={modalData2.totalSpentt}
                className="w-full bg-white border-black border rounded p-2 mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={closeModal}
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
    )}

    </div>
  );
};

export default History;