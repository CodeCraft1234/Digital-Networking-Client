import { useState, useEffect } from "react";
import useUsers from "../../Hook/useUsers";
import useUsersSellery from "../../Hook/useUsersSellery";
import SummaryCard from "../Home/SummeryCard";
import { FaTiktok } from "react-icons/fa";
import { SiGoogleads, SiMeta } from "react-icons/si";
import useRates from "../../Hook/useRates";
import useClientsDueAvance from "../../Hook/useClientDueAvance";

const TotalSummery = () => {
  const [users] = useUsers();
  const [employeeData, setEmployeeData] = useState([]);
  const [usersSellery] = useUsersSellery("all");

  console.log(usersSellery);

  useEffect(() => {
    const aggregatedData = usersSellery?.map((user) => {

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
  }, [users, usersSellery]);

  const { rates } = useRates();
  const [costRate, setCostRate] = useState(rates?.costRate || ""); 
  const [metaRate, setMetaRate] = useState(rates?.metaRate || ""); 
  const [googleRate, setGoogleRate] = useState(rates?.googleRate || ""); 
  const [tiktokRate, setTiktokRate] = useState(rates?.tiktokRate || ""); 
  
  useEffect(() => {
    setCostRate(rates?.costRate || "");
    setMetaRate(rates?.metaRate || "");
    setGoogleRate(rates?.googleRate || "");
    setTiktokRate(rates?.tiktokRate || "");
  }, [rates]);

  const { clientsDueAdvance } = useClientsDueAvance();

  return (
    <div className="text-black">
      <div className="grid grid-cols-3 rounded-lg md:grid-cols-3 lg:grid-cols-7 text-black sm:grid-cols-2 gap-5 justify-around">
  <SummaryCard
    title="Total Spend"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.totalSpent + user?.totalPageSpent || 0), 0)
    )}
  />
  <SummaryCard
    title="Total BDT"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((sum, user) => sum + ((parseFloat(user?.totalSpent || 0) + parseFloat(user?.totalPageSpent || 0)) * costRate), 0)
    )}
  />
  <SummaryCard
    title="Total Cost"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((sum, user) => sum + (((parseFloat(user?.totalSpent + user?.tiktokCost || 0) + parseFloat(user?.totalPageSpent || 0)) * costRate) + (parseFloat(user?.totalSpent || 0) * 7) + parseFloat(user?.charge || 0)), 0)
    )}
  />
  <SummaryCard
    title="Income"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.adminPay || 0), 0)
    )}
  />
  <SummaryCard
    title="Client Due"
    value={new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.totalDue|| 0), 0).toFixed(0))}
  />
<SummaryCard
  title={
    employeeData.reduce((sum, user) => sum + (
      parseFloat(user?.adminPay || 0) - ( ((parseFloat(user?.totalSpent + user?.tiktokCost || 0) + parseFloat(user?.totalPageSpent || 0)) * costRate) +
      (parseFloat(user?.totalSpent || 0) * 7) +
      parseFloat(user?.charge || 0))
    ), 0) >= 0 ? "Profit" : "Loss"
  }
  value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    employeeData.reduce((sum, user) => sum + (
     
      parseFloat(user?.adminPay || 0) - ( ((parseFloat(user?.totalSpent + user?.tiktokCost || 0) + parseFloat(user?.totalPageSpent || 0)) * costRate) +
      (parseFloat(user?.totalSpent || 0) * 7) +
      parseFloat(user?.charge || 0))
    ), 0)
  )}
/>


<SummaryCard
  title={
    employeeData.reduce((sum, user) => sum + (
  
      parseFloat(user?.adminPay || 0) -     ((parseFloat(user?.totalMetaSpent || 0) * metaRate) + 
      (parseFloat(user?.totalGoogleSpent || 0) * googleRate))
    ), 0) >= 0 ? "Employee ADV" : "Employee DUE"
  }
  value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    employeeData.reduce((sum, user) => sum + (
 
      parseFloat(user?.adminPay || 0) -      ((parseFloat(user?.totalMetaSpent || 0) * metaRate) + 
      (parseFloat(user?.totalGoogleSpent || 0) * googleRate))
    ), 0)
  )}
/>




</div>

      <div
        className="px-5 py-5 mt-5 rounded-md"
        style={{ backgroundColor: "var(--bg-color3)", color: "var(--text-color)", border: "var(--border)" }}
      >
        <div className="table-div" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
        <table className="min-w-full text-center">
  <thead>
    <tr className="tr1">
    
      <th>Employee Name</th>
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
   
      <th>Total Spend</th>
      <th>Spend BDT</th>
     
      <th>Total Cost</th>
      <th>Income</th>
      <th className="text-center">Client Due</th>
      <th className="text-center">Loss\Profit</th>
      <th className="text-center">Due\Adv</th>
    </tr>
  </thead>
  
  <tbody className="text-black">
    {employeeData.map((user, index) => {
      const totalSpent = parseFloat(user?.totalSpent || 0);
      const totalMetaSpent = parseFloat(user?.totalMetaSpent || 0);
      const totalPageSpent = parseFloat(user?.totalPageSpent || 0);
      const totalGoogleSpent = parseFloat(user?.totalGoogleSpent || 0);
      const spendBDT = (totalMetaSpent  * metaRate) + (totalGoogleSpent * googleRate)  
      const salary = parseFloat(user?.totalSpent * 7 || 0);
      const charge = parseFloat(user?.charge || 0);
      const adminPay = parseFloat(user?.adminPay || 0);
      const tiktokCost = parseFloat(user?.tiktokCost  || 0) * costRate;
      const totalCast = ((totalSpent + totalPageSpent) * costRate ) + tiktokCost  + salary + charge;
      const profitLoss =  adminPay - totalCast ; 
      const employeeDue =   adminPay - spendBDT  ; 

      return (
        <tr key={user?._id} className="tr2">
         
          <td>
            <div className="flex justify-start items-center gap-1">
              <img className="h-10 w-10 rounded-full flex justify-center" src={user.photo} alt="" />
              <span>{user.name}</span>
            </div>
          </td>
          
          <td><span className="amount-doller">$ </span>{totalMetaSpent.toLocaleString('en-IN')}</td>
          <td><span className="amount-doller">$ </span>{totalGoogleSpent.toLocaleString('en-IN')}</td>
          <td><span className="amount-doller">$ </span>{user?.tiktokCost}</td>
          <td><span className="amount-doller">$ </span>{totalPageSpent.toLocaleString('en-IN')}</td>
          <td><span className="amount-doller">$ </span>{totalSpent.toLocaleString('en-IN')}</td>
          <td><span className="amount-taka">৳ </span> {Number(spendBDT.toFixed(0)).toLocaleString('en-IN')}</td>
<td><span className="amount-taka">৳ </span> {Number(totalCast.toFixed(0)).toLocaleString('en-IN')}</td>
<td><span className="amount-taka">৳ </span> {Number(adminPay.toFixed(0)).toLocaleString('en-IN')}</td>
<td><span className="amount-taka">৳ </span> {Number(user?.totalDue.toFixed(0)).toLocaleString('en-IN')}</td>

          <td className='text-center'>
  <span className={
    (profitLoss.toFixed(0).toLocaleString('en-IN'))   > 0
      ? 'bg-green-700 px-3 rounded-lg py-1.5 text-white'
      : (profitLoss.toFixed(0).toLocaleString('en-IN'))  < 0
      ? 'bg-red-800 px-3 rounded-lg py-1.5 text-white'
      : 'bg-yellow-300 px-3 rounded-lg py-1.5 text-black'
  }>
    <span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(profitLoss.toFixed(0).toLocaleString('en-IN')
    )}
  </span>
          </td>
          <td className='text-center'>
  <span className={
    (employeeDue.toFixed(0).toLocaleString('en-IN'))   > 0
      ? 'bg-green-700 px-3 rounded-lg py-1.5 text-white'
      : (employeeDue.toFixed(0).toLocaleString('en-IN'))  < 0
      ? 'bg-red-800 px-3 rounded-lg py-1.5  text-white'
      : 'bg-yellow-300 px-3 rounded-lg py-1.5  text-black'
  }>
    <span className="amount-taka">৳ </span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(employeeDue.toFixed(0).toLocaleString('en-IN')
    )}
  </span>
          </td>
         
        </tr>
      );
    })}
  </tbody>

  <tfoot className="font-bold">
  <tr className="tr1">
    <td className="text-right" colSpan="1">Total:</td>
    <td><span className="amount-doller">$ </span> {new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.totalMetaSpent || 0), 0)
    )}</td>

    <td><span className="amount-doller">$ </span> {new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.totalGoogleSpent || 0), 0)
    )}</td>

    <td><span className="amount-doller">$ </span> {new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.tiktokCost || 0), 0)
    )}</td>

    <td><span className="amount-doller">$ </span> {new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.totalPageSpent || 0), 0)
    )}</td>

    <td><span className="amount-doller">$ </span> {new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.totalSpent || 0), 0)
    )}</td>

    {/* Total Spend in BDT */}
    <td><span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + (
        (parseFloat(user?.totalMetaSpent || 0) * metaRate) + 
        (parseFloat(user?.totalGoogleSpent || 0) * googleRate)
      ), 0).toFixed(0))
    }</td>

    {/* Total Cast */}
    <td><span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + (
        ((parseFloat(user?.totalSpent || 0) + parseFloat(user?.totalPageSpent + user?.tiktokCost  || 0)) * costRate) + 
        (parseFloat(user?.totalSpent || 0) * 7) + 
        parseFloat(user?.charge || 0)
      ), 0).toFixed(0))
    }</td>

    {/* Total Admin Pay */}
    <td><span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.adminPay || 0), 0).toFixed(0))
    }</td>

    <td><span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.totalDue|| 0), 0).toFixed(0))
    }</td>


{/* Total Profit/Loss */}
<td className="text-center">
  <span>
  <span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + (
        parseFloat(user?.adminPay || 0) - (
          ((parseFloat(user?.totalSpent || 0) + parseFloat(user?.totalPageSpent  || 0)) * costRate) + 
          (parseFloat(user?.totalSpent || 0) * 7) + 
          (parseFloat(user?.tiktokCost || 0) * costRate) + 
          parseFloat(user?.charge || 0)
        )
      ), 0).toFixed(0)) // No Math.abs used, so negatives show as they are
    }
  </span>
</td>
{/* Total Due/Adv */}
<td className="text-center">
  <span>
  <span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-BN').format(
      employeeData.reduce((sum, user) => sum + (
     
        parseFloat(user?.adminPay || 0) -    ((parseFloat(user?.totalMetaSpent || 0) * metaRate) + 
        (parseFloat(user?.totalGoogleSpent || 0) * googleRate))
      ), 0).toFixed(0))
    }
  </span>
</td>





  </tr>
</tfoot>




</table>

        </div>
      </div>
    </div>
  );
};

export default TotalSummery;
