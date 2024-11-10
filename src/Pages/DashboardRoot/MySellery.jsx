import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useUsers from '../../Hook/useUsers';
import { FaEdit } from 'react-icons/fa';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import useEmployeePayment from '../../Hook/useEmployeePayment';
import { AuthContext } from '../../Security/AuthProvider';
import { Helmet } from 'react-helmet-async';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const MySellery = () => {
  const [employeePayment] = useEmployeePayment();
  const { user } = useContext(AuthContext);
  const email = user?.email;
  const [users, refetch] = useUsers();
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(''); // State to track the selected month

  const componentRef = useRef(null); // Reference to capture the component for PDF

  useEffect(() => {
    // Filter users with role 'employee'
    const employees = users.filter(user => user.role === 'employee');

    // Find the specific user based on the email
    const filteredUser = employees.find(user => user.email === email);

    if (filteredUser) {
      const { monthlySpent, sellery } = filteredUser;

      // Filter employee payments by email
      const employeePayments = employeePayment.filter(payment => payment.employeeEmail === email);

      // Create a mapping of total payAmount by month
      const paymentByMonth = months.reduce((acc, month) => {
        const monthPayments = employeePayments.filter(payment => new Date(payment.date).toLocaleString('default', { month: 'long' }) === month);
        const totalPayAmount = monthPayments.reduce((sum, payment) => sum + parseFloat(payment.payAmount), 0);
        acc[month] = totalPayAmount;
        return acc;
      }, {});

      const monthlyData = months.map(month => {

        const selleryData = (sellery || []).filter(sell => sell.month === month);

        const monthlySpentData = (monthlySpent || [])
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
      
        const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
        const totalAdminPay = paymentByMonth[month] || 0;

        return {
          month,
          totalSpent,
          totalSellery,
          totalBonus,
          totalBill: totalSpent * 140,
          totalDue: totalSpent * 140 - totalAdminPay,
          totalSelleryPaid: totalSpent * 7 - totalSellery,
          totalAdminPay // Add totalAdminPay to the data
        };
      });

      setEmployeeData(monthlyData);
    }
  }, [users, email, employeePayment]);

  const AxiosPublic = UseAxiosPublic();

  const handleSellery = (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.amount.value);
    const bonus = parseFloat(e.target.bonus.value);
    const date = new Date(`${selectedMonth} 1, ${new Date().getFullYear()}`); // Create a date based on the selected month

    const generateRandomId = () => {
      return Math.floor(Math.random() * 1e13); // 1e13 generates a number between 0 and 9999999999999 (13 digits)
    };
    const id = generateRandomId();
    const selleryData = {
      id,
      amount,
      bonus,
      date,
      month: selectedMonth, // Use the selected month
      email
    };

    AxiosPublic.post('/users/updateSellery', { email, selleryData })
      .then(res => {
        console.log(res.data);
        refetch();
        // Optional: Close the modal or do additional actions here
      })
      .catch(error => {
        console.error("Error posting user data:", error);
      });
  };

  const downloadPDF = () => {
    const input = componentRef.current;
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('MySellery_Report.pdf');
    });
  };

  return (
    <div ref={componentRef} className='m-5 mt-7'>
       <Helmet>
        <title>E.M Sellery | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
     
      <div className="p-5 rounded-lg mt-5" style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>
      <button onClick={downloadPDF} className="mb-5 p-3 bg-blue-500 text-white rounded">
        Download PDF
      </button>
      <div  className="overflow-x-auto rounded-xl  text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
              <th className="p-3">SL</th>
              <th className="p-3">Month</th>
              <th className="p-3">Spent</th>
              <th className="p-3">T. Sellery</th>
              <th className="p-3">Paid Amount</th>
              <th className="p-3">Unpaid</th>
              <th className="p-3">Bonus</th>
       
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
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center px-5">{index + 1}</td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center px-5">
                  {data.month}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                  ${data.totalSpent.toFixed(2)}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {
    (data.totalSpent * (["October", "November", "December"].includes(data.month) ? 6 : 7)).toFixed(0)
  }
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                ৳{data.totalSellery.toFixed(2)}
                
                </td>
               
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {data.totalSelleryPaid.toFixed(2)}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {data.totalBonus.toFixed(2)}
                </td>
              
              </tr>
            ))}
          </tbody>
          <tfoot className="font-bold ">
            <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
              <td className="p-3 text-right border-gray-300" colSpan="2">Total</td>
              <td className="p-3 border-gray-300">
                ${employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)}
              </td>
              <td className="p-3 border-gray-300">
                ৳ {(employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0)).toFixed(2)}
              </td>
              <td className="p-3 border-gray-300">
                ৳ {(employeeData.reduce((acc, data) => acc + data.totalSellery, 0)).toFixed(2)}
              </td>
                             
              <td className="p-3 border-gray-300">
                ৳ {(employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0)).toFixed(2)}
              </td>
              <td className="p-3 border-gray-300">
                ৳ {(employeeData.reduce((acc, data) => acc + data.totalBonus, 0)).toFixed(2)}
              </td>
            
            </tr>
          </tfoot>
        </table>
      </div>
     
    </div>
    </div>
  );
};

export default MySellery;
