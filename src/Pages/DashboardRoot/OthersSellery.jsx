import  { useState, useEffect } from 'react';
import useUsers from '../../Hook/useUsers';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useEmployeePayment from '../../Hook/useEmployeePayment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];
const years = Array.from({ length: 31 }, (_, index) => 2020 + index); 

const OthersSellery = () => {
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
    const employees = users.filter(user => user.role === 'webDeveloper' || user.role === 'graphicDesigner');
    const aggregatedData = employees.map(user => {

      const selleryData = (user.sellery || []).filter(sell => sell.month === sortMonth);

      const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);

      return {
        ...user,
        totalSellery,
      };
    });

    const sortedData = aggregatedData.sort((a, b) => b.totalSpent - a.totalSpent);

    setEmployeeData(sortedData);

  }, [users, employeePayment, sortMonth, selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const totalSellery = employeeData.reduce((acc, user) => acc + user.totalSellery, 0);

  const changeTab = (tab) => {
    localStorage.setItem("activeTabProfile", tab); // Store the active tab in local storage
  };



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
    <div className='m-5 text-black'>
      <Helmet>
        <title>Employee Salary | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }} className="grid grid-cols-2 p-5 rounded-lg md:grid-cols-2 mb-5 lg:grid-cols-1 text-black sm:grid-cols-2 gap-3 justify-around">


  <div className="px-5 py-10 rounded-2xl bg-[#05a0db] text-white shadow-lg text-center">
    <h2 className="lg:text-xl text-sm font-bold">Paid</h2>
    <p className="lg:text-xl text-sm font-bold mt-2">
      <span className="lg:text-xl text-sm font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(totalSellery.toFixed(0))}
    </p>
  </div>

</div>

      <div className='px-5 py-5 rounded-md' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>

        <div className='flex mb-5 items-center justify-between '>
        <div className=" flex justify-center lg:justify-start gap-3 items-center">
        <div> 
          <select id="monthSelect"
           style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}} value={sortMonth}  onChange={(e) => changeTab2(e.target.value)} className="p-2 bg-white text-black border border-gray-700 rounded">
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div>
        
          <select id="yearSelect"
           style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}} value={selectedYear} onChange={handleYearChange} className="p-2 bg-white text-black border border-gray-700 rounded">
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
         
      </div>
      <button onClick={downloadPDF} className=" bg-blue-500 text-white py-2 px-4 rounded">
          Download PDF
        </button>
        </div>

      <div  className="overflow-x-auto rounded-xl  text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
              <th  style={{  border: 'var(--border)'}} className="p-3">SL</th>
              <th  style={{  border: 'var(--border)'}} className="p-3 text-start">Employee Name</th>
              <th  style={{  border: 'var(--border)'}} className="p-3">Paid</th>
            </tr>
          </thead>
          <tbody className='text-black'>
            {employeeData.map((user, index) => (
             <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
             key={user._id}
             className={`${
               index % 2 === 0
                 ? "bg-white text-left text-black border-b border-opacity-20"
                 : "bg-gray-200  text-left text-black border-b border-opacity-20"
             }`}
           >
                 <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">{index + 1}</td>
                <td style={{  border: 'var(--border)'}} onClick={() => changeTab('sellery')} className="p-3 border-r-2 hover:text-blue-700 hover:font-bold border-gray-300 font-bold text-start pl-5">
                  <Link className='flex justify-start items-center gap-2' to={`/dashboard/userInfo/${user?.email}`}><img className='h-10 w-10 rounded-full flex justify-center' src={user.photo} alt="" /><span>{user.name}</span></Link>
                </td>
             
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center"><span className='font-extrabold '>৳</span> {user.totalSellery.toFixed(0)}</td>
  
              </tr>
            ))}
          </tbody>
          <tfoot className=" font-bold ">
            <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
              <td  style={{  border: 'var(--border)'}} className="p-3 text-right border-gray-300" colSpan="2">Total:</td>
              <td  style={{  border: 'var(--border)'}} className="p-3 border-gray-300 text-center"><span className='font-extrabold '>৳</span> {totalSellery.toFixed(0)}</td>

            </tr>
          </tfoot>
        </table>
      </div>
      </div>
    </div>
  );
};

export default OthersSellery;
