import  { useContext, useState,  } from 'react';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import Swal from 'sweetalert2';
import { FaEdit, FaMinusSquare } from 'react-icons/fa';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import { Helmet } from 'react-helmet-async';
import useAllEmployee from '../../Hook/useAllEmployee';
import useMyUserSpend from '../../Hook/useMyUserSpend';
import useRates from '../../Hook/useRates';
import { Link } from 'react-router-dom';

const MetaMonthlySpend = ({data}) => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [allEmployees] = useAllEmployee([]);
  const [modalData2, setModalData2] = useState(null);
  
  const closeModal = () => {
    setModalData2(null);
  };
  
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear().toString();

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

  const initialTab4 = localStorage.getItem("activeTaballhistoryYears") ;
  const [sortYear, setSortYear] = useState(initialTab4 || currentYear);
  
  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballhistoryMonth", tab); 
  };

  const changeTab4 = (tab) => {
    setSortYear(tab);
    localStorage.setItem("activeTaballhistoryYears", tab); 
  };

  const initialStatus = localStorage.getItem("activeTabSe") || 'All';
  const [selectedStatus2, setSelectedStatus2] = useState(initialStatus);

  const changeTab3 = (tab) => {
    setSelectedStatus2(tab);
    localStorage.setItem("activeTabSe", tab);
  };

  const flattenedData = myUserSpend?.reduce((acc, user) => {
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
  });

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


  const filteredAccounts = sortedAccounts?.filter((account) => {
    if (selectedStatus2 === 'All') {
      return account.role === 'pageSpend' || account.role === 'metaSpend';
    }
    return account.role === (selectedStatus2 || 'contributorSpend');
  });


    const { rates } = useRates();
    console.log(rates?.metaRate);
  
  return (
    <div>

<Helmet>
  <title>
    {`Meta & Page Monthly Spend | Digital Network`}
  </title>
  <link rel="canonical" href="https://www.example.com/" />
</Helmet>
      
      <div className='hidden lg:block'>
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
    onChange={(e) => changeTab4(e.target.value)}
    value={sortYear || ""}
  >
    <option value="">Select Year</option>
    {Array.from(new Set(flattenedData?.map(account => new Date(account.date).getFullYear())))
      .sort((a, b) => a - b) // Sorting in ascending order (2024, 2025, 2026...)
      .map(year => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
  </select>
</div>

        <div>
        <select
  className="select2 "
  value={selectedStatus2}
  onChange={(e) => changeTab3(e.target.value)}
>
  <option value="All">All Status</option>
  <option value="metaSpend">Meta Spend</option>
  <option value="pageSpend">Page Spend</option>
 
         </select>
         </div>

      </div>

      <div  className="table-div mb-5">
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1">
              <th className="p-3 text-center"> {
                userr?.role === 'admin' ?  sortedAccounts?.length  : 'SL' } </th>
              <th>Employee Name</th>
              <th>Ad Account Name</th>
              <th>Month Year</th>
              <th>Spend</th>
              <th>Total Bill</th>
            </tr>
          </thead>
          <tbody >
            {filteredAccounts
            ?.sort((a, b) => a.accountName.localeCompare(b.accountName))
            ?.map((account, index) => (
              <tr 
              key={account.id}
              className={`${
                index % 2 === 0
                  ? "bg-white text-left text-black border-b border-opacity-20"
                  : "bg-gray-100  text-left text-black border-b border-opacity-20"
              }`}
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
      allEmployees?.find(u => u.email === account.employeeEmail)?.photo && (
        <img 
          className='h-10 w-10 rounded-full mr-3' 
          src={allEmployees.find(u => u.email === account.employeeEmail).photo} 
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
  {new Date(account.date).toLocaleString('default', { month: 'long', year: 'numeric' })}
</td>

                <td>
                <span className="amount-doller">$ </span>
  {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(account.totalSpentt)}
                </td>
                {
                  data === 'pageSpend' ? <td>
                 <span className="amount-taka">৳ </span>
                  {new Intl.NumberFormat('en-IN').format(Math.round(account.totalSpentt * 130))}
                               </td> : <td>
                               <span className="amount-taka">৳ </span>
  {new Intl.NumberFormat('en-IN').format(Math.round(account.totalSpentt * rates?.metaRate || 0))}
               </td>
                }
              </tr>
            ))}
          </tbody>

          <tfoot className="">
            <tr className='tr1 font-bold'>
     <td colSpan="4" className="text-right">Total</td>
     <td>
     <span className="amount-doller">$ </span> {new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(filteredAccounts?.reduce((sum, acc) => sum + acc.totalSpentt, 0))}
     </td>
     {
                  data === 'pageSpend' ?    <td>
                    <span className="amount-taka">৳ </span>
                  {new Intl.NumberFormat('en-IN').format(
                    Math.round(filteredAccounts.reduce((sum, acc) => sum + acc.totalSpentt, 0) * 130)
                  )}
                    </td> :    <td>
  <span className="amount-taka">৳ </span>
  {new Intl.NumberFormat('en-IN').format(
    Math.round(filteredAccounts?.reduce((sum, acc) => sum + acc.totalSpentt, 0) * 142)
  )}
    </td>

     }
            </tr>
         </tfoot>

        </table>
      </div>
      </div>

  <div className="bg-white font-sans py-40  lg:max-w-2xl lg:hidden mx-auto text-sm">

      {filteredAccounts
            ?.sort((a, b) => a.accountName.localeCompare(b.accountName))
            ?.map((payment) => (
        <div key={payment._id} className="px-3 py-2 sm:px-4 sm:py-3 border-b hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex items-start justify-start text-start gap-2 sm:gap-3">
                {/* Image */}
                <div className="flex-shrink-0 mt-1.5">
                  <img
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"
                    src={allEmployees?.find(u => u.email === payment?.employeeEmail)?.photo}
                    alt=""
                  />
                </div>

                {/* Names */}
                <div className="flex flex-col text-start justify-start items-start">
                  <div className="flex justify-start text-start items-center gap-1">
                    <Link
                      to={`/client/${payment?.clientEmail}`}
                      className="text-black  text-sm sm:text-base hover:text-blue-800 transition-colors"
                    >
                      {allEmployees.find(f => f.email === payment.employeeEmail)?.name}
                    </Link>
                   
                  </div>
                  <p
                   
                      className="text-black text-xs sm:text-base hover:text-blue-800 transition-colors"
                    >
                      {payment.accountName}
                    </p>
                  <div className="flex justify-start text-start items-center gap-1">
                    <p className="text-[10px] sm:text-xs text-gray-500">
                    {new Date(payment.date).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  
                </div>
              </div>

           
            </div>

            {/* Right Content */}
            <div className="text-right">
              {/* Amount and Date */}
              <div>
                <h3 className="font-semibold text-red-800 text-sm sm:text-base">
                  Spend : <span className="amount-doller">$ </span>
  {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(payment.totalSpentt)}
                </h3>

                <h3 className="font-medium text-emerald-600 text-sm sm:text-base">
                  Bill : <span className="amount-taka">৳ </span>
  {new Intl.NumberFormat('en-IN').format(Math.round(payment.totalSpentt * rates?.metaRate || 0))}
                </h3>
                
              </div>

             

            </div>
          </div>
        </div>
      ))}



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

export default MetaMonthlySpend;