import { useState, useMemo, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../Security/AuthProvider';
import useAllEmployee from '../../Hook/useAllEmployee';
import useUserr from '../../Hook/useUser';
import useMyUser from '../../Hook/useMyUser';
import useMyClientsTotal from '../../Hook/useMyClientsTotal';
import useMyClientsTotalMonth from '../../Hook/useMyClientTotalMonth';
import useAdminPayTotalMonthly from '../../Hook/useAdminPayTotalMonthly';
import SummaryCard from '../Home/SummeryCard';
import useMyClientsTotalTiktokCostMonth from '../../Hook/useMyClientTiktokCostTotalMonth';
import { SiGoogleads, SiMeta } from 'react-icons/si';
import { FaTiktok } from 'react-icons/fa';
import useRates from '../../Hook/useRates';
import useClientsDueAvance from '../../Hook/useClientDueAvance';

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
  const [myUser] = useMyUser(selectedEmployee);

  const [myClientsTotalMonth] = useMyClientsTotalMonth(selectedEmployee);
  const [myClientsTotalTiktokCostMonth] = useMyClientsTotalTiktokCostMonth(selectedEmployee);
  const [adminPayTotalMonthly] = useAdminPayTotalMonthly(selectedEmployee);
  const [myClientsTotal] = useMyClientsTotal(selectedEmployee);

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

      const [salaryRate, setSalaryRate] = useState(rates?.salaryRate || ""); 
      const [costRate, setCostRate] = useState(rates?.costRate || ""); 
      const [metaRate, setMetaRate] = useState(rates?.metaRate || ""); 
      const [googleRate, setGoogleRate] = useState(rates?.googleRate || ""); 
      const [tiktokRate, setTiktokRate] = useState(rates?.tiktokRate || ""); 


      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
      const currentYear = currentDate.getFullYear().toString();
      const [sortYear, setSortYear] = useState(currentYear);
      
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
        const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);

        const totalAdminPay = (
          parseFloat(adminPayTotalMonthly?.paymentByMonth?.[month] || 0) 
        );

        const totalAdminPayCharge = (
          parseFloat(adminPayTotalMonthly?.paymentByMonthCharge?.[month] || 0)) 
        
        const totalClientPay = myClientsTotalMonth?.[month] || 0;
        const totalClientTiktokCost = myClientsTotalTiktokCostMonth?.[month] || 0;

        acc.totalSpentMeta = totalSpentMeta;
        acc.totalSpentPage = totalSpentPage;
        acc.totalSpent = totalSpent;
        acc.totalSellery += totalSellery;
        acc.totalSellerys = totalSpentMeta * 7;
        acc.totalBonus += totalBonus;
        acc.totalAdminPay = totalAdminPay;

        acc.totalAdminPayCharge = totalAdminPayCharge;

        acc.totalClientPay = totalClientPay;
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
        totalAdminPay: 0,
        totalAdminPayCharge: 0,
        totalClientPay: 0,
        tiktokCost: 0,
      });

      aggregatedData.totalBill = aggregatedData.totalMetaData * metaRate;
      aggregatedData.totalMeta = aggregatedData.totalSpentMeta * metaRate;
      aggregatedData.totalGoogle = aggregatedData.totalSpentGoogle * googleRate;
      aggregatedData.totalDue = aggregatedData.totalSpent * metaRate - aggregatedData.totalAdminPay;
      aggregatedData.totalSelleryPaid = aggregatedData.totalSpent * 7 - aggregatedData.totalSellery;

      return aggregatedData;
    }).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
  }, [myUser, selectedEmployee, adminPayTotalMonthly, myClientsTotalMonth,myClientsTotalTiktokCostMonth, recentMonths]);

  const totalAdminPay = employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0);
  const totalClientPay = myClientsTotal.total || 0;

  const employeeDue =  totalAdminPay -(employeeData
    .reduce((acc, data) => acc + (data.totalGoogle + data.totalMeta), 0)
    .toFixed(0))

  const lossProfit =  employeeData.reduce((acc, data) => acc + (data.totalAdminPay - ((data.totalSpentMeta + data.totalSpentGoogle + data.tiktokCost + data.totalSpentPage) * costRate + data.totalAdminPayCharge + data.totalSellerys)), 0) 

  const clientDue = totalClientPay - totalAdminPay ;

  const formatValue = (value, decimals = 2) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);

  const { clientsDueAdvance } = useClientsDueAvance(selectedEmployee);


  console.log( adminPayTotalMonthly);

  return (
    <div>
      <Helmet>
        <title>Summery | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="grid grid-cols-3 rounded-lg md:grid-cols-3 lg:grid-cols-7 text-black sm:grid-cols-2 gap-5 justify-around">
        <SummaryCard title="Total Spend" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((sum, user) => sum + parseFloat(user?.totalSpent || 0), 0))} />
        <SummaryCard title="Total BDT" value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((acc, data) => acc + (data.totalGoogle + data.totalMeta), 0)
    )} />

        <SummaryCard title={userr?.role === 'admin' ? "Income" : 'Admin Pay'} value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0))} />

        <SummaryCard title="Client Pay" value={new Intl.NumberFormat('en-IN').format(totalClientPay)} />

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

      <div className="side-space mt-5">
      <div className='flex justify-between items-center mb-5 gap-3'>
      <div className="">
          {userr?.role === "admin" && (
            <div className="flex mt-1.5 justify-center">
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
          <div>
  <select
    style={{ backgroundColor: 'var(--bg-color2)', border: 'var(--border)', color: 'var(--text-color2)' }}
    className="px-4 py-2 border rounded bg-white text-black border-black"
    onChange={(e) => setSortYear(e.target.value)}
    value={sortYear || ""}
  >
    <option value="">Select Year</option>
    {Array.from(new Set(employeeData?.map(account => new Date(account.date).getFullYear())))
      .sort((a, b) => a - b) // Sorting in ascending order (2024, 2025, 2026...)
      .map(year => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
  </select>
</div>

        </div>

      </div>

        <div className="table-div">
          <table className="min-w-full text-center">
          <thead>
  <tr className="tr1">
    <th>Month</th>

    <th>
      <div className="flex justify-start items-center gap-1">
        <SiMeta  /> Spend
      </div>
    </th>

    <th>
      <div className="flex justify-start items-center gap-1">
        <SiGoogleads /> Spend
      </div>
    </th>

    <th>
      <div className="flex justify-start items-center gap-1">
        <FaTiktok /> Spend
      </div>
    </th>

    <th>Page $</th>
    <th>Total BDT</th>
    <th>{userr?.role === 'admin' ? "Income" : 'Admin Pay'}</th>
    <th>Client Pay</th>
    <th>Total Cost</th>
    <th className="text-center">{clientDue > 0 ? "Client Adv." : clientDue < 0 ? "Client Due" : "Client Clear"}</th>
    <th className="text-center"> {lossProfit < 0 ? "Loss" : lossProfit > 0 ? "Profit" : "Clear"} </th>
    <th className="text-center">{employeeDue > 0 ? "EM. Adv." : employeeDue < 0 ? "EM. Due" : "EM. Clear"}</th>
   
  </tr>
</thead>

            <tbody>
              {employeeData.map((data, index) => (
                <tr key={index} className="tr2">
                  <td>{data.month}</td>


                  <td><span className="amount-doller">$ </span>{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.totalSpentMeta)}</td>

                  <td><span className="amount-doller">$ </span>{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.totalSpentGoogle)}</td>

                  <td><span className="amount-doller">$ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.tiktokCost.toFixed(2))}</td>

                  <td><span className="amount-doller">$ </span>{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.totalSpentPage)}</td>


                
                  <td><span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalGoogle + data.totalMeta)}</td>

                  <td><span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalAdminPay)}</td>

                  <td><span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalClientPay)}</td>




                  <td><span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(((data.totalSpentMeta + data.totalSpentGoogle + data.tiktokCost + data.totalSpentPage) * costRate) +  data.totalAdminPayCharge + data.totalSellerys)}</td>



                  <td className='text-center'>
  <span className={(() => {

    const difference = data.totalClientPay -  data.totalAdminPay ;

    return difference > 0
      ? 'bg-green-700 px-3 rounded-lg py-1.5  text-white'
      : difference < 0
      ? 'bg-red-800 px-3 rounded-lg py-1.5  text-white'
      : 'bg-yellow-300 px-3 rounded-lg py-1.5  text-black';
  })()}>

<span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      data.totalClientPay - data.totalAdminPay 
    )}
    
  </span>
                 </td>


                 

                 
                  <td className='text-center'>
  <span className={(() => {
    const totalSpent =
      (data.totalSpentMeta + data.totalSpentGoogle + data.tiktokCost + data.totalSpentPage) * costRate +
      data.totalAdminPayCharge +
      data.totalSellerys;

    const difference = data.totalAdminPay - totalSpent;

    return difference > 0
      ? 'bg-green-700 px-3 rounded-lg py-1.5  text-white'
      : difference < 0
      ? 'bg-red-800 px-3 rounded-lg py-1.5  text-white'
      : 'bg-yellow-300 px-3 rounded-lg py-1.5  text-black';
  })()}>

<span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      data.totalAdminPay - 
      ((data.totalSpentMeta + data.totalSpentGoogle + data.tiktokCost + data.totalSpentPage) * costRate + 
       data.totalAdminPayCharge + 
       data.totalSellerys)
    )}
    
  </span>
                 </td>

                 <td className='text-center'>
                    <span className={
                        data.totalAdminPay - (data.totalGoogle + data.totalMeta)  > 0
                        ? 'bg-green-700 px-3 rounded-lg py-1.5  text-white'
                        : data.totalAdminPay - (data.totalGoogle + data.totalMeta) < 0
                        ? 'bg-red-800 px-3 rounded-lg py-1.5  text-white'
                        : 'bg-yellow-300 px-3 rounded-lg py-1.5  text-black'
                    }>
                      ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
                        data.totalAdminPay - (data.totalGoogle + data.totalMeta)
                      )}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
            <tfoot className="font-bold">
  <tr className="tr1">
    <td className="text-right" colSpan="1">Total</td>

    <td><span className="amount-doller">$ </span>{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      employeeData.reduce((acc, data) => acc + data.totalSpentMeta, 0)
    )}</td>

    <td><span className="amount-doller">$ </span>{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      employeeData.reduce((acc, data) => acc + data.totalSpentGoogle, 0)
    )}</td>

    <td><span className="amount-doller">$ </span>{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      employeeData.reduce((acc, data) => acc + data.tiktokCost, 0)
    )}</td>

    <td><span className="amount-doller">$ </span>{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      employeeData.reduce((acc, data) => acc + data.totalSpentPage, 0)
    )}</td>

    <td><span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((acc, data) => acc + (data.totalGoogle + data.totalMeta), 0)
    )}</td>

    <td><span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)
    )}</td>

    <td><span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((acc, data) => acc + data.totalClientPay, 0)
    )}</td>

    <td><span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((acc, data) => acc + ((data.totalSpentMeta + data.totalSpentGoogle + data.tiktokCost + data.totalSpentPage) * costRate + data.totalAdminPayCharge + data.totalSellerys), 0)
    )}</td>

    <td className='text-center'><span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((acc, data) => acc + (data.totalClientPay - data.totalAdminPay ), 0)
    )}</td>


<td className='text-center'>
<span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    ( // Ensure positive value
      employeeData.reduce((acc, data) => 
        acc + (data.totalAdminPay - ((data.totalSpentMeta + data.totalSpentGoogle + data.tiktokCost + data.totalSpentPage) * costRate + data.totalAdminPayCharge + data.totalSellerys)), 0
      )
    )
  )}
</td>

<td className='text-center'>
<span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    ( // Ensure positive value
      employeeData.reduce((acc, data) => 
        acc + (data.totalAdminPay - (data.totalGoogle + data.totalMeta)), 0
      )
    )
  )}
</td>



  </tr>
          </tfoot>


          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketerSummery;