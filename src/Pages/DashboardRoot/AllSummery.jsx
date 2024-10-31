import  { useContext, useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../Security/AuthProvider';
import useUsers from '../../Hook/useUsers';
import useEmployeePayment from '../../Hook/useEmployeePayment';
import useMpayment from '../../Hook/UseMpayment';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const AllSummery = () => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [employeePayment] = useEmployeePayment();
  const [Mpayment] = useMpayment();

  const [employees, setEmployees] = useState([]);
  const initialTab = localStorage.getItem("activeTabsummeryEmployee") || "allEmployee";
  const [selectedEmployee, setSelectedEmployee] = useState(initialTab);

  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem("activeTabsummeryEmployee", tab); 
  };

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
    const relevantUsers = selectedEmployee !== "allEmployee"
      ? users.filter(u => u.role === 'employee' && u.email === selectedEmployee)
      : users.filter(u => u.role === 'employee');

    return relevantUsers.flatMap(user => {
      const employeePayments = employeePayment.filter(
        payment => selectedEmployee !== "allEmployee"
          ? payment.employeeEmail === selectedEmployee
          : payment.employeeEmail === user.email
      );

      const mPayments = Mpayment.filter(
        payment => selectedEmployee !== "allEmployee"
          ? payment.employeeEmail === selectedEmployee
          : payment.employeeEmail === user.email
      );

      const paymentByMonth = employeePayments.reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.payAmount);
        return acc;
      }, {});

      const paymentByMonth2 = mPayments.reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.amount);
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
      }).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month)); 
    });
  }, [users, selectedEmployee, employeePayment, Mpayment, recentMonths]);

  const totalSpentSum = employeeData.reduce((acc, data) => acc + data.totalSpent, 0);
  const totalBillSum = employeeData.reduce((acc, data) => acc + data.totalBill, 0);
  const totalClientPaySum = employeeData.reduce((acc, data) => acc + data.totalClientPay, 0);
  const totalAdminPaySum = employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0);


  
  const downloadPDF = () => {
    const input = document.querySelector('.m-3'); // Selects the main container element
  
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // Width of the PDF page in mm
      const pageHeight = 295; // Height of the PDF page in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save('employee_summary_report.pdf');
    });
  };
  


  return (
    <div className='m-3 lg:m-5'>
      <Helmet>
        <title>Activity | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }} className="grid grid-cols-2 p-5 rounded-lg md:grid-cols-2 lg:grid-cols-6 text-black sm:grid-cols-2 gap-3 lg:gap-5 justify-around">
  <div className="px-5 py-10 rounded-2xl bg-[#81c784] text-black shadow-lg text-center">
    <h2 className="lg:text-lg text-sm font-bold">Total Spent</h2>
    <p className="lg:text-xl text-xm font-bold mt-2">
      $ {new Intl.NumberFormat('en-IN').format(totalSpentSum.toFixed(0))}
    </p>
  </div>

  <div className="px-5 py-10 rounded-2xl bg-[#64b5f6] text-black shadow-lg text-center">
    <h2 className="lg:text-lg text-sm font-bold">Total BDT</h2>
    <p className="lg:text-xl text-xm font-bold mt-2">
      <span className="lg:text-xl text-xm font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(totalBillSum.toFixed(0))}
    </p>
  </div>

  <div className="px-5 py-10 rounded-2xl bg-[#ffb74d] text-black shadow-lg text-center">
    <h2 className="lg:text-lg text-sm font-bold">Employee Pay</h2>
    <p className="lg:text-xl text-xm font-bold mt-2">
      <span className="lg:text-xl text-xm font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(totalAdminPaySum.toFixed(0))}
    </p>
  </div>


  <div className="px-5 py-10 rounded-2xl bg-[#e57373] text-black shadow-lg text-center">
    <h2 className="lg:text-lg text-sm font-bold">Employee Due</h2>
    <p className="lg:text-xl text-xm font-bold mt-2">
      <span className="lg:text-xl text-xm font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format((totalBillSum - totalAdminPaySum).toFixed(0))}
    </p>
  </div>

  <div className="px-5 py-10 rounded-2xl bg-[#ce93d8] text-black shadow-lg text-center">
    <h2 className="lg:text-lg text-sm font-bold">Client Pay</h2>
    <p className="lg:text-xl text-xm font-bold mt-2">
      <span className="lg:text-xl text-xm font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(totalClientPaySum.toFixed(0))}
    </p>
  </div>

  

  <div className="px-5 py-10 rounded-2xl bg-[#ff8a65] text-black shadow-lg text-center">
    <h2 className="lg:text-lg text-sm font-bold">Client Due</h2>
    <p className="lg:text-xl text-xm font-bold mt-2">
      <span className="lg:text-xl text-xm font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format((totalBillSum - totalClientPaySum).toFixed(0))}
    </p>
  </div>
</div>



      <div className='px-5  mt-5 rounded-lg' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>

      <div className="flex mt-3 lg:mt-5 ml-1 lg:justify-between justify-center ">
        <select
         style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
          className="border bg-white text-black lg:w-auto w-full border-gray-400 rounded px-2 "
          value={selectedEmployee}
          onChange={(e) => changeTab(e.target.value)}
        >
          <option value="allEmployee">All Employees</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
        </select>
        <button onClick={downloadPDF} className=" bg-blue-500 text-white py-2 px-4 rounded">
          Download PDF
        </button>
      </div>

      <div  className="overflow-x-auto rounded-xl my-5  text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
        <th className="p-3">SL</th>
        <th className="p-3">Month</th>
        <th className="p-3">Total Spent</th>
        <th className="p-3">Total BDT</th>
        <th className="p-3">Client Pay</th>
        <th className="p-3">Employee Pay</th>
      </tr>
    </thead>
    <tbody className='text-center'>
  {employeeData.map((data, index) => (
    <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
    key={data._id}
    className={`${
      index % 2 === 0
        ? "bg-white  text-center text-black border-b border-opacity-20"
        : "bg-gray-200  text-center text-black border-b border-opacity-20"
    }`}
  >
      <td style={{  border: 'var(--border)'}} className="p-3 border">{index + 1}</td>
      <td style={{  border: 'var(--border)'}} className="p-3 border">{data.month}</td>
      <td style={{  border: 'var(--border)'}} className="p-3 border"><span className='font-extrabold '>$</span> {data.totalSpent.toFixed(2)}</td>
      <td style={{  border: 'var(--border)'}} className="p-3 border"><span className='font-extrabold '>৳</span> {data.totalBill.toFixed(0)}</td>
      <td style={{  border: 'var(--border)'}} className="p-3 border"><span className='font-extrabold '>৳</span> {data.totalClientPay.toFixed(0)}</td>
      <td style={{  border: 'var(--border)'}} className="p-3 border"><span className='font-extrabold '>৳</span> {data.totalAdminPay.toFixed(0)}</td>
      
    </tr>
  ))}
</tbody>

    <tfoot>
      <tr  style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}} className=" font-bold ">
      <td className="p-3 text-right" colSpan="2">
                Total :
              </td>
        
        <td className="p-3  font-semibold">
          $ {employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)}
        </td>
        <td className="p-3  font-semibold">
           ‍ <span className='font-extrabold  text-white'> ৳ </span> {employeeData.reduce((acc, data) => acc + data.totalBill, 0).toFixed(0)}
        </td>
        <td className="p-3  font-semibold">
        <span className='font-extrabold  text-white'> ৳ </span> {employeeData.reduce((acc, data) => acc + data.totalClientPay, 0).toFixed(0)}
        </td>
        <td className="p-3  font-semibold">
        <span className='font-extrabold  text-white'> ৳ </span> {employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(0)}
        </td>
        
      </tr>
    
    </tfoot>
  </table>
</div>
</div>

    </div>
  );
};

export default AllSummery;
