import { useState, useMemo, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../Security/AuthProvider';
import useAllEmployee from '../../Hook/useAllEmployee';
import useUserr from '../../Hook/useUser';
import useAdminPayTotalMonthly from '../../Hook/useAdminPayTotalMonthly';
import SummaryCard from '../Home/SummeryCard';
import useRates from '../../Hook/useRates';
import useClientsDueAvance from '../../Hook/useClientDueAvance';
import useMyUser2 from '../../Hook/useMyUser2';
import useMyUser3 from '../../Hook/useMyUser3';
import useContributorPayTotalMonthly from '../../Hook/useContributorPayTotalMonthly';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ContributorSummery = () => {
  const { user } = useContext(AuthContext);
  const [allEmployees] = useAllEmployee();
  const { userr } = useUserr(user?.email);

  const initialTab3 = userr?.role === "admin"
    ? localStorage.getItem(`ac25${user?.email}`) || "all"
    : localStorage.getItem(`ac25${user?.email}`) || user?.email;

  const [selectedEmployee, setSelectedEmployee] = useState(initialTab3 || 'all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [myUser, refetch] = useMyUser3(selectedEmployee, selectedYear);

  const [contributorPayTotalMonthly] = useContributorPayTotalMonthly(selectedEmployee,selectedYear);

  console.log(contributorPayTotalMonthly);

  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem(`ac25${user?.email}`, tab);
  };

  const getRecentMonths = () => {
    const today = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      return month.toLocaleString('default', { month: 'long' });
    }).reverse();
  };

  const { rates } = useRates();

      const [contributorRate, setContributorRate] = useState(rates?.contributorRate || ""); 
     
      
      useEffect(() => {

        setContributorRate(rates?.contributorRate || "");

      }, [rates]);

  const recentMonths = getRecentMonths();

  const employeeData = useMemo(() => {
    if (!myUser || !recentMonths) return [];

    return recentMonths.map(month => {
      const aggregatedData = allEmployees.reduce((acc, user) => {

        const totalSpentMeta = parseFloat(myUser.totalSpentMeta?.[month] || 0);
        const totalSpent = totalSpentMeta 

        const selleryData = (user?.sellery || []).filter(sell => sell.month === month);
       
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);

        const totalAdminPay = (
          parseFloat(contributorPayTotalMonthly?.paymentByMonth?.[month] || 0) 
        );

        acc.totalSpentMeta = totalSpentMeta;
        acc.totalSpent = totalSpent;
        acc.totalBonus += totalBonus;
        acc.totalAdminPay = totalAdminPay;

        return acc;
      }, {
        month,
        totalSpentMeta: 0,
        totalSpentPage:0,
        totalSpentGoogle: 0,
        totalSpent: 0,
        totalAdminPay: 0,
      });

      aggregatedData.totalBill = aggregatedData.totalMetaData * contributorRate;

      aggregatedData.totalDue = aggregatedData.totalSpent * contributorRate - aggregatedData.totalAdminPay;
      aggregatedData.totalSelleryPaid = aggregatedData.totalSpent * 7 - aggregatedData.totalSellery;

      return aggregatedData;
    }).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
  }, [myUser, selectedEmployee, contributorPayTotalMonthly,recentMonths]);

  const totalAdminPay = employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0);

  const employeeDue =  totalAdminPay - employeeData.reduce((acc, data) => acc + data.totalSpentMeta, 0).toLocaleString('en-IN') * contributorRate



  return (
    <div>
      <Helmet>
        <title>Summery | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className='hidden lg:block'>

      <div className="grid grid-cols-3 rounded-lg md:grid-cols-3 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around">
        {/* <SummaryCard title="Total Spend" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((sum, user) => sum + parseFloat(user?.totalSpent || 0), 0))} /> */}
        <SummaryCard
  title="Total Spend"
  value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    employeeData.reduce((acc, data) => acc + data.totalSpentMeta, 0)
  )}
/>

        <SummaryCard title="Total BDT" value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(employeeData.reduce((acc, data) => acc + data.totalSpentMeta, 0) * contributorRate).toLocaleString('en-IN')} />

        <SummaryCard title={userr?.role === 'admin' ? "Income" : 'Admin Pay'} value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0))} />

      

       
     



        <SummaryCard
  title={
    employeeDue > 0
      ? "CON. Adv."
      : employeeDue < 0
      ? "CON. Due"
      : "CON. Clear"
  }
  value={new Intl.NumberFormat('en-IN').format(
    Math.round(
      employeeData.reduce((acc, data) => acc + data.totalSpentMeta * contributorRate, 0) -
      employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)
    )
  )}
/>


       

      </div>

      <div className="my-5">
      <div className='flex justify-end items-center my-5 gap-3'>
      <div className="">
          {userr?.role === "admin" && (
            <div className="flex  justify-center">
              <select
                className="select2"
                value={selectedEmployee}
                onChange={(e) => changeTab(e.target.value)}
              >
                <option value="all">Select Contributor</option>
                {allEmployees
                  .filter((u) => u.role === "contributor")
                  .map((employee) => (
                    <option key={employee._id} value={employee.email}>
                      {employee.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <select
  className="select2"
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
>
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
    <th className='text-center'>Month</th>
    <th className='text-center'>Total Spend</th>
    <th className='text-center'>Total BDT</th>
    <th className='text-center'>Income</th>
    <th className='text-center'>DUE/ADV</th>
   
  </tr>
    </thead>

    <tbody className="divide-y divide-gray-200 bg-white">
      {employeeData.map((data, index) => {
        const metaPageTotal = data.totalSpentMeta;
        return (
          <tr 
          key={data.id}
          className={`${
            index % 2 === 0
              ? "bg-white text-left text-black border-b border-opacity-20"
              : "bg-gray-100  text-left text-black border-b border-opacity-20"
          }`}
        >
            <td>
            {data.month}
            </td>
            <td>
  <span>
    <span className="amount-doller">$</span>
    <span className="ml-1">
      {metaPageTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
    </span>
  </span>
</td>

<td>
  <span>
    <span className="amount-taka">৳</span>
    <span className="ml-1">
      {(data.totalSpentMeta * contributorRate).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
    </span>
  </span>
</td>

<td>
  <span>
    <span className="amount-taka">৳</span>
    <span className="ml-1">
      {data.totalAdminPay.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
    </span>
  </span>
</td>


            <td>
  {(() => {
    const diff = data.totalSpentMeta * contributorRate - data.totalAdminPay;
    const isPositive = diff > 0;
    const isNegative = diff < 0;
    const fixedValue = Math.abs(diff).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return (
      <span className="inline-flex items-center justify-center">
        <span className="amount-taka text-xs sm:text-sm">৳</span>
        <span
          className={`ml-1 text-xs sm:text-sm px-1 rounded 
            ${isPositive ? 'bg-red-700 text-white' : ''} 
            ${isNegative ? ' bg-green-500 text-white' : ''}`}
        >
          {fixedValue}
        </span>
      </span>
    );
  })()}
</td>





          


          </tr>
        );
      })}
    </tbody>

    <tfoot className="font-bold bg-gray-100">
  <tr className="tr1">
    <td className="px-2 py-2 sm:px-4 text-right" colSpan="1">Total :</td>

    {/* Total Spend $ */}
    <td>
      <span className="inline-flex items-center justify-center">
        <span className="amount-doller text-xs sm:text-sm">$</span>
        <span className="ml-1 text-xs sm:text-sm">
          {Math.round(
            employeeData.reduce((acc, data) => acc + data.totalSpentMeta, 0)
          ).toLocaleString('en-IN')}
        </span>
      </span>
    </td>

    {/* Total BDT (Spend * rate) */}
    <td>
      <span className="inline-flex items-center justify-center">
        <span className="amount-taka text-xs sm:text-sm">৳</span>
        <span className="ml-1 text-xs sm:text-sm">
          {Math.round(
            employeeData.reduce((acc, data) => acc + data.totalSpentMeta, 0) * contributorRate
          ).toLocaleString('en-IN')}
        </span>
      </span>
    </td>

    {/* Total Admin Pay */}
    <td>
      <span className="inline-flex items-center justify-center">
        <span className="amount-taka text-xs sm:text-sm">৳</span>
        <span className="ml-1 text-xs sm:text-sm">
          {Math.round(
            employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)
          ).toLocaleString('en-IN')}
        </span>
      </span>
    </td>

    {/* Total Due/Advance */}
    <td>
      <span className="inline-flex items-center justify-center">
        <span className="amount-taka text-xs sm:text-sm">৳</span>
        <span className="ml-1 text-xs sm:text-sm">
          {Math.round(
            employeeData.reduce((acc, data) => acc + data.totalSpentMeta * contributorRate, 0) -
            employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)
          ).toLocaleString('en-IN')}
        </span>
      </span>
    </td>
  </tr>
</tfoot>




  </table>
</div>
      </div>

      </div>



      <div className="bg-white pt-40 pb-12 lg:pt-8 font-sans lg:max-w-2xl lg:hidden mx-auto text-sm">
      {employeeData.map((data, index) => {
        const metaPageTotal = data.totalSpentMeta;
        return (

<div
        key={data._id}
        className="bg-gray-50 rounded-xl shadow-md px-5 py-4 mb-4 hover:shadow-lg transition duration-300"
      >
        <div className="flex justify-between items-end gap-4">
          {/* Left */}
          <div className="space-y-2 flex-1">
            <h2 className="text-lg font-semibold text-green-500 uppercase tracking-wide">{data.month}</h2>

            <p>
  <span className="font-medium">Spend:</span>{" "}
  <span className="amount-doller">$</span>{" "}
  {metaPageTotal.toLocaleString("en-IN")}
</p>

<p>
  <span className="font-medium">Bill:</span>{" "}
  <span className="amount-taka">৳</span>{" "}
  {(data.totalSpentMeta * contributorRate).toLocaleString('en-IN')}
</p>

           
          </div>

          {/* Right */}
          <div className="text-right space-y-2 text-xs">

          <p>
                <span className="font-medium">Payment:</span>{" "}
                <span className="amount-taka">৳</span>{" "}
                {data.totalAdminPay.toLocaleString('en-IN')}
              </p>
         
              <p className="text-gray-700">
  {(() => {
    const totalSpent = data.totalSpentMeta || 0;
    const rate = contributorRate || 0;
    const adminPay = data.totalAdminPay || 0;

    const result = totalSpent * rate - adminPay;

    if (result === 0) {
      return (
        <span className="font-semibold text-blue-600">
          Clear: <span className="amount-taka">৳</span>
          <span className="ml-1">0</span>
        </span>
      );
    }

    return (
      <span
        className={`font-semibold ${
          result < 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {result < 0 ? "Advance" : "Due"}:{" "}
        <span className="amount-taka">৳</span>
        <span className="ml-1">{Math.abs(result).toLocaleString("en-IN")}</span>
      </span>
    );
  })()}
</p>

           
          </div>
        </div>
      </div>

           


     
        );
      })}
      </div>
      
    </div>
  );
};

export default ContributorSummery;