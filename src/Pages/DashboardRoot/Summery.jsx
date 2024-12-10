import  { useState, useMemo, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import useMyClientsByEmail from '../../Hook/useMyClientsByEmail';
import useAllEmployee from '../../Hook/useAllEmployee';
import useMyEmployeePayments from '../../Hook/useMyemployeePayments';
import useUsers from '../../Hook/useUsers';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import useMyUser from '../../Hook/useMyUser';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const Summery = () => {
  const {user}=useContext(AuthContext)
  const [users]=useUsers()
  const [allEmployees]=useAllEmployee()
  const {userr}=useUserr(user?.email)
  
  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem("a7") || "all" 
  : localStorage.getItem("a7") || user?.email; 

  const [selectedEmployee, setSelectedEmployee] = useState(initialTab3);
  const [myclients]=useMyClientsByEmail(selectedEmployee)
  const [myUser]=useMyUser(selectedEmployee)
  console.log(myUser);
  const [MyEmployeePayment]=useMyEmployeePayments(selectedEmployee)
  console.log(MyEmployeePayment);

  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem("a7", tab); 
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
      ? myUser.filter(u => u.role === 'employee')
      : myUser.filter(u => u.role === 'employee')

    return relevantUsers.flatMap(user => {

      const paymentByMonth = MyEmployeePayment.filter(m=>m.status === 'Approved')
      .reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.payAmount);
        return acc;
      }, {});

      const paymentByMonth2 = myclients
      ?.flatMap(client => client.payments || [])
      ?.reduce((acc, payment) => {
        if (payment && payment.date) {
          const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
          acc[month] = (acc[month] || 0) + (parseFloat(payment.amount) || 0);
        }
        return acc;
      }, {});
    

      return recentMonths.map(month => {
        const monthlySpentData = (user?.monthlySpent || [])
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
      const totalSpentMeta = monthlySpentData?.filter(f=>f.role === 'metaSpend').reduce((acc, spent) => acc + spent.totalSpentt, 0);
      const totalSpentGoogle = monthlySpentData?.filter(f=>f.role === 'googleSpend').reduce((acc, spent) => acc + spent.totalSpentt, 0);

        const selleryData = (user?.sellery || []).filter(sell => sell.month === month);
        const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
        const totalAdminPay = paymentByMonth[month] || 0;
        const totalClientPay = paymentByMonth2[month] || 0;

        return {
          month,
          totalSpentMeta,
          totalSpentGoogle,
          totalSpent,
          totalSellery,
          totalBonus,
          totalBill: totalSpent * 140,
          totalMeta: totalSpentMeta * 140,
          totalGoogle: totalSpentGoogle * 150,
          totalDue: totalSpent * 140 - totalAdminPay,
          totalSelleryPaid: totalSpent * 7 - totalSellery,
          totalAdminPay,
          totalClientPay 
        };
      }).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month)); // Sort by month
    });
  }, [allEmployees,myclients, selectedEmployee, MyEmployeePayment, recentMonths]);

  return (
    <div className='m-3 lg:m-5'>
      <Helmet>
        <title>Summery | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      
<div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }} className="grid grid-cols-2 p-5 rounded-lg md:grid-cols-2 lg:grid-cols-6 text-black sm:grid-cols-2 gap-5 justify-around">
  <div className="px-5 py-10 rounded-2xl bg-[#81c784] text-black shadow-lg text-center">
    <h2 className="text-xl font-bold">Total Spent</h2>
    <p className="lg:text-2xl text-xl font-bold mt-2">
      $ {new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2))}
    </p>
  </div>

  <div className="px-5 py-10 rounded-2xl bg-[#64b5f6] text-black shadow-lg text-center">
    <h2 className="text-xl font-bold">Total BDT</h2>
    <p className="lg:text-2xl text-xl font-bold mt-2">
      <span className="lg:text-2xl text-xl font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalBill, 0).toFixed(0))}
    </p>
  </div>


  <div className="px-5 py-10 rounded-2xl bg-[#ce93d8] text-black shadow-lg text-center">
    <h2 className="text-xl font-bold">Employee Pay</h2>
    <p className="lg:text-2xl text-xl font-bold mt-2">
      <span className="lg:text-2xl text-xl font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(0))}
    </p>
  </div>
  <div className="px-5 py-10 rounded-2xl bg-[#ffb74d] text-black shadow-lg text-center">
    <h2 className="lg:text-2xl text-xl font-bold">Client Pay</h2>
    <p className="lg:text-2xl text-xl font-bold mt-2">
      <span className="text-2xl font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(
  myclients
  ?.flatMap(client => client.payments || [])?.reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
)}

    </p>
  </div>



  <div className="px-5 py-10 rounded-2xl bg-[#e57373] text-black shadow-lg text-center">
  {/* Conditional Heading */}
  <h2 className="text-xl font-bold">
    {(() => {
      const result = employeeData.reduce((acc, data) => acc + data.totalBill, 0) - 
                    employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0);
      if (result < 0) {
        return "Employee Advance"; // Show this when the result is negative
      } else if (result > 0) {
        return "Employee Due"; // Show this when the result is positive
      } else {
        return "Employee Clear"; // Show this when the result is 0
      }
    })()}
  </h2>
  
  <p className="lg:text-2xl text-xl font-bold mt-2">
    <span className="lg:text-2xl text-xl font-extrabold">৳ </span> 
    {new Intl.NumberFormat('en-IN').format(
      Math.abs(
        employeeData.reduce((acc, data) => acc + data.totalBill, 0) - 
        employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)
      ).toFixed(0)
    )}
  </p>
</div>



<div className="px-5 py-10 rounded-2xl bg-[#ff8a65] text-black shadow-lg text-center">
  {/* Conditional Heading */}
  <h2 className="text-xl font-bold">
    {(() => {
      const result = employeeData.reduce((acc, data) => acc + data.totalBill, 0) - 
      myclients
      ?.flatMap(client => client.payments || [])?.reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0);

      if (result < 0) {
        return "Client Advance"; // Show this when the result is negative
      } else if (result > 0) {
        return "Client Due"; // Show this when the result is positive
      } else {
        return "Client Clear"; // Show this when the result is 0
      }
    })()}
  </h2>
  
  <p className="lg:text-2xl text-xl font-bold mt-2">
    <span className="lg:text-2xl text-xl font-extrabold">৳ </span> 
    {new Intl.NumberFormat('en-IN').format(
      Math.abs(
        employeeData.reduce((acc, data) => acc + data.totalBill, 0) - 
        myclients
  ?.flatMap(client => client.payments || [])?.reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
      ).toFixed(0)
    )}
  </p>
</div>

</div>




      <div className="p-5 mt-5 rounded-lg " style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>

      <div className="w-full lg:w-auto mb-5 flex justify-start gap-3">
  {userr?.role === "admin" ? (
    <div className="flex mt-1.5 justify-center">
      <select
        style={{
          backgroundColor: "var(--bg-color2)",
          border: "var(--border)",
          color: "var(--text-color2)",
        }}
        className="border bg-white text-black py-2 lg:w-auto w-full border-gray-400 rounded px-2"
        value={selectedEmployee}
        onChange={(e) => changeTab(e.target.value)}
      >
        <option value="all">All Employees</option>
        {users
          .filter((u) => u.role === "employee")
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
     
      <div  className="overflow-x-auto rounded-xl  text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
            
              <th className="p-3 text-left">Month</th>
              <th className="p-3 text-left">Meta Spend</th>
              <th className="p-3 text-left">Meta BDT</th>
              <th className="p-3 text-left">Google Spend</th>
              <th className="p-3 text-left">Google BDT</th>
              <th className="p-3 text-left">Total BDT</th>
              <th className="p-3 text-left">Admin Payment</th>
              <th className="p-3 text-left">Client Payment</th>
              <th className="p-3 text-left">Admin Due</th>
            </tr>
          </thead>
          <tbody>
          {employeeData.map((data, index) => (
    <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
    key={data._id}
    className={`${
      index % 2 === 0
        ? "bg-white text-left text-black border-b border-opacity-20"
        : "bg-gray-200  text-left text-black border-b border-opacity-20"
    }`}
  >
      
      <td style={{  border: 'var(--border)'}} className="p-3 border border-gray-300">{data.month}</td>

      <td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300">
  ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.totalSpentMeta)}
</td>
<td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300">
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalMeta)}
</td>
      <td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300">
  ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.totalSpentGoogle)}
</td>

<td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300">
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalGoogle)}
</td>
<td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300">
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalGoogle + data.totalMeta)}
</td>
<td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300">
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalAdminPay)}
</td>
<td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300">
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalClientPay)}
</td>
<td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300">
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalClientPay - data.totalAdminPay)}
</td>

      
    </tr>
  ))}


</tbody>
<tfoot className=" font-bold ">
  <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
    <td className="p-3 text-right border-gray-300" colSpan="1">Total</td>
    <td className="p-3 text-start border-gray-300">
  $ {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    employeeData.reduce((acc, data) => acc + data.totalSpentMeta, 0)
  )}
</td>
    <td className="p-3 text-start border-gray-300">
    ৳ {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(
    employeeData.reduce((acc, data) => acc + data.totalMeta, 0)
  )}
</td>
    <td className="p-3 text-start border-gray-300">
  $ {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    employeeData.reduce((acc, data) => acc + data.totalSpentGoogle, 0)
  )}
</td>
    <td className="p-3 text-start border-gray-300">
    ৳ {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(
    employeeData.reduce((acc, data) => acc + data.totalGoogle, 0)
  )}
</td>
<td className="p-3 text-start border-gray-300">
  ৳ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    employeeData.reduce((acc, data) => acc + data.totalGoogle , 0) + 
    employeeData.reduce((acc, data) => acc + data.totalMeta , 0)
  )}
</td>
<td className="p-3 text-start border-gray-300">
  ৳ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)
  )}
</td>
<td className="p-3 text-start border-gray-300">
  ৳ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    myclients
    ?.flatMap(client => client.payments || [])?.reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
  )}
</td>
<td className="p-3 text-start border-gray-300">
  ৳ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    myclients
    ?.flatMap(client => client.payments || [])?.reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0) -
    employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)
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

export default Summery;
