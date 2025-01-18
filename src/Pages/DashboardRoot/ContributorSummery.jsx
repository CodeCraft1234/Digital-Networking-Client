import  { useState, useMemo, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import useAllEmployee from '../../Hook/useAllEmployee';
import useUsers from '../../Hook/useUsers';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import useMyUser from '../../Hook/useMyUser';
import SummaryCard from '../Home/SummeryCard';
import useMyContributorPayment from '../../Hook/useMyContributorPayments';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const ContributorSummery = () => {
  const {user}=useContext(AuthContext)
  const [users]=useUsers()
  const [allEmployees]=useAllEmployee()
  const {userr}=useUserr(user?.email)
  
  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem(`ac5${user?.email}`) || "all" 
  : localStorage.getItem(`ac5${user?.email}`) || user?.email; 

  const [selectedEmployee, setSelectedEmployee] = useState(initialTab3);
  const [myUser]=useMyUser(selectedEmployee)
  const [MyContributorPayment]=useMyContributorPayment(selectedEmployee)

  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem(`ac5${user?.email}`, tab); 
  };

  const getRecentMonths = () => {
    const today = new Date();
    let monthsList = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthsList.push(month.toLocaleString('default', { month: 'long' }));
    }
    return monthsList.reverse();
  };

  const recentMonths = getRecentMonths();

  const employeeData = useMemo(() => {
    const relevantUsers = selectedEmployee
      ? myUser.filter(u => u.role === 'contributor')
      : myUser.filter(u => u.role === 'contributor')

    return relevantUsers.flatMap(user => {

      const paymentByMonth = MyContributorPayment.filter(m=>m.status === 'Approved')
      .reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.payAmount);
        return acc;
      }, {});

      return recentMonths.map(month => {
        const monthlySpentData = (user?.monthlySpent2 || [])
        .filter(spent =>
          new Date(spent.date).toLocaleString('default', { month: 'long' }) === month
        )
        .sort((a, b) => {
          if (a.accountName < b.accountName) return -1;
          if (a.accountName > b.accountName) return 1;
          return new Date(a.date) - new Date(b.date);
        })
        .reduce((acc, current) => {
          const existingAccount = acc.find(item => item.accountName === current.accountName);
          if (existingAccount) {
            if (new Date(current.date) > new Date(existingAccount.date)) {
              acc = acc.filter(item => item.accountName !== existingAccount.accountName); 
              acc.push(current); 
            }
          } else {
            acc.push(current); 
          }
          return acc;
        }, []);
      
      const totalSpent = monthlySpentData.reduce((acc, spent) => acc + spent.totalSpentt, 0);
        const selleryData = (user?.sellery || []).filter(sell => sell.month === month);
        const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
        const totalAdminPay = paymentByMonth[month] || 0;
        

        return {
          month,
          totalSpent,
          totalSellery,
          totalBonus,
          totalBill: totalSpent * 125,
          totalDue: totalSpent * 125 - totalAdminPay,
          totalSelleryPaid: totalSpent * 7 - totalSellery,
          totalAdminPay,
        };
      }).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month)); // Sort by month
    });
  }, [allEmployees, selectedEmployee,myUser, MyContributorPayment, recentMonths]);

  return (
    <div className=''>
      <Helmet>
        <title>Summery | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      
<div  className="grid grid-cols-2  rounded-lg md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around">

<SummaryCard title="Total Spent" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2))} />
<SummaryCard title="Total BDT" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalBill, 0).toFixed(0))} />
<SummaryCard title="Contributor Pay" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(0))} />

<SummaryCard
  title={(() => {
    const result =
      employeeData.reduce((acc, data) => acc + data.totalBill, 0) -
      employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0);
    if (result < 0) {
      return "Employee Advance"; // Show this when the result is negative
    } else if (result > 0) {
      return "Employee Due"; // Show this when the result is positive
    } else {
      return "Employee Clear"; // Show this when the result is 0
    }
  })()}
  value={new Intl.NumberFormat("en-IN").format(
    Math.abs(
      employeeData.reduce((acc, data) => acc + data.totalBill, 0) -
      employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)
    ).toFixed(0)
  )}
/>

</div>

      <div className="side-space mt-5">

      <div className="w-full lg:w-auto mb-5 flex justify-start gap-3">
  {userr?.role === "admin" ? (
    <div className="flex mt-1.5 justify-center">
      <select
        className="select2"
        value={selectedEmployee}
        onChange={(e) => changeTab(e.target.value)}
      >
        {users
          .filter((u) => u.role === "contributor")
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
     
      <div  className="table-div ">
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1">
              <th>Month</th>
              <th>Total Spend</th>
              <th>Total BDT</th>
              <th>Contributor Pay</th>
              <th>Contributor Due</th>
            </tr>
          </thead>
          <tbody>
          {employeeData.map((data, index) => (
    <tr
    key={data._id}
    className={`tr2`}
  >
      
      <td >{data.month}</td>

<td >
  ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.totalSpent)}
</td>

<td>
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalBill)}
</td>
<td>
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalAdminPay)}
</td>

<td>
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalBill - data.totalAdminPay)}
</td> 
    </tr>
  ))}


</tbody>
<tfoot className=" font-bold ">
  <tr className='tr1'>
    <td className="text-right " colSpan="1">Total</td>
    <td>
  $ {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    employeeData.reduce((acc, data) => acc + data.totalSpent, 0)
  )}
</td>
    <td>
    ৳ {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(
    employeeData.reduce((acc, data) => acc + data.totalBill, 0)
  )}
</td>

<td>
  ৳ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)
  )}
</td>

<td>
  ৳ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format( employeeData.reduce((acc, data) => acc + data.totalBill, 0) -  employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)
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

export default ContributorSummery;
