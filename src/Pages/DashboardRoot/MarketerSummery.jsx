import { useState, useMemo, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../Security/AuthProvider';
import useAllEmployee from '../../Hook/useAllEmployee';
import useUserr from '../../Hook/useUser';
import useMyClientsTotal from '../../Hook/useMyClientsTotal';
import useMyClientsTotalMonth from '../../Hook/useMyClientTotalMonth';
import SummaryCard from '../Home/SummeryCard';
import useMyClientsTotalTiktokCostMonth from '../../Hook/useMyClientTiktokCostTotalMonth';
import useRates from '../../Hook/useRates';
import useClientsDueAvance from '../../Hook/useClientDueAvance';
import useMyUser2 from '../../Hook/useMyUser2';
import useMyClientsTotalServiceMonth from '../../Hook/useMyClientsTotalServiceMonth';
import useUsersSellery2 from '../../Hook/useUsersSellery2';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MarketerSummery = () => {
  const { user } = useContext(AuthContext);
  const [allEmployees] = useAllEmployee();
  const { userr } = useUserr(user?.email);

  const initialTab3 = userr?.role === "admin"
    ? localStorage.getItem(`ac25${user?.email}`) || "all"
    : localStorage.getItem(`ac25${user?.email}`) || user?.email;

  const [selectedEmployee, setSelectedEmployee] = useState(initialTab3);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [myUser] = useMyUser2(selectedEmployee, selectedYear);

  const [myClientsTotalTiktokCostMonth] = useMyClientsTotalTiktokCostMonth(selectedEmployee,selectedYear);
  const [myClientsTotalMonth] = useMyClientsTotalMonth(selectedEmployee,selectedYear);
  const [myClientsTotalServiceMonth] = useMyClientsTotalServiceMonth(selectedEmployee,selectedYear);

  const [myClientsTotal] = useMyClientsTotal(selectedEmployee);
  console.log(myClientsTotalServiceMonth);

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
  const [usersSellery2] = useUsersSellery2('all',selectedYear,'all');
      const [costRate, setCostRate] = useState(rates?.costRate || ""); 
      const [metaRate, setMetaRate] = useState(rates?.metaRate || ""); 
      const [googleRate, setGoogleRate] = useState(rates?.googleRate || ""); 
      const [selleryRate, setSalaryRate] = useState(rates?.googleRate || ""); 
      const [tiktokRate, setTiktokRate] = useState(rates?.googleRate || ""); 
  
      useEffect(() => {
        setSalaryRate(rates?.salaryRate || "");
        setCostRate(rates?.costRate || "");
        setMetaRate(rates?.metaRate || "");
        setGoogleRate(rates?.googleRate || "");
        setTiktokRate(rates?.tiktokRate || "");
      }, [rates]);

  const recentMonths = getRecentMonths();

  const employeeData = useMemo(() => {
    if (!myUser || !recentMonths) return [];

    return recentMonths.map(month => {
      const aggregatedData = allEmployees.reduce((acc, user) => {

        const totalSpentMeta = parseFloat(myUser.totalSpentMeta?.[month] || 0);
        const totalSpentGoogle = parseFloat(myUser.totalSpentGoogle?.[month] || 0);
        const totalSpentPage = parseFloat(myUser.totalSpentPage?.[month] || 0);
        const totalSpent = totalSpentMeta + totalSpentGoogle;

        const selleryData = (user?.sellery || []).filter(sell => sell.month === month);
        const totalSellery = selleryData.reduce((acc, sell) => acc + sell.payAmount, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);

        console.log(totalSellery);

        const totalClientPay = myClientsTotalMonth?.[month] || 0;
        const totalService = myClientsTotalServiceMonth?.[month] || 0;
        const totalClientTiktokCost = myClientsTotalTiktokCostMonth?.[month] || 0;

        acc.totalSpentMeta = totalSpentMeta;
        acc.totalSpentPage = totalSpentPage;
        acc.totalSpent = totalSpent;
        acc.totalSellery = totalSellery;
        acc.totalSellerys = totalSpentMeta * 7;
        acc.totalBonus += totalBonus;

        acc.totalClientPay = totalClientPay;
        acc.totalService = totalService;
        acc.tiktokCost = totalClientTiktokCost;

        return acc;
      }, {
        month,
        totalSpentMeta: 0,
        totalSpentPage:0,
        totalSpentGoogle: 0,
        totalSpent: 0,
        totalSellery: 0,
        totalSellerys: 0,
        totalBonus: 0,
        totalClientPay: 0,
        tiktokCost: 0,
      });

      aggregatedData.totalBill = aggregatedData.totalMetaData * metaRate;
      aggregatedData.totalMeta = aggregatedData.totalSpentMeta * metaRate;
      aggregatedData.totalGoogle = aggregatedData.totalSpentGoogle * googleRate;
      aggregatedData.totalDue = aggregatedData.totalSpent * metaRate - aggregatedData.totalClientPay;
      aggregatedData.totalSelleryPaid = aggregatedData.totalSpent * 7 - aggregatedData.totalSellery;

      return aggregatedData;
    }).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
  }, [myUser, selectedEmployee,  myClientsTotalMonth,myClientsTotalTiktokCostMonth, recentMonths]);

  const totalClientPay = myClientsTotal.total || 0;

  const employeeDue =  totalClientPay -(employeeData
    .reduce((acc, data) => acc + (data.totalGoogle + data.totalMeta), 0)
    .toFixed(0))

  const lossProfit =  employeeData.reduce((acc, data) => acc + (data.totalClientPay - ((data.totalSpentMeta + data.totalSpentGoogle + data.tiktokCost + data.totalSpentPage) * costRate + data.totalSellerys)), 0) 


  const formatValue = (value, decimals = 2) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);

  const { clientsDueAdvance } = useClientsDueAvance(selectedEmployee);

  return (
    <div>
      <Helmet>
        <title>Summery | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className='hidden lg:block'>

      <div className="grid grid-cols-3 rounded-lg md:grid-cols-3 lg:grid-cols-6 text-black sm:grid-cols-2 gap-5 justify-around">
        <SummaryCard title="Total Spend" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((sum, user) => sum + parseFloat(user?.totalSpent || 0), 0))} />
        <SummaryCard title="Total BDT" value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((acc, data) => acc + (data.totalGoogle + data.totalMeta), 0)
    )} />


        <SummaryCard title="Payment" value={new Intl.NumberFormat('en-IN').format(totalClientPay)} />

        <SummaryCard title="Client Due" value={formatValue(clientsDueAdvance?.totalDue || 0, 0)} />

     

        <SummaryCard
          title={lossProfit < 0 ? "Loss " : lossProfit > 0 ? "Profit" : "Clear"}
          value={new Intl.NumberFormat('en-IN').format((lossProfit).toFixed(0))}
        />

        <SummaryCard
          title={employeeDue > 0 ? "EM. Adv." : employeeDue < 0 ? "EM. Due" : "EM. Clear"}
          value={new Intl.NumberFormat('en-IN').format((employeeDue).toFixed(0))}
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
                <option value="all">Select Digital Marketer</option>
                {allEmployees
                  .filter((u) => u.role === "employee")
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
      <th className="text-start flex justify-start items-center ml-5">Month</th>
      {/* <th className="text-center">Salary</th> */}
      <th className="text-center">Service</th>
      <th className="text-center">Total Spend</th>
      <th className="text-center">Total BDT</th>
      <th className="text-center">Total Cost</th>
      <th className="text-center">Payment</th>
      <th className="text-center">Loss/Profit</th>
      <th className="text-center">Due/Advance</th>
    </tr>
  </thead>

  <tbody className="divide-y divide-gray-200 bg-white">
    {employeeData.map((data, index) => {
      const metaPageTotal = data.totalSpentMeta + data.totalSpentPage;
      const googleTikTokTotal = data.totalSpentGoogle + data.tiktokCost;
      const totalCost = (metaPageTotal + googleTikTokTotal) * costRate + data.totalSellerys;
      const emProfitLoss = data.totalClientPay - totalCost;
      const totalSalary = data.totalSellery

      return (
        <tr 
        key={data.id}
        className={`${
          index % 2 === 0
            ? "bg-white text-left text-black border-b border-opacity-20"
            : "bg-gray-100  text-left text-black border-b border-opacity-20"
        }`}
      >
          <td className='text-start pl-8'>{data.month}</td>

          {/* <td>
            <span>
              <span className="amount-taka">৳</span>
              <span className="ml-1">{totalSalary?.toLocaleString('en-IN') || '0'}</span>
            </span>
          </td> */}
          <td>
            <span>
              <span className="amount-taka">৳</span>
              <span className="ml-1">{data.totalService?.toLocaleString('en-IN') || '0'}</span>
            </span>
          </td>

          <td>
            <span>
              <span className="amount-doller">$</span>
              <span className="ml-1">{metaPageTotal.toLocaleString('en-IN')}</span>
            </span>
          </td>

          <td>
            <span>
              <span className="amount-taka">৳</span>
              <span className="ml-1">{(data.totalGoogle + data.totalMeta).toLocaleString('en-IN')}</span>
            </span>
          </td>

          <td>
            <span>
              <span className="amount-taka">৳</span>
              <span className="ml-1">{totalCost.toLocaleString('en-IN')}</span>
            </span>
          </td>

          <td>
            <span>
              <span className="amount-taka">৳</span>
              <span className="ml-1">{data.totalClientPay?.toLocaleString('en-IN') || '0'}</span>
            </span>
          </td>

          <td>
  {emProfitLoss === 0 ? (
    <span className="font-semibold text-gray-700">
      <span className="amount-taka">৳</span>
      <span className="ml-1">0</span>
    </span>
  ) : (
    <span
      className={`px-2 py-1 rounded font-semibold text-white ${
        emProfitLoss > 0 ? 'bg-green-500' : 'bg-red-700'
      }`}
    >
      <span className="amount-taka">৳</span>
      <span className="ml-1">
        {Number(Math.abs(emProfitLoss).toFixed(0)).toLocaleString('en-IN')}
      </span>
    </span>
  )}
</td>

<td>
  {data.totalGoogle + data.totalMeta - (data.totalClientPay || 0) === 0 ? (
    <span className="font-semibold text-gray-700">
      <span className="amount-taka">৳</span>
      <span className="ml-1">0</span>
    </span>
  ) : (
    <span
      className={`px-2 py-1 rounded font-semibold text-white ${
        data.totalGoogle + data.totalMeta - (data.totalClientPay || 0) > 0
          ? 'bg-red-700'
          : 'bg-green-500'
      }`}
    >
      <span className="amount-taka">৳</span>
      <span className="ml-1">
        {Number(
          Math.abs(
            data.totalGoogle + data.totalMeta - (data.totalClientPay || 0)
          ).toFixed(0)
        ).toLocaleString('en-IN')}
      </span>
    </span>
  )}
</td>




        </tr>
      );
    })}
  </tbody>

  <tfoot className="font-bold">
    <tr className="tr1">
      <td className="px-2 py-2 sm:px-4 text-right" colSpan="1">Total :</td>
      <td>
        <span className="inline-flex items-center justify-center">
          <span className="amount-taka text-xs sm:text-sm">৳</span>
          <span className="ml-1 text-xs sm:text-sm">
            {employeeData.reduce((acc, data) => acc + data.totalService, 0).toLocaleString('en-IN')}
          </span>
        </span>
      </td>
      <td>
        <span className="inline-flex items-center justify-center">
          <span className="amount-doller text-xs sm:text-sm">$</span>
          <span className="ml-1 text-xs sm:text-sm">
            {employeeData.reduce((acc, data) => acc + data.totalSpentMeta, 0).toLocaleString('en-IN')}
          </span>
        </span>
      </td>

      <td>
        <span className="inline-flex items-center justify-center">
          <span className="amount-taka text-xs sm:text-sm">৳</span>
          <span className="ml-1 text-xs sm:text-sm">
            {employeeData.reduce((acc, data) => acc + (data.totalGoogle + data.totalMeta), 0).toLocaleString('en-IN')}
          </span>
        </span>
      </td>

      <td>
        <span className="inline-flex items-center justify-center">
          <span className="amount-taka text-xs sm:text-sm">৳</span>
          <span className="ml-1 text-xs sm:text-sm">
            {employeeData.reduce((acc, data) => {
              const metaPageTotal = data.totalSpentMeta + data.totalSpentPage;
              const googleTikTokTotal = data.totalSpentGoogle + data.tiktokCost;
              return acc + (metaPageTotal + googleTikTokTotal) * costRate + data.totalSellerys;
            }, 0).toLocaleString('en-IN')}
          </span>
        </span>
      </td>

      <td>
        <span className="inline-flex items-center justify-center">
          <span className="amount-taka text-xs sm:text-sm">৳</span>
          <span className="ml-1 text-xs sm:text-sm">
            {employeeData.reduce((acc, data) => acc + data.totalClientPay, 0).toLocaleString('en-IN')}
          </span>
        </span>
      </td>

      <td>
        <span className="inline-flex items-center justify-center">
          <span className="amount-taka text-xs sm:text-sm">৳</span>
          <span className="ml-1 text-xs sm:text-sm">
            {employeeData.reduce((acc, data) => {
              const metaPageTotal = data.totalSpentMeta + data.totalSpentPage;
              const googleTikTokTotal = data.totalSpentGoogle + data.tiktokCost;
              const totalCost = (metaPageTotal + googleTikTokTotal) * costRate + data.totalSellerys;
              return acc + (data.totalClientPay - totalCost);
            }, 0).toLocaleString('en-IN')}
          </span>
        </span>
      </td>

      <td>
      <span className="inline-flex items-center justify-center">
        <span className="amount-taka text-xs sm:text-sm">৳</span>
        <span className="ml-1 text-xs sm:text-sm">
          {employeeData.reduce((acc, data) => {
            const dueAdvance = (data.totalGoogle + data.totalMeta) - (data.totalClientPay || 0);
            return acc + dueAdvance;
          }, 0).toLocaleString('en-IN')}
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
  {employeeData.map((data) => {
    const metaPageTotal = data.totalSpentMeta + data.totalSpentPage;
    const googleTikTokTotal = data.totalSpentGoogle + data.tiktokCost;
    const totalCost = (metaPageTotal + googleTikTokTotal) * costRate + data.totalSellerys;
    const emProfitLoss = data.totalClientPay - totalCost;

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
  {(data.totalGoogle + data.totalMeta).toLocaleString("en-IN")}
</p>


          </div>

          {/* Right */}
          <div className="text-right space-y-2 text-xs">

          <p>
                <span className="font-medium">Payment:</span>{" "}
                <span className="amount-taka">৳</span>{" "}
                {data.totalClientPay?.toLocaleString("en-IN") || "0"}
              </p>

             
           
              <p className="font-semibold">
  {(() => {
    const totalGoogle = data.totalGoogle || 0;
    const totalMeta = data.totalMeta || 0;
    const totalClientPay = data.totalClientPay || 0;

    const result = totalGoogle + totalMeta - totalClientPay;

    if (result === 0) {
      return (
        <span className="text-black">
           <span> <span className="amount-taka">৳</span>{" "}0</span>
        </span>
      );
    }

    return (
      <span className={result < 0 ? "text-green-600" : "text-red-600"}>
        {result < 0 ? "Advance" : "Due"}:{" "}
        <span> <span className="amount-taka">৳</span>{" "}{Math.abs(result).toLocaleString("en-IN")}</span>
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

export default MarketerSummery;