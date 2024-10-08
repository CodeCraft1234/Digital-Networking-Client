import  { useState, useEffect } from 'react';
import useUsers from '../../Hook/useUsers';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useEmployeePayment from '../../Hook/useEmployeePayment';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];
const years = Array.from({ length: 31 }, (_, index) => 2020 + index); // Creates an array of years from 2020 to 2050

const Sellery = () => {
  const [employeePayment] = useEmployeePayment();
  const [users] = useUsers();
  const [employeeData, setEmployeeData] = useState([]);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const initialTab2 = localStorage.getItem("activeTaballselleryMonth") ;
  const [sortMonth, setSortMonth] = useState(initialTab2 || currentMonth);
  
  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballselleryMonth", tab); 
  };

  useEffect(() => {
    const employees = users.filter(user => user.role === 'employee');
    const aggregatedData = employees.map(user => {
      const monthlySpentData = (user.monthlySpent || []).filter(spent => {
        const spentDate = new Date(spent.date);
        return spentDate.toLocaleString('default', { month: 'long' }) === sortMonth && spentDate.getFullYear() === selectedYear;
      });

      const selleryData = (user.sellery || []).filter(sell => sell.month === sortMonth);
      const adminPayData = (user.adminPay || []).filter(pay => {
        const payDate = new Date(pay.date);
        return payDate.toLocaleString('default', { month: 'long' }) === sortMonth && payDate.getFullYear() === selectedYear;
      });

      const employeePaymentData = employeePayment.filter(payment => {
        const paymentDate = new Date(payment.date);
        return (
          payment.employeeEmail === user.email &&
          paymentDate.toLocaleString('default', { month: 'long' }) === sortMonth &&
          paymentDate.getFullYear() === selectedYear
        );
      });

      const totalSpent = monthlySpentData.reduce((acc, spent) => acc + spent.totalSpentt, 0);
      const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
      const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
      const totalAdminPay = adminPayData.reduce((acc, pay) => acc + pay.adminPayAmount, 0);
      const totalPayAmount = employeePaymentData.reduce((acc, payment) => acc + parseFloat(payment.payAmount), 0);

      return {
        ...user,
        totalSpent,
        totalSellery,
        totalBonus,
        totalAdminPay,
        totalPayAmount,
      };
    });

    const sortedData = aggregatedData.sort((a, b) => b.totalSpent - a.totalSpent);

    setEmployeeData(sortedData);

  }, [users, employeePayment, sortMonth, selectedYear]);



  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const totalSpent = employeeData.reduce((acc, user) => acc + user.totalSpent, 0);
  const totalSellery = employeeData.reduce((acc, user) => acc + user.totalSellery, 0);
  const totalBonus = employeeData.reduce((acc, user) => acc + user.totalBonus, 0);


  const changeTab = (tab) => {
    localStorage.setItem("activeTabProfile", tab); // Store the active tab in local storage
  };

  return (
    <div className='m-5 text-black'>
      <Helmet>
        <title>Sellery | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="grid grid-cols-2 md:grid-cols-2 mb-5 lg:grid-cols-4 text-black sm:grid-cols-2 gap-3 justify-around ">
        <div className="px-5 py-10 rounded-2xl  bg-[#91a33a] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm font-bold">Total Spent</h2>
          <p className="lg:text-xl text-sm font-bold mt-2"> $ {totalSpent.toFixed(0)}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm font-bold">Total Sellery</h2>
          <p className="lg:text-xl text-sm font-bold mt-2">
             <span className="lg:text-xl text-sm font-extrabold">৳</span> {(totalSpent * 7).toFixed(0)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm font-bold">Paid</h2>
          <p className="lg:text-xl text-sm font-bold mt-2"> <span className="lg:text-xl text-sm font-extrabold">৳</span>{totalSellery.toFixed(0)} </p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#ce1a38] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm font-bold">Unpaid</h2>
          <p className="lg:text-xl text-sm font-bold mt-2">
          <span className="lg:text-xl text-sm font-extrabold">৳</span> {(totalSpent * 7 - totalSellery).toFixed(0)}
          </p>
        </div>

      
      </div>
      <div className="mb-5 flex justify-center lg:justify-end gap-5 items-center">
        <div> 
          <select id="monthSelect" value={sortMonth}  onChange={(e) => changeTab2(e.target.value)} className="p-2 bg-white text-black border border-gray-700 rounded">
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div>
        
          <select id="yearSelect" value={selectedYear} onChange={handleYearChange} className="p-2 bg-white text-black border border-gray-700 rounded">
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl text-center border-l border-gray-300">
        <table className="min-w-full text-center bg-white">
          <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3 text-start">Employee Name</th>
              <th className="p-3">Spent</th>
              <th className="p-3">T. Sellery</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Unpaid</th>
              <th className="p-3">Bonus</th>
            </tr>
          </thead>
          <tbody className='text-black'>
            {employeeData.map((user, index) => (
              <tr key={user.email} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-200"} text-black border-b border-opacity-20`}>
                 <td className="p-3 border-r-2 border-gray-300 text-center">{index + 1}</td>
                <td onClick={() => changeTab('sellery')} className="p-3 border-r-2 hover:text-blue-700 hover:font-bold border-gray-300 font-bold text-start pl-5">
                  <Link className='flex justify-start items-center gap-2' to={`/dashboard/userInfo/${user?.email}`}><img className='h-10 w-10 rounded-full flex justify-center' src={user.photo} alt="" /><span>{user.name}</span></Link>
                </td>
                 <td className="p-3 border-r-2 border-gray-300 text-center">${user.totalSpent.toFixed(2)}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">৳ {(user.totalSpent * 7).toFixed(2)}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">৳ {user.totalSellery.toFixed(2)}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">৳ {(user.totalSpent * 7 - user.totalSellery).toFixed(2)}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">৳ {user.totalBonus.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#05a0db] font-bold text-white">
            <tr>
              <td className="p-3 text-right border-gray-300" colSpan="2">Total:</td>
              <td className="p-3 border-gray-300 text-center">${totalSpent.toFixed(2)}</td> 
              {/* <td className="p-3 border-gray-300 text-center">৳ {(totalSpent * 140).toFixed(2)}</td>
              <td className="p-3 border-gray-300 text-center">৳ {totalPayAmount.toFixed(2)}</td>  */}
              {/* <td className="p-3 border-gray-300 text-center">৳ {totalDue.toFixed(2)}</td> */}
              <td className="p-3 border-gray-300 text-center">৳ {(totalSpent * 7).toFixed(2)}</td>
              <td className="p-3 border-gray-300 text-center">৳ {totalSellery.toFixed(2)}</td>
              <td className="p-3 border-gray-300 text-center">৳ {(totalSpent * 7 - totalSellery).toFixed(2)}</td>
              <td className="p-3 border-gray-300 text-center">৳ {totalBonus.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Sellery;
