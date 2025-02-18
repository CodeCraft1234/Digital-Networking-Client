import { useState, useMemo, useContext } from 'react';
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

  console.log(myClientsTotalTiktokCostMonth,myClientsTotalMonth);

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

  const recentMonths = getRecentMonths();

  const employeeData = useMemo(() => {
    if (!myUser || !recentMonths) return [];

    return recentMonths.map(month => {
      const aggregatedData = allEmployees.reduce((acc, user) => {

        const totalSpentMeta = parseFloat(myUser.totalSpentMeta?.[month] || 0);
        const totalSpentGoogle = parseFloat(myUser.totalSpentGoogle?.[month] || 0);
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
        acc.totalSpent = totalSpent;
        acc.totalSellery += totalSellery;
        acc.totalBonus += totalBonus;
        acc.totalAdminPay = totalAdminPay;
        acc.totalAdminPayCharge = totalAdminPayCharge;
        acc.totalClientPay = totalClientPay;
        acc.tiktokCost = totalClientTiktokCost;

        return acc;
      }, {
        month,
        totalSpentMeta: 0,
        totalSpentGoogle: 0,
        totalSpent: 0,
        totalSellery: 0,
        totalBonus: 0,
        totalAdminPay: 0,
        totalAdminPayCharge: 0,
        totalClientPay: 0,
        tiktokCost: 0,
      });

      aggregatedData.totalBill = aggregatedData.totalSpent * 142 ;
      aggregatedData.totalMeta = aggregatedData.totalSpentMeta * 142;
      aggregatedData.totalGoogle = aggregatedData.totalSpentGoogle * 145;
      aggregatedData.totalDue = aggregatedData.totalSpent * 142 - aggregatedData.totalAdminPay;
      aggregatedData.totalSelleryPaid = aggregatedData.totalSpent * 7 - aggregatedData.totalSellery;

      return aggregatedData;
    }).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
  }, [myUser, selectedEmployee, adminPayTotalMonthly, myClientsTotalMonth,myClientsTotalTiktokCostMonth, recentMonths]);

  const totalSpent = employeeData.reduce((acc, data) => acc + data.totalSpent, 0);
  const totalBill = employeeData.reduce((acc, data) => acc + data.totalBill, 0);
  const totalClientPay = myClientsTotal.total || 0;
  const tiktokCost = myClientsTotal.tiktokCost || 0;

  const employeeDue = totalBill - employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0);
  const clientDue = totalBill - totalClientPay;

  return (
    <div>
      <Helmet>
        <title>Summery | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="grid grid-cols-2 rounded-lg md:grid-cols-2 lg:grid-cols-6 text-black sm:grid-cols-2 gap-5 justify-around">
        <SummaryCard title="Total Spend" value={new Intl.NumberFormat('en-IN').format(totalSpent.toFixed(2))} />
        <SummaryCard title="Total BDT" value={new Intl.NumberFormat('en-IN').format(totalBill.toFixed(0))} />
        <SummaryCard title="Employee Pay" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0))} />
        <SummaryCard title="Client Pay" value={new Intl.NumberFormat('en-IN').format(totalClientPay)} />
        <SummaryCard
          title={employeeDue < 0 ? "Em. Advance" : employeeDue > 0 ? "Em. Due" : "Em. Clear"}
          value={new Intl.NumberFormat('en-IN').format(Math.abs(employeeDue).toFixed(0))}
        />
        <SummaryCard
          title={clientDue < 0 ? "Client Advance" : clientDue > 0 ? "Client Due" : "Client Clear"}
          value={new Intl.NumberFormat('en-IN').format(Math.abs(clientDue).toFixed(0))}
        />
      </div>

      <div className="side-space mt-5">
        <div className="w-full lg:w-auto mb-5 flex justify-start gap-3">
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
        </div>

        <div className="table-div">
          <table className="min-w-full text-center">
            <thead>
              <tr className="tr1">
                <th>Month</th>
                <th>Meta Spend</th>
                <th>Google Spend</th>
                <th>Tiktok Cost</th>
                <th>Total BDT</th>
                <th>Admin Pay</th>
                <th>Charge</th>
                <th>Client Pay</th>
                <th className='text-center'>Due/Adv.</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((data, index) => (
                <tr key={index} className="tr2">
                  <td>{data.month}</td>
                  <td>${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.totalSpentMeta)}</td>
                  <td>${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.totalSpentGoogle)}</td>
                  <td>${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.tiktokCost.toFixed(2))}</td>
                  <td>৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalGoogle + data.totalMeta)}</td>
                  <td>৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalAdminPay)}</td>
                  <td>৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalAdminPayCharge)}</td>
                  <td>৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalClientPay)}</td>
                  <td className='text-center'>
                    <span className={
                        data.totalAdminPay - (data.totalGoogle + data.totalMeta)  > 0
                        ? 'bg-green-700 px-4 rounded-lg py-2 font-bold text-white'
                        : data.totalAdminPay - (data.totalGoogle + data.totalMeta) < 0
                        ? 'bg-red-800 px-4 rounded-lg py-2 font-bold text-white'
                        : 'bg-yellow-300 px-4 rounded-lg py-2 font-bold text-black'
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
                <td>${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(employeeData.reduce((acc, data) => acc + data.totalSpentMeta, 0))}</td>
                <td>${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(employeeData.reduce((acc, data) => acc + data.totalSpentGoogle, 0))}</td>
                <td>${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(employeeData.reduce((acc, data) => acc + data.tiktokCost, 0))}</td>
                <td>৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(employeeData.reduce((acc, data) => acc + data.totalGoogle, 0) + employeeData.reduce((acc, data) => acc + data.totalMeta, 0))}</td>
                <td>৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0))}</td>
                <td>৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(employeeData.reduce((acc, data) => acc + data.totalAdminPayCharge, 0))}</td>
                <td>৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(totalClientPay)}</td>
                <td>৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(totalClientPay - employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketerSummery;