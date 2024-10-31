import { useState, useMemo, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import useUsers from '../../Hook/useUsers';
import useEmployeePayment from '../../Hook/useEmployeePayment';
import useAdsPayment from '../../Hook/useAdsPayment';
import { AuthContext } from '../../Security/AuthProvider';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 31 }, (_, i) => 2020 + i); // Generate years from 2020 to 2050

const ContriSummery = () => {
  const [users] = useUsers();
  const {user}=useContext(AuthContext)
  const [employeePayment] = useEmployeePayment();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Add state to manage selected year
  const [adsPayment, refetch] = useAdsPayment();

  const getRecentMonths = () => {
    return months; // Show all months for the selected year
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value)); // Update year based on user selection
  };

  const recentMonths = getRecentMonths();

  const employeeData = useMemo(() => {
    // Filter relevant users based on role and user email if provided
    const relevantUsers = user?.email
      ? users.filter(u => u.role === 'contributor' && u.email === user.email)
      : users.filter(u => u.role === 'contributor');
  
    // Map over each user to accumulate payment, spent, and sellery data
    return relevantUsers.flatMap(user => {
      // Filter ads payment by employee email and selected year
      const employeePayments = adsPayment.filter(
        payment => payment.employeeEmail === user.email && new Date(payment.date).getFullYear() === selectedYear
      );
  
      // Calculate total payment by month for each employee
      const paymentByMonth = employeePayments.reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.payAmount);
        return acc;
      }, {});
  
      // Generate data by recent months
      return recentMonths.map(month => {
        // Filter monthly spent data by month and selected year
        const monthlySpentData = (user.monthlySpent || []).filter(spent =>
          new Date(spent.date).toLocaleString('default', { month: 'long' }) === month &&
          new Date(spent.date).getFullYear() === selectedYear
        );
  
        // Filter sellery data by month and selected year
        const selleryData = (user.sellery || []).filter(sell =>
          sell.month === month && sell.year === selectedYear
        );
  
        // Calculate totals
        const totalSpent = monthlySpentData.reduce((acc, spent) => acc + parseFloat(spent.totalSpentt), 0);
        const totalDollerRate = monthlySpentData.reduce((acc, spent) => acc + parseInt(spent.dollerRate), 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
        const totalAdminPay = paymentByMonth[month] || 0;
        
        // Calculate total bill
        const totalBill = monthlySpentData.length > 0
          ? totalSpent * (totalDollerRate / monthlySpentData.length)
          : 0;
  
        // Return month data with calculations
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
  }, [users, user?.email, adsPayment, recentMonths, selectedYear]);
  

  // Data for the cards (across all years)
  const totalCardData = useMemo(() => {
    // Filter relevant users based on role and email if provided
    const relevantUsers = user?.email
      ? users.filter(u => u.role === 'contributor' && u.email === user?.email)
      : users.filter(u => u.role === 'contributor');
  
    return relevantUsers.flatMap(user => {
      // Filter ads payments for each user by email and selected year
      const employeePayments = adsPayment.filter(
        payment => payment.employeeEmail === user.email
      );
  
      // Calculate total payment by month for each employee
      const paymentByMonth = employeePayments.reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.payAmount);
        return acc;
      }, {});
  
      // Generate data by recent months
      return recentMonths.map(month => {
        // Filter monthly spent data by month
        const monthlySpentData = (user.monthlySpent || []).filter(spent =>
          new Date(spent.date).toLocaleString('default', { month: 'long' }) === month
        );
  
        // Filter sellery data by month
        const selleryData = (user.sellery || []).filter(sell => sell.month === month);
  
        // Calculate totals
        const totalSpent = monthlySpentData.reduce((acc, spent) => acc + parseFloat(spent.totalSpentt), 0);
        const totalDollerRate = monthlySpentData.reduce((acc, spent) => acc + parseInt(spent.dollerRate), 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
        const totalAdminPay = paymentByMonth[month] || 0;
        
        // Calculate total bill
        const totalBill = monthlySpentData.length > 0
          ? totalSpent * (totalDollerRate / monthlySpentData.length)
          : 0;
  
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
  }, [users, user?.email, adsPayment, recentMonths, selectedYear]);
  return (
    <div className=' m-5'>
      <Helmet>
        <title>Activity | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

    

      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }} className="grid rounded-lg p-5 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around">

        {/* Cards use totalCardData for totals across all years */}
        <div className="px-5 py-10 rounded-2xl bg-green-500 text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Spent</h2>
          <p className="lg:text-2xl text-xl font-bold mt-2">
            $ {new Intl.NumberFormat('en-IN').format(totalCardData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2))}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-blue-600 text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total BDT</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
            <span className="lg:text-2xl text-xl font-extrabold">৳ </span>
            {new Intl.NumberFormat('en-IN').format(totalCardData.reduce((acc, data) => acc + data.totalBill, 0).toFixed(0))}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-teal-500 text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Employee Pay</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
            <span className="lg:text-2xl text-xl font-extrabold">৳ </span>
            {new Intl.NumberFormat('en-IN').format(totalCardData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(0))}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-red-500 text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Due</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
            <span className="lg:text-2xl text-xl font-extrabold">৳ </span>
            {new Intl.NumberFormat('en-IN').format((totalCardData.reduce((acc, data) => acc + data.totalBill, 0) - totalCardData.reduce((acc, data) => acc + data.totalAdminPay, 0)).toFixed(0))}
          </p>
        </div>
      </div>

      <div className='px-5 py-5 mt-5 rounded-lg' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }}>
      <div className='flex justify-start mb-5'>
        <select
         style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
          value={selectedYear}
          onChange={handleYearChange}
          className="p-2 border rounded-lg"
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

        <div className="overflow-x-auto rounded-xl text-center" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
          <table className="min-w-full text-center">
            <thead>
              <tr style={{ border: 'var(--border)', color: 'var(--text-color)' }}>
                <th style={{ border: 'var(--border)' }} className="p-3">SL</th>
                <th style={{ border: 'var(--border)' }} className="p-3">Month</th>
                <th style={{ border: 'var(--border)' }} className="p-3">Total Spent</th>
                <th style={{ border: 'var(--border)' }} className="p-3">Total BDT</th>
                <th style={{ border: 'var(--border)' }} className="p-3">Admin Payment</th>
                <th style={{ border: 'var(--border)' }} className="p-3">Due</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((data, index) => (
                <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)' }} key={data._id}>
                  <td style={{ border: 'var(--border)' }} className="p-3">{index + 1}</td>
                  <td style={{ border: 'var(--border)' }} className="p-3">{data.month}</td>
                  <td style={{ border: 'var(--border)' }} className="p-3">${data.totalSpent.toFixed(2)}</td>
                  <td style={{ border: 'var(--border)' }} className="p-3">৳{data.totalBill.toFixed(0) || 0}</td>
                  <td style={{ border: 'var(--border)' }} className="p-3">৳{data.totalAdminPay.toFixed(0)}</td>
                  <td style={{ border: 'var(--border)' }} className="p-3">
                    ৳{(parseFloat(data.totalBill || 0) - parseFloat(data.totalAdminPay || 0)).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-bold">
              <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
                <td style={{ border: 'var(--border)' }} className="p-3 text-right" colSpan="2">Total</td>
                <td style={{ border: 'var(--border)' }} className="p-3">${employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)}</td>
                <td style={{ border: 'var(--border)' }} className="p-3">৳{employeeData.reduce((acc, data) => acc + data.totalBill, 0).toFixed(0)}</td>
                <td style={{ border: 'var(--border)' }} className="p-3">৳{employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(0)}</td>
                <td style={{ border: 'var(--border)' }} className="p-3">
                  ৳{(employeeData.reduce((acc, data) => acc + (data.totalBill || 0), 0) - employeeData.reduce((acc, data) => acc + (data.totalAdminPay || 0), 0)).toFixed(0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContriSummery;
