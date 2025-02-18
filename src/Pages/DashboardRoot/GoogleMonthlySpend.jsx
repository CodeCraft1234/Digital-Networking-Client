import  { useContext, useState,  } from 'react';
import useUsers from '../../Hook/useUsers';  // Custom hook to fetch users
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import Swal from 'sweetalert2';
import { FaEdit, FaMinusSquare } from 'react-icons/fa';
import { AuthContext } from '../../Security/AuthProvider';
import useMyUser from '../../Hook/useMyUser';
import useUserr from '../../Hook/useUser';
import { Helmet } from 'react-helmet-async';
import useAllEmployee from '../../Hook/useAllEmployee';
import useMyUserSpend from '../../Hook/useMyUserSpend';

const GoogleMonthlySpend = ({data}) => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [users]=useUsers()
  const [allEmployees] = useAllEmployee([]);
  const currentDate = new Date();
  const [modalData2, setModalData2] = useState(null);
  const closeModal = () => {
    setModalData2(null);
  };

  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear().toString();
  const [sortYear, setSortYear] = useState(currentYear);

  const initialTab =
  userr?.role === "admin"
  ? localStorage.getItem(`ac8${user?.email}`) || "all" 
  : localStorage.getItem(`ac8${user?.email}`) || user?.email; 

  const [sortEmployee, setSortEmployee] = useState(initialTab);
  const [myUserSpend,refetch]=useMyUserSpend(sortEmployee)

  console.log(myUserSpend);
  
  
  const changeTab = (tab) => {
    setSortEmployee(tab);
    localStorage.setItem(`ac8${user?.email}`, tab); 
  };

  const initialTab2 = localStorage.getItem("activeTaballhistoryMonth") ;
  const [sortMonth, setSortMonth] = useState(initialTab2 || currentMonth);
  
  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballhistoryMonth", tab); 
  };

  const flattenedData = myUserSpend.reduce((acc, user) => {
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

    const matchMonth = sortMonth 
      ? new Date(account.date).toLocaleString('default', { month: 'long' }) === sortMonth
      : true;

    const matchYear = sortYear 
      ? new Date(account.date).getFullYear().toString() === sortYear
      : true;

    return  matchMonth && matchYear;
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
    <div>

<Helmet>
  <title>
    {`Google Monthly Spend | Digital Network`}
  </title>
  <link rel="canonical" href="https://www.example.com/" />
</Helmet>
      
      <div className='px-5 py-5 rounded-md' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>
      <div className="lg:flex lg:justify-end items-center gap-3 mb-5">

      <div className="w-full lg:w-auto flex justify-start gap-3">
  {userr?.role === "admin" ? (
    <div className="flex  justify-center">
      <select
        style={{
          backgroundColor: "var(--bg-color2)",
          border: "var(--border)",
          color: "var(--text-color2)",
        }}
        className="border bg-white text-black py-2 lg:w-auto w-full border-gray-400 rounded px-2"
        value={sortEmployee}
        onChange={(e) => changeTab(e.target.value)}
      >
        <option value="all">
       Select {data === "contributorSpend" ? "Contributor" : "Digital Marketer"}
</option>

        {allEmployees 
              .filter(f => {
                if (data === 'contributorSpend') {
              return f.role === 'contributor'; 
           }
               return f.role === 'employee'; 
           })
          .map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
      </select>
    </div>
  ) : (
   <></>
  )}
      </div>
      
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

        <div>
        <select
    style={{ backgroundColor: 'var(--bg-color2)', border: 'var(--border)', color: 'var(--text-color2)' }}
    className="px-4 py-2 border rounded bg-white text-black border-black"
    onChange={(e) => setSortYear(e.target.value)}
    value={sortYear || ""}
  >
    <option value="">Select Year</option>
    {Array.from(new Set(sortedAccounts?.map(account => new Date(account.date).getFullYear())))
      .sort((a, b) => b - a) // Sorting in descending order, adjust as needed
      .map(year => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
  </select>
         </div>

      </div>

      <div  className="table-div ">
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1">
              <th className="p-3 text-center"> {
                userr?.role === 'admin' ?  sortedAccounts?.length  : 'SL' } </th>
              <th>Employee Name</th>
              <th>Ad Account Name</th>
              <th>Month</th>
              <th>Total Spend</th>
              <th>Total Bill</th>
            </tr>
          </thead>
          <tbody >
            {sortedAccounts?.filter(f => f.role === `${data || 'contributorSpend'}`)
.map((account, index) => (
              <tr 
              key={account._id}
              className={`tr2`}
            >
              <td  className="text-center">
              {
                userr?.role === 'admin' ? 
                <button
                  className=" delete" 
                  onClick={(e) => handleDelete(e, account.employeeId, account.ids)} // Ensure correct 
                >
                  <FaMinusSquare />
                </button> : <p>{index + 1}</p>
              }
            </td>
             

                <td>
  <div className="flex items-center">
    {
      users?.find(u => u.email === account.employeeEmail)?.photo && (
        <img 
          className='h-10 w-10 rounded-full mr-3' 
          src={users.find(u => u.email === account.employeeEmail).photo} 
          alt={`${account.employeeName}'s profile`} 
        />
      )
    }
    <span>{account.employeeName}</span>
  </div>
                </td>        
                <td>
                <div onClick={() => setModalData2(account)} className="f-left ">

                {
                userr?.role === 'admin' ? 
                    <div>
                      <button
                      className=" f-center "
                      >
                       <FaEdit />  <span>{account.accountName}</span>
                      </button>
                    </div> :  <span>{account.accountName}</span>}
                  </div>
                </td>
                <td>
                  {new Date(account.date).toLocaleString('default', { month: 'long'})}
                </td>
                <td>
  <span className="font-extrabold">$</span>{" "}
  {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(account.totalSpentt)}
                </td>
                {
                  data === 'pageSpend' ? <td>
                  <span className="font-extrabold">৳</span>{" "}
                  {new Intl.NumberFormat('en-IN').format(Math.round(account.totalSpentt * 130))}
                               </td> : <td>
  <span className="font-extrabold">৳</span>{" "}
  {new Intl.NumberFormat('en-IN').format(Math.round(account.totalSpentt * 142))}
               </td>
                }
              </tr>
            ))}
          </tbody>

          <tfoot className="">
            <tr className='tr1 font-bold'>
     <td colSpan="4" className="text-right">Total</td>
     <td>
  $ {new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(sortedAccounts?.filter(f=>f.role === data).reduce((sum, acc) => sum + acc.totalSpentt, 0))}
     </td>
     {
                  data === 'pageSpend' ?    <td>
                  <span className="font-extrabold">৳</span>{" "}
                  {new Intl.NumberFormat('en-IN').format(
                    Math.round(sortedAccounts?.filter(f=>f.role === data).reduce((sum, acc) => sum + acc.totalSpentt, 0) * 130)
                  )}
                    </td> :    <td>
  <span className="font-extrabold">৳</span>{" "}
  {new Intl.NumberFormat('en-IN').format(
    Math.round(sortedAccounts?.filter(f=>f.role === data).reduce((sum, acc) => sum + acc.totalSpentt, 0) * 142)
  )}
    </td>

     }
  
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
                className="input2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={closeModal}
                type="button"
                className="close"
              >
                Close
              </button>
              <button
                type="submit"
                className="add"
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

export default GoogleMonthlySpend;