import {  useEffect, useRef, useState } from "react";
import useClients from "../../Hook/useClient";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useCampaingsByEmail from "../../Hook/useCampaignsByEmail";
import useMpymentsByEmail from "../../Hook/useMpaymentByEmail";

const ClientHistory = () => {
  const param = useParams();
  const [clients] = useClients();
  const [campaignss]=useCampaingsByEmail(param?.email)
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBills, setTotalBills] = useState(0);

  useEffect(() => {

    const totalBill = campaignss.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
      0
    );
    setTotalBills(totalBill);

    const totalSpent = campaignss.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tSpent),
      0
    );
    setTotalSpent(totalSpent);

  }, [campaignss]);

  const [totalPaymeent, setTotalPayment] = useState([]);
  const [Mpayments]=useMpymentsByEmail(param?.email)

  useEffect(() => {
    const totalBill = Mpayments.reduce(
      (acc, campaign) => acc + parseFloat(campaign.amount),
      0
    );
    setTotalPayment(totalBill);
  }, [ Mpayments]);

  //////////////////////////////////////

  const [Histryy, setHistryy] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    if (param?.email) {
      const sortedHistry = Mpayments.sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistryy(sortedHistry);

      const totalBill = Mpayments.reduce((acc, campaign) => acc + parseFloat(campaign.amount), 0);
      setTotalPayment(totalBill);

    }
  }, [param?.email, Mpayments, clients]);

  useEffect(() => {
    if (selectedMonth) {
      const filtered = Histryy.filter(payment => {
        const paymentDate = new Date(payment.date);
        return (
          paymentDate.getMonth() + 1 === parseInt(selectedMonth)
        );
      });
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(Histryy);
    }
  }, [selectedMonth, Histryy]);

  // Function to get total payment for each month
  const getMonthlyTotal = (month) => {
    return filteredHistory
      .filter(payment => new Date(payment.date).getMonth() + 1 === month)
      .reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
  };

  const pdfRef = useRef();
  const handleDownloadPDF = () => {
    const pdfSection = pdfRef.current;
    if (!pdfSection) return;

    html2canvas(pdfSection).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("client_history.pdf");
    });
  };

  

  return (
    <div className="m-4">


<div className="rounded-lg" style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} >
<div  className="grid grid-cols-2 m-1 rounded-lg md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-3 lg:gap-5 justify-around p-5">

        <div className="px-5 py-10 rounded-2xl  bg-[#91a33a] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total Spent</h2>
          <p className="lg:text-4xl text-xl font-bold mt-2"> $ {totalSpent.toFixed(2)}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total Bill</h2>
          <p className="lg:text-4xl text-xl font-bold mt-2">
             <span className="lg:text-4xl text-xl font-extrabold">৳</span> {totalBills.toFixed(0)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total Paid</h2>
          <p className="lg:text-4xl text-xl font-bold mt-2"> <span className="lg:text-4xl text-xl font-extrabold">৳</span> {parseInt(totalPaymeent).toFixed(0)}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#ce1a38] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total <span>
  {((totalBills - totalPaymeent).toFixed(0))  >= 0 ? 'Due' : 'Advance'}
</span>
</h2>
          <p className="lg:text-4xl text-xl font-bold mt-2">
          <span className="lg:text-4xl text-xl font-extrabold">৳</span> {Math.abs((totalBills - totalPaymeent).toFixed(0))}
          </p>
        </div>
      </div>



      <div className="mx-5">
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 lg:gap-5  mb-5">
    

    <div 
    
      style={{ backgroundColor: '#f7e8e8', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash Merchant" />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.filter(h => h.paymentMethod === 'bkashMarchent')?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>

    {/* bKash Personal Card */}
    <div 
      
      style={{ backgroundColor: '#ffe6f7', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash Personal" />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.filter(h => h.paymentMethod === 'bkashPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>

    {/* Nagad Personal Card */}
    <div 
    
      style={{ backgroundColor: '#fff2cc', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <img className="balance-card-img" src="https://i.ibb.co.com/WsDkLzc/Nagad-Marchant.png" alt="Nagad Personal" />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.filter(h => h.paymentMethod === 'nagadMarchent')?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>

    <div 
      style={{ backgroundColor: '#fff2cc', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad Personal" />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.filter(h => h.paymentMethod === 'nagadPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>

    {/* Rocket Personal Card */}
    <div 
    
      style={{ backgroundColor: '#e0f7fa', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket Personal" />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.filter(h => h.paymentMethod === 'rocketPersonal')?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>

    {/* Bank Card */}
    <div 
     
      style={{ backgroundColor: '#f2f2f2', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <h1 className="p-3 text-black text-3xl font-bold text-center">Bank</h1>
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.filter(h => h.paymentMethod === 'bank')?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>

    {/* Total Card */}
    <div 
      style={{ backgroundColor: '#d9f8d9', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <h1 className="p-3 text-black text-3xl font-bold text-center">TOTAL</h1>
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span>
        {filteredHistory?.reduce((acc, payment) => acc + payment?.amount, 0)}
      </p>
    </div>
    
  </div>
</div>
</div>

   <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }} className="lg:mt-5 mt-5  rounded-lg mx-1">

     <button
        onClick={handleDownloadPDF}
        className="  ml-5 mt-5 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Download PDF
      </button>

       <div className="overflow-x-auto rounded-xl m-5 text-center" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)',border: 'var(--border)' }}>
        <table className="min-w-full text-center">
          <thead>
            <tr style={{ border: 'var(--border)', borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)' }}>
              <th style={{ border: 'var(--border)' }} className="p-3">SL</th>
              <th style={{ border: 'var(--border)' }} className="p-3">Payment month</th>
              <th style={{ border: 'var(--border)' }} className="p-3">Payment Amount</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 12 }, (_, index) => {
              const month = index + 1; // month is 1-based
              return (
                <tr key={month} style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)' }} className={`${
                  month % 2 === 0
                    ? "bg-white text-left text-black border-b border-opacity-20"
                    : "bg-gray-200 text-left text-black border-b border-opacity-20"
                }`}>
                  <td style={{ border: 'var(--border)' }} className="p-3 border-r-2 border-l-2 border-gray-200 text-center">
                    {month}
                  </td>
                  <td style={{ border: 'var(--border)' }} className="p-3 border-r-2 border-gray-200 text-center">
                    {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                  </td>
                  <td style={{ border: 'var(--border)' }} className="p-3 border-r-2 border-gray-200 text-center">
                    <span className="text-md mr-1 font-extrabold">৳</span>
                    {getMonthlyTotal(month).toFixed(2)}
                  </td>
                </tr>
              );
            })}
            <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} className="font-bold">
              <td style={{ border: 'var(--border)' }} className="p-3 text-center" colSpan="2">
                Total Amount:
              </td>
              <td style={{ border: 'var(--border)' }} className="p-3 text-center">
                <span className="text-md mr-1 font-extrabold">৳</span>
                {filteredHistory.reduce((acc, payment) => acc + parseFloat(payment.amount), 0).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
</div>
    
    </div>
  );
};

export default ClientHistory;
