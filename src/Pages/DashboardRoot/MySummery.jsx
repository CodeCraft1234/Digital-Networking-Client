import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../Security/AuthProvider';
import useUsers from '../../Hook/useUsers';
import useEmployeePayment from '../../Hook/useEmployeePayment';
import useMpayment from '../../Hook/UseMpayment';
import useMyCampaingsByEmail from '../../Hook/useMyCampaignByEmail';
import useMypymentsByEmail from '../../Hook/useMyMPayments';
import useMyClientsByEmail from '../../Hook/useMyClientsByEmail';
import useMyEmployeePayments from '../../Hook/useMyemployeePayments';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const MySummery = () => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [MyEmployeePayment]=useMyEmployeePayments(user?.email)
  const [Mpayment] = useMpayment();

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(user.email);

  const [mycampaigns]=useMyCampaingsByEmail(user?.email)
  const [Mypayments]=useMypymentsByEmail(user?.email)
  const [myclients]=useMyClientsByEmail(user?.email)

  const tPay = Mypayments
      
  ?.filter(campaign => myclients.some(client => client.clientEmail === campaign.clientEmail))


  useEffect(() => {
    if (users && user) {
      const employeeList = users.filter((u) => u.role === "employee");
      setEmployees(employeeList);
    }
  }, [users, user]);

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
      ? users.filter(u => u.role === 'employee' && u.email === selectedEmployee)
      : users.filter(u => u.role === 'employee');

    return relevantUsers.flatMap(user => {

      const paymentByMonth = MyEmployeePayment.filter(m=>m.status === 'Approved')
      .reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.payAmount);
        return acc;
      }, {});

      const paymentByMonth2 = tPay.reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.amount) || 0;
        return acc;
      }, {});

      return recentMonths.map(month => {
        const monthlySpentData = (user.monthlySpent || [])
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

        const selleryData = (user.sellery || []).filter(sell => sell.month === month);
        const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
        const totalAdminPay = paymentByMonth[month] || 0;
        const totalClientPay = paymentByMonth2[month] || 0;

        return {
          month,
          totalSpent,
          totalSellery,
          totalBonus,
          totalBill: totalSpent * 140,
          totalDue: totalSpent * 140 - totalAdminPay,
          totalSelleryPaid: totalSpent * 7 - totalSellery,
          totalAdminPay,
          totalClientPay 
        };
      }).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month)); // Sort by month
    });
  }, [users, selectedEmployee, MyEmployeePayment, Mpayment, recentMonths]);



  return (
    <div className='mx-5 lg:mt-5 mb-5'>
      <Helmet>
        <title>Activity | Digital Network </title>
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

  <div className="px-5 py-10 rounded-2xl bg-[#ffb74d] text-black shadow-lg text-center">
    <h2 className="lg:text-2xl text-xl font-bold">Client Pay</h2>
    <p className="lg:text-2xl text-xl font-bold mt-2">
      <span className="text-2xl font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(
  tPay.reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
)}

    </p>
  </div>

  <div className="px-5 py-10 rounded-2xl bg-[#ce93d8] text-black shadow-lg text-center">
    <h2 className="text-xl font-bold">Employee Pay</h2>
    <p className="lg:text-2xl text-xl font-bold mt-2">
      <span className="lg:text-2xl text-xl font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(0))}
    </p>
  </div>

  <div className="px-5 py-10 rounded-2xl bg-[#e57373] text-black shadow-lg text-center">
    <h2 className="text-xl font-bold">Employee Due</h2>
    <p className="lg:text-2xl text-xl font-bold mt-2">
      <span className="lg:text-2xl text-xl font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format((employeeData.reduce((acc, data) => acc + data.totalBill, 0) - employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)).toFixed(0))}
    </p>
  </div>

  <div className="px-5 py-10 rounded-2xl bg-[#ff8a65] text-black shadow-lg text-center">
    <h2 className="text-xl font-bold">Client Due</h2>
    <p className="lg:text-2xl text-xl font-bold mt-2">
      <span className="lg:text-2xl text-xl font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format((employeeData.reduce((acc, data) => acc + data.totalBill, 0) - tPay
        .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(0)))}
    </p>
  </div>
</div>




      <div className="p-5 mt-5 rounded-lg " style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>
      <div  className="overflow-x-auto rounded-xl  text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
            
              <th className="p-3">Month</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Total BDT</th>
              <th className="p-3">Admin Payment</th>
              <th className="p-3">Client Payment</th>
              <th className="p-3">Due</th>
            </tr>
          </thead>
          <tbody>
          {employeeData.map((data, index) => (
    <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
    key={data._id}
    className={`${
      index % 2 === 0
        ? "bg-white text-center text-black border-b border-opacity-20"
        : "bg-gray-200  text-center text-black border-b border-opacity-20"
    }`}
  >
      
      <td style={{  border: 'var(--border)'}} className="p-3 border border-gray-300">{data.month}</td>
      <td style={{  border: 'var(--border)'}} className="p-3 border border-gray-300">${data.totalSpent.toFixed(2)}</td>
      <td style={{  border: 'var(--border)'}} className="p-3 border border-gray-300">৳{data.totalBill.toFixed(0)}</td>
      <td style={{  border: 'var(--border)'}} className="p-3 border border-gray-300">৳{data.totalAdminPay.toFixed(0)}</td>
      <td style={{  border: 'var(--border)'}} className="p-3 border border-gray-300">৳{data.totalClientPay.toFixed(0)}</td>
      <td style={{  border: 'var(--border)'}} className="p-3 border border-gray-300">৳{(data.totalClientPay - data.totalAdminPay).toFixed(0)}</td>
      
    </tr>
  ))}


</tbody>
<tfoot className=" font-bold ">
  <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
    <td className="p-3 text-right border-gray-300" colSpan="1">Total</td>
    <td className="p-3 border-gray-300">
      ${employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)}
    </td>
    <td className="p-3 border-gray-300">
      ৳ {employeeData.reduce((acc, data) => acc + data.totalBill, 0).toFixed(0)}
    </td>

    <td className="p-3 border-gray-300">
      ৳ {employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(0)}
    </td>

    <td className="p-3 border-gray-300">
      ৳ {tPay
        .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(0)}
    </td>

   
    <td className="p-3 border-gray-300">
      ৳ {(tPay
        .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(0) - 
          employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)).toFixed(0)}
    </td>
    
  </tr>
</tfoot>

        </table>
      </div>
    </div>
    </div>
  );
};

export default MySummery;
