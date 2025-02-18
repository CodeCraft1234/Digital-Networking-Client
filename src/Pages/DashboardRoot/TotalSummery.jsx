import { useState, useEffect } from "react";
import useUsers from "../../Hook/useUsers";
import useUsersSellery from "../../Hook/useUsersSellery";
import SummaryCard from "../Home/SummeryCard";

const TotalSummery = () => {
  const [users] = useUsers();
  const [employeeData, setEmployeeData] = useState([]);
  const [usersSellery] = useUsersSellery("all");

  useEffect(() => {
    const aggregatedData = usersSellery?.map((user) => {

      const totalSpent = (user.monthlySpent || [])
        .filter((f) => f.role === "metaSpend" || f.role === "googleSpend")
        .reduce((acc, spent) => acc + spent.totalSpentt, 0);

      const totalPageSpent = (user.monthlySpent || [])
        .filter((f) => f.role === "pageSpend")
        .reduce((acc, spent) => acc + spent.totalSpentt, 0);

      return {
        ...user,
        totalSpent,
        totalPageSpent
      };
    });

    const sortedData = aggregatedData.sort((a, b) => b.totalSpent - a.totalSpent);
    setEmployeeData(sortedData);
  }, [users, usersSellery]);

  const totalSpent = employeeData.reduce((acc, user) => acc + user.totalSpent, 0);

  return (
    <div className="text-black">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 rounded-lg md:grid-cols-2 lg:grid-cols-6 text-black sm:grid-cols-2 gap-5 justify-around">
  <SummaryCard
    title="Total Spend"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.totalSpent + user?.totalPageSpent || 0), 0)
    )}
  />
  <SummaryCard
    title="Total BDT"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((sum, user) => sum + ((parseFloat(user?.totalSpent || 0) + parseFloat(user?.totalPageSpent || 0)) * 129), 0)
    )}
  />
  <SummaryCard
    title="Salary Pay"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((sum, user) => sum + (parseFloat(user?.totalSpent || 0) * 7), 0)
    )}
  />
  <SummaryCard
    title="Total Cast"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((sum, user) => sum + (((parseFloat(user?.totalSpent || 0) + parseFloat(user?.totalPageSpent || 0)) * 129) + (parseFloat(user?.totalSpent || 0) * 7) + parseFloat(user?.charge || 0)), 0)
    )}
  />
  <SummaryCard
    title="Income"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.adminPay || 0), 0)
    )}
  />
  <SummaryCard
    title="Loss"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((sum, user) => sum + (((parseFloat(user?.totalSpent || 0) + parseFloat(user?.totalPageSpent || 0)) * 129) + (parseFloat(user?.totalSpent || 0) * 7) + parseFloat(user?.charge || 0) - parseFloat(user?.adminPay || 0)), 0)
    )}
  />
</div>

      {/* Table */}


      <div
        className="px-5 py-5 mt-5 rounded-md"
        style={{ backgroundColor: "var(--bg-color3)", color: "var(--text-color)", border: "var(--border)" }}
      >
        <div className="table-div" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
        <table className="min-w-full text-center">
  <thead>
    <tr className="tr1">
      <th className="text-center">SL</th>
      <th>Employee Name</th>
      <th>Spend</th>
   
      <th>Spend BDT</th>
      <th>Salary</th>
      <th>Charge</th>
      <th>Total Cast</th>
      <th>Income</th>
      <th>Loss\Profit</th>
    </tr>
  </thead>
  
  <tbody className="text-black">
    {employeeData.map((user, index) => {
      const totalSpent = parseFloat(user?.totalSpent || 0);
      const totalPageSpent = parseFloat(user?.totalPageSpent || 0);
      const spendBDT = (totalSpent + totalPageSpent) * 129;
      const salary = parseFloat(user?.totalSpent * 7 || 0);
      const charge = parseFloat(user?.charge || 0);
      const adminPay = parseFloat(user?.adminPay || 0);
      const totalCast = spendBDT + salary + charge;
      const profitLoss =  adminPay - totalCast ; // Corrected Calculation

      return (
        <tr key={user?._id} className="tr2">
          <td className="text-center">{index + 1}</td>
          <td>
            <div className="flex justify-start items-center gap-1">
              <img className="h-10 w-10 rounded-full flex justify-center" src={user.photo} alt="" />
              <span>{user.name}</span>
            </div>
          </td>
          
          <td>${totalSpent.toLocaleString('en-IN')}</td>
      
          <td>৳{spendBDT.toFixed(0).toLocaleString('en-IN')}</td>
          <td>৳{salary.toFixed(0).toLocaleString('en-IN')}</td>
          <td>৳{charge.toFixed(0).toLocaleString('en-IN')}</td>
          <td>৳{totalCast.toFixed(0).toLocaleString('en-IN')}</td>
          <td>৳{adminPay.toFixed(0).toLocaleString('en-IN')}</td>

          <td className='text-center'>
  <span className={
    (profitLoss.toFixed(0).toLocaleString('en-IN'))   > 0
      ? 'bg-green-700 px-4 rounded-lg py-2 font-bold text-white'
      : (profitLoss.toFixed(0).toLocaleString('en-IN'))  < 0
      ? 'bg-red-800 px-4 rounded-lg py-2 font-bold text-white'
      : 'bg-yellow-300 px-4 rounded-lg py-2 font-bold text-black'
  }>
    ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(profitLoss.toFixed(0).toLocaleString('en-IN')
    )}
  </span>
</td>
         
        </tr>
      );
    })}
  </tbody>

  {/* Table Footer Calculations */}
  <tfoot className="font-bold">
  <tr className="tr1">
    <td className="text-right" colSpan="2">Total:</td>
    <td>৳ {employeeData.reduce((sum, user) => sum + parseFloat(user?.totalSpent || 0), 0).toLocaleString('en-IN')}</td>
    <td>৳ {employeeData.reduce((sum, user) => sum + ((parseFloat(user?.totalSpent || 0) + parseFloat(user?.totalPageSpent || 0)) * 129), 0).toLocaleString('en-IN')}</td>
    <td>৳ {employeeData.reduce((sum, user) => sum + (parseFloat(user?.totalSpent || 0) * 7), 0).toLocaleString('en-IN')}</td>
    <td>৳ {employeeData.reduce((sum, user) => sum + parseFloat(user?.charge || 0), 0).toLocaleString('en-IN')}</td>
    <td>৳ {employeeData.reduce((sum, user) => sum + (((parseFloat(user?.totalSpent || 0) + parseFloat(user?.totalPageSpent || 0)) * 129) + (parseFloat(user?.totalSpent || 0) * 7) + parseFloat(user?.charge || 0)), 0).toLocaleString('en-IN')}</td>
    <td>৳ {employeeData.reduce((sum, user) => sum + parseFloat(user?.adminPay || 0), 0).toLocaleString('en-IN')}</td>
    <td>৳ {employeeData.reduce((sum, user) => sum + (((parseFloat(user?.totalSpent || 0) + parseFloat(user?.totalPageSpent || 0)) * 129) + (parseFloat(user?.totalSpent || 0) * 7) + parseFloat(user?.charge || 0) - parseFloat(user?.adminPay || 0)), 0).toLocaleString('en-IN')}</td>
  </tr>
</tfoot>

</table>

        </div>
      </div>
    </div>
  );
};

export default TotalSummery;
