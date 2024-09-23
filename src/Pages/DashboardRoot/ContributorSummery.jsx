import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import useUsers from '../../Hook/useUsers';
import useEmployeePayment from '../../Hook/useEmployeePayment';
import useMpayment from '../../Hook/UseMpayment';
import useAdsPayment from '../../Hook/useAdsPayment';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const ContributorSummery = ({ email }) => {
  const [users] = useUsers();
  const [employeePayment] = useEmployeePayment();

  const getRecentMonths = () => {
    const today = new Date();
    let monthsList = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthsList.push(month.toLocaleString('default', { month: 'long' }));
    }
    return monthsList.reverse();
  };


 const  [adsPayment, refetch]=useAdsPayment()
  const recentMonths = getRecentMonths();
  const employeeData = useMemo(() => {
    const relevantUsers = email
      ? users.filter(u => u.role === 'contributor' && u.email === email)
      : users.filter(u => u.role === 'contributor');

    return relevantUsers.flatMap(user => {
      const employeePayments = adsPayment.filter(
        payment => email ? payment.employeeEmail === email : payment.employeeEmail === email
      );

      const paymentByMonth = employeePayments.reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.payAmount);
        return acc;
      }, {});

      return recentMonths.map(month => {
        const monthlySpentData = (user.monthlySpent || []).filter(spent =>
          new Date(spent.date).toLocaleString('default', { month: 'long' }) === month
        );
        const selleryData = (user.sellery || []).filter(sell => sell.month === month);
        const totalSpent = monthlySpentData.reduce((acc, spent) => acc + spent.totalSpentt, 0);
        const totalDollerRate = monthlySpentData.reduce((acc, spent) => acc + parseInt(spent.dollerRate), 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
        const totalAdminPay = paymentByMonth[month] || 0;
        
        // Calculate totalBill safely
        const totalBill = monthlySpentData.length > 0
          ? totalSpent * (totalDollerRate / monthlySpentData.length)
          : 0; // Default to 0 if no data
        
        return {
          month,
          totalSpent,
          totalBonus,
          totalBill,
          totalDue: totalSpent * 140 - totalAdminPay,
          totalAdminPay,
        };
      }).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month)); // Sort by month
    });
  }, [users, email, employeePayment, recentMonths]);

  return (
    <div className='mx-5 lg:mt-5 mb-5'>
      <Helmet>
        <title>Activity | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around ">
        <div className="px-5 py-10 rounded-2xl bg-[#91a33a] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Spent</h2>
          <p className="lg:text-xl text-xl font-bold mt-2"> $ {employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total BDT</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
            <span className="lg:text-xl text-xl font-extrabold">৳</span> {employeeData.reduce((acc, data) => acc + data.totalBill, 0).toFixed(2)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#ce1a38] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Employee Pay</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
            <span className="lg:text-xl text-xl font-extrabold">৳</span> {employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(2)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#229d9d] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Due</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
            <span className="lg:text-xl text-xl font-extrabold">৳</span> {employeeData.reduce((acc, data) => acc + data.totalBill, 0).toFixed(2) - employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto text-black text-center mt-5 rounded-xl border border-gray-600">
        <table className="min-w-full text-center bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Month</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Total BDT</th>
              <th className="p-3">Admin Payment</th>
              <th className="p-3">Due</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((data, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-200 py-2" : "bg-white py-2"}>
                <td className="p-3 border border-gray-300">{index + 1}</td>
                <td className="p-3 border border-gray-300">{data.month}</td>
                <td className="p-3 border border-gray-300">${data.totalSpent.toFixed(2)}</td>
                <td className="p-3 border border-gray-300">৳{data.totalBill.toFixed(2) || 0}</td>
                <td className="p-3 border border-gray-300">৳{data.totalAdminPay.toFixed(2)}</td>
                <td className="p-3 border border-gray-300">৳{(data.totalClientPay - data.totalAdminPay).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#05a0db] font-bold text-white">
            <tr>
              <td className="p-3 text-right border-gray-300" colSpan="2">Total</td>
              <td className="p-3 border-gray-300">${employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)}</td>
              <td className="p-3 border-gray-300">৳ {employeeData.reduce((acc, data) => acc + data.totalBill, 0).toFixed(2)}</td>
              <td className="p-3 border-gray-300">৳ {employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(2)}</td>
              <td className="p-3 border-gray-300">৳ {(employeeData.reduce((acc, data) => acc + data.totalClientPay, 0) - employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ContributorSummery;
