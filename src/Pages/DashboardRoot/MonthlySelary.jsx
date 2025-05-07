import { useState, useEffect} from 'react';
import useUsers from '../../Hook/useUsers';
import SummaryCard from '../Home/SummeryCard';
import toast from 'react-hot-toast';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import useRates from '../../Hook/useRates';
import useUsersSellery2 from '../../Hook/useUsersSellery2';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];
const years = Array.from({ length: 6 }, (_, index) => 2024 + index); // Creates an array of years from 2020 to 2050

const MonthlySalary = () => {
    const [users] = useUsers();
    const [employeeData, setEmployeeData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    
    const initialTab = localStorage.getItem("activeTaballClientspayss") ;
    const [sortMonth, setSortMonth] = useState(initialTab,'all'); 
    const [usersSellery2] = useUsersSellery2('all',selectedYear,sortMonth);
  
    const changeTab = (tab) => {
      setSortMonth(tab);
      localStorage.setItem("activeTaballClientspayss", tab); 
    };
  
    useEffect(() => {
      const aggregatedData = usersSellery2?.map((user) => {
  
        const totalMetaSpent = (user.monthlySpent || [])
          .filter((f) => f.role === "metaSpend")
          .reduce((acc, spent) => acc + spent.totalSpentt, 0);
  
        const totalPageSpent = (user.monthlySpent || [])
          .filter((f) => f.role === "pageSpend")
          .reduce((acc, spent) => acc + spent.totalSpentt, 0);
  
        const totalGoogleSpent = (user.monthlySpent || [])
          .filter((f) => f.role === "googleSpend")
          .reduce((acc, spent) => acc + spent.totalSpentt, 0);
  
        return {
          ...user,
          totalMetaSpent,
          totalPageSpent,
          totalGoogleSpent,
          totalSpent : totalMetaSpent +  totalGoogleSpent,
        };
      });
  
      const sortedData = aggregatedData.sort((a, b) => b.totalSpent - a.totalSpent);
      setEmployeeData(sortedData);
    }, [users, usersSellery2]);
  
    const { rates } = useRates();
    
  return (
    <div className=' text-black'>

 <div className="text-black hidden lg:block">
      <div className="grid grid-cols-3 rounded-lg md:grid-cols-4 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around">



  <SummaryCard
    title="Total Spend"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
      employeeData.reduce(
        (sum, user) => sum + parseFloat(user?.totalSpent + user?.totalPageSpent || 0),
        0
      )
    )}
  />

  {/* Total Salary */}
  <SummaryCard
    title="Total Salary"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
      employeeData.reduce(
        (sum, user) => sum + parseFloat((user?.totalSpent + user?.totalPageSpent) * 7 || 0),
        0
      )
    )}
  />

  {/* Total Paid */}
  <SummaryCard
    title="Total Paid"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
      employeeData.reduce(
        (sum, user) => sum + parseFloat(user?.salaryPay || 0),
        0
      )
    )}
  />

  {/* Total UnPaid */}
  <SummaryCard
    title=" Total UnPaid"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
      employeeData.reduce(
        (sum, user) =>
          sum +
          (parseFloat((user?.totalSpent + user?.totalPageSpent) * 7 || 0) -
            parseFloat(user?.salaryPay || 0)),
        0
      )
    )}
  />


  




</div>

      <div
        className="my-5 "
      >

      <div className="flex justify-end gap-3 items-center mb-5">

      <select className="select2" value={sortMonth} onChange={(e) => changeTab(e.target.value)}>
<option  value='all'>Select Month</option>
  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    .map((month, i) => <option key={i} value={i + 1}>{month}</option>)}
</select>
<select
  className="select2"
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
>
  <option value="all">Select Year</option> {/* Default option */}
  {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2024 + i).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>


      </div>

        <div className="table-div">
        <table className="min-w-full text-center">
  <thead>
    <tr className="tr1">
    
      <th>SL</th>
      <th className="flex justify-start">Employee Name</th>

      
      <th>
           <div className="flex justify-center items-center gap-2">
              Spend
           </div>
         </th>
      <th>
           <div className="flex justify-center items-center gap-2">
            Salary
           </div>
         </th>


     
      <th className="text-center">Paid</th>
      <th className="text-center">UnPaid</th>
    
    </tr>
  </thead>
  
  <tbody className="divide-y divide-gray-200 bg-white">
  {employeeData.map((user, index) => {
      const totalSpent = parseFloat(user?.totalSpent || 0);
      const salary = parseFloat(user?.totalSpent * 7 || 0);
      const salaryPay = parseFloat(user?.salaryPay || 0);

        return (
          <tr 
                key={user._id}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-black border-b border-opacity-20"
                    : "bg-gray-100  text-left text-black border-b border-opacity-20"
                }`}
              >
              <td>{index +1 }</td>
            <td className="px-2 py-3 sm:px-4 sm:py-3 text-sm font-medium text-gray-900 ">
              <div className="flex items-center gap-2">
                <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" src={user.photo} alt="" />
                <span className="whitespace-nowrap"><div className="flex flex-col space-y-1">
              <p className="text-lg flex justify-start items-center gap-1 ">{user.name}</p>
            </div></span>
              </div>
            </td>

           

            <td>
                <span className="amount-taka">৳ </span> {totalSpent.toLocaleString('en-IN')}
                </td>
            <td>
                <span className="amount-taka">৳ </span> {salary.toLocaleString('en-IN')}
                </td>
            <td>
                <span className="amount-taka">৳ </span> {salaryPay.toLocaleString('en-IN')}
                </td>
            <td>
                <span className="amount-taka">৳ </span> {(salary - salaryPay).toLocaleString('en-IN')}
                </td>

    
          </tr>
        );
      })}
    </tbody>

    <tfoot className="font-bold bg-gray-50">
  <tr className="tr1">
    <td colSpan="2" className="text-right px-2 py-3 text-xs sm:text-sm md:text-base">
      Total:
    </td>

    {/* Total Spend */}
    <td>
      <span className="amount-taka">৳ </span>
      {employeeData
        .reduce((sum, user) => sum + parseFloat(user?.totalSpent || 0), 0)
        .toLocaleString("en-IN")}
    </td>

    {/* Total Salary */}
    <td>
      <span className="amount-taka">৳ </span>
      {employeeData
        .reduce((sum, user) => sum + parseFloat(user?.totalSpent * 7 || 0), 0)
        .toLocaleString("en-IN")}
    </td>

    {/* Total Paid */}
    <td>
      <span className="amount-taka">৳ </span>
      {employeeData
        .reduce((sum, user) => sum + parseFloat(user?.salaryPay || 0), 0)
        .toLocaleString("en-IN")}
    </td>

    {/* Total Unpaid */}
    <td>
      <span className="amount-taka">৳ </span>
      {employeeData
        .reduce(
          (sum, user) =>
            sum +
            (parseFloat(user?.totalSpent * 7 || 0) -
              parseFloat(user?.salaryPay || 0)),
          0
        )
        .toLocaleString("en-IN")}
    </td>
  </tr>
</tfoot>


</table>

        </div>
      </div>

    </div>


      <div className="bg-white font-sans pt-40 pb-16 lg:max-w-2xl lg:hidden mx-auto text-sm">
      
            {employeeData?.map((payment) => (
              <div key={payment._id} className="px-3 py-2 sm:px-4 sm:py-3 border-b hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-start text-start gap-2 sm:gap-3">
                      {/* Image */}
                      <div className="flex-shrink-0 mt-1.5">
                        <img
                          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"
                          src={payment.photo}
                          alt=""
                        />
                      </div>
      
                      {/* Names */}
                      <div className="flex flex-col text-start justify-start items-start">
                        <div className="flex justify-start text-start items-center gap-1">
                          <p
                           
                            className="text-black  text-sm sm:text-base hover:text-blue-800 transition-colors"
                          >
                            {payment.name}
                          </p>
                         
                        </div>
                        <p
                         
                            className="text-black text-xs sm:text-base hover:text-blue-800 transition-colors"
                          >
                            {payment.accountName}
                          </p>
                       

                        <h3 className="font-semibold text-red-800 text-sm sm:text-base">
                        Salary : <span className="amount-taka">৳ </span>
                        {new Intl.NumberFormat('en-IN').format((payment.totalSpent * 7).toFixed(0))}
                      </h3>
                        
                      </div>
                    </div>
      
                 
                  </div>
      
                  {/* Right Content */}
                  <div className="text-right">
                    {/* Amount and Date */}
                    <div>
                     
      
  
                      <h3 className="font-medium text-emerald-600 text-sm sm:text-base">
                        Paid : <span className="amount-taka">৳ </span>
        {new Intl.NumberFormat('en-IN').format(payment.totalSellery)}
                      </h3>
                      <h3 className="font-medium text-emerald-600 text-sm sm:text-base">
                      UnPaid : <span className="amount-taka">৳ </span>
        {new Intl.NumberFormat('en-IN').format((payment.totalSpent * 7 - payment.totalSellery).toFixed(0))}
                      </h3>
                      
                    </div>
      
                   
      
                  </div>
                </div>
              </div>
            ))}
      
      
      
          </div>
   
    </div>
  );
};

export default MonthlySalary;