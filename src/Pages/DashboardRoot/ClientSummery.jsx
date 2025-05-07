import { useContext, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import useUserr from "../../Hook/useUser";
import useAllEmployee from "../../Hook/useAllEmployee";
import useMyClientsTotalMonthAll from "../../Hook/useMyClientsTotalMonthAll";
import { SiGoogleads, SiMeta } from "react-icons/si";
import { FaTelegram, FaTiktok } from "react-icons/fa";
import SummaryCard from "../Home/SummeryCard";

const ClientSummary = () => {
  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email);
  const [allEmployees] = useAllEmployee();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState("");
  
  const initialTab = userr?.role === "admin" 
    ? localStorage.getItem(`activeTabag${user?.email}`) || "all" 
    : localStorage.getItem(`activeTabag${user?.email}`) || user?.email;
  
  const [selectedEmployee, setSelectedEmployee] = useState(initialTab);
  const [myClientsTotalMonthAll] = useMyClientsTotalMonthAll(selectedEmployee, selectedYear);

  console.log(myClientsTotalMonthAll);
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper functions to get monthly values
  const getMonthlyValue = (data, month, type) => {
    if (!data || !data[type]) return 0;
    return data[type][month] || 0;
  };

  // Calculate totals for each category
  const calculateTotal = (data, type) => {
    if (!data || !data[type]) return 0;
    return Object.values(data[type]).reduce((acc, val) => acc + val, 0);
  };

  // Main calculation function
  const calculateMonthlyData = (monthName) => {
    const metaAds = getMonthlyValue(myClientsTotalMonthAll, monthName, 'metaAdsCampaigns');
    const googleAds = getMonthlyValue(myClientsTotalMonthAll, monthName, 'googleAdsCampaigns');
    const tiktokAds = getMonthlyValue(myClientsTotalMonthAll, monthName, 'tiktokAdsCampaigns');
    const teligramAds = getMonthlyValue(myClientsTotalMonthAll, monthName, 'teligramAdsCampaigns');
    const pageService = getMonthlyValue(myClientsTotalMonthAll, monthName, 'pageService');
    const payments = getMonthlyValue(myClientsTotalMonthAll, monthName, 'payments');
    const totalBill = getMonthlyValue(myClientsTotalMonthAll, monthName, 'totalBill');
    
    const totalBDT = totalBill; // Assuming 85 BDT per dollar
    const dueAdvance = (totalBDT + pageService) - payments;

    return {
      metaAds,
      googleAds,
      tiktokAds,
      teligramAds,
      totalBDT,
      pageService,
      payments,
      dueAdvance
    };
  };

  // Calculate grand totals
  const calculateGrandTotals = () => {
    return {
      totalMeta: calculateTotal(myClientsTotalMonthAll, 'metaAdsCampaigns'),
      totalGoogle: calculateTotal(myClientsTotalMonthAll, 'googleAdsCampaigns'),
      totalBDT: (calculateTotal(myClientsTotalMonthAll, 'metaAdsCampaigns') + 
                calculateTotal(myClientsTotalMonthAll, 'googleAdsCampaigns')) * 143,
      totalServices: calculateTotal(myClientsTotalMonthAll, 'pageService'),
      totalPayments: calculateTotal(myClientsTotalMonthAll, 'payments'),
      totalDue: ((calculateTotal(myClientsTotalMonthAll, 'metaAdsCampaigns') + 
                calculateTotal(myClientsTotalMonthAll, 'googleAdsCampaigns')) * 143) + 
                calculateTotal(myClientsTotalMonthAll, 'pageService') - 
                calculateTotal(myClientsTotalMonthAll, 'payments')
    };
  };

  const grandTotals = calculateGrandTotals();

  return (
    <div className="mt-5">
     <div className="grid grid-cols-3 rounded-lg md:grid-cols-3 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around">
  <SummaryCard
    title="Total Spend"
    value={new Intl.NumberFormat('en-IN').format(
      (parseFloat(grandTotals.totalGoogle || 0) + parseFloat(grandTotals.totalMeta || 0)).toFixed(0)
    )}
  />

  <SummaryCard
    title="Total Bill"
    value={new Intl.NumberFormat('en-IN').format(
      parseFloat(grandTotals.totalBDT || 0).toFixed(0)
    )}
  />

  <SummaryCard
    title="Payment"
    value={new Intl.NumberFormat('en-IN').format(
      parseFloat(grandTotals.totalPayments || 0).toFixed(0)
    )}
  />

  <SummaryCard
    title="Due/Advance"
    value={new Intl.NumberFormat('en-IN').format(
      parseFloat(grandTotals.totalDue || 0).toFixed(0)
    )}
  />
</div>



      <div className="my-3">
          <div className="flex my-5 gap-3 justify-end items-center">
        {userr?.role === "admin" && (
          <select
            className="select2"
            value={selectedEmployee}
            onChange={(e) => {
              setSelectedEmployee(e.target.value);
              localStorage.setItem(`activeTabag${user?.email}`, e.target.value);
            }}
          >
            <option value="all">Select Digital Marketer</option>
            {allEmployees
              .filter((u) => u.role === "employee")
              .map(({ _id, email, name }) => (
                <option key={_id} value={email}>
                  {name}
                </option>
              ))}
          </select>
        )}

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
                <th>Month</th>
                <th>Service Bill</th>
                <th>Campaign Spend</th>
                <th>Total Bill</th>
                <th>Payment</th>
                <th>Due/Advance</th>
              </tr>
            </thead>
            <tbody>
              {months.map((monthName,index) => {
                const monthlyData = calculateMonthlyData(monthName);
                
                return (
                  <tr 
                  key={monthName.id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white text-left text-black border-b border-opacity-20"
                      : "bg-gray-100  text-left text-black border-b border-opacity-20"
                  }`}
                >
                     <td>
                     {monthName}
            </td>
            <td>
  <span>
    <span className="amount-taka">৳</span>
    <span className="ml-1">
      {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(monthlyData.pageService)}
    </span>
  </span>
</td>

<td>
  <span>
    <span className="amount-doller">$</span>
    <span className="ml-1">
      {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
        (monthlyData.metaAds || 0) +
        (monthlyData.googleAds || 0) +
        (monthlyData.teligramAds || 0) +
        (monthlyData.tiktokAds || 0)
      )}
    </span>
  </span>
</td>

<td>
  <span>
    <span className="amount-taka">৳</span>
    <span className="ml-1">
      {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(monthlyData.totalBDT)}
    </span>
  </span>
</td>

<td>
  <span>
    <span className="amount-taka">৳</span>
    <span className="ml-1">
      {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(monthlyData.payments)}
    </span>
  </span>
</td>

<td>
  <span className="text-md mr-1 font-extrabold">৳</span>
  {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(monthlyData.dueAdvance)}
</td>

                  </tr>
                );
              })}
              
              <tr className="tr1 font-bold">
  <td>Total</td>
  
  <td>
      <span>
        <span className="amount-taka">৳</span>{' '}
        {new Intl.NumberFormat('en-IN').format(
          parseFloat(grandTotals.pageService || 0).toFixed(0)
        )}
      </span>
    </td>
  <td>
    <span>
      <span className="amount-taka">৳</span>{' '}
      {new Intl.NumberFormat('en-IN').format(
        (parseFloat(grandTotals.totalGoogle || 0) + parseFloat(grandTotals.totalMeta || 0)).toFixed(0)
      )}
    </span>
  </td>

  <td>
    <span>
      <span className="amount-taka">৳</span>{' '}
      {new Intl.NumberFormat('en-IN').format(
        parseFloat(grandTotals.totalBDT || 0).toFixed(0)
      )}
    </span>
  </td>

  <td>
    <span>
      <span className="amount-taka">৳</span>{' '}
      {new Intl.NumberFormat('en-IN').format(
        parseFloat(grandTotals.totalPayments || 0).toFixed(0)
      )}
    </span>
  </td>

  <td>
    <span className="text-md mr-1 font-extrabold">৳</span>
    {new Intl.NumberFormat('en-IN').format(
      parseFloat(grandTotals.totalDue || 0).toFixed(0)
    )}
  </td>
</tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientSummary;

















