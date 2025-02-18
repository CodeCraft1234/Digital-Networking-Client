import {  useEffect, useRef, useState } from "react";
import useClients from "../../Hook/useClient";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useCampaingsByEmail from "../../Hook/useCampaignsByEmail";
import useMpymentsByEmail from "../../Hook/useMpaymentByEmail";
import BalanceCard from "./BalanceCard";
import useFindClient from "../Home/useFindClient";
import SummaryCard from "../Home/SummeryCard";

const ClientHistory = () => {
  const param = useParams();
  const {findClients}=useFindClient(param?.email)
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

  const getMonthlyTotal = (month) => {
    return findClients?.payments
      ?.filter(payment => new Date(payment?.date).getMonth() + 1 === month)
      .reduce((acc, payment) => acc + parseFloat(payment?.amount), 0);
  };

  const getMonthlyTotalMetaSpend = (month) => {
    return findClients?.campaings
      ?.filter(payment => new Date(payment?.date).getMonth() + 1 === month && payment.role === 'metaAds')
      .reduce((acc, payment) => acc + parseFloat(payment?.tSpent), 0);
  };

  const getMonthlyTotalGoogleSpend = (month) => {
    return findClients?.campaings
      ?.filter(payment => new Date(payment?.date).getMonth() + 1 === month && payment.role === 'googleAds')
      .reduce((acc, payment) => acc + parseFloat(payment?.tSpent), 0);
  };

  const getMonthlyTotalBill = (month) => {
    return findClients?.campaings
      ?.filter(payment => new Date(payment?.date).getMonth() + 1 === month)
      .reduce(
        (acc, campaign) =>
          acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
        0);
  };


  const getMonthlyTotalPageSetup = (month) => {
    return findClients?.pageService
      ?.filter(payment => new Date(payment?.date).getMonth() + 1 === month)
      .reduce((acc, payment) => acc + parseFloat(payment?.totalBill), 0);
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
    <div className=" mt-5">


   <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }} className="lg:mt-5 mt-3  rounded-lg ">

       <div className="table-div m-5" >
        <table className="min-w-full text-center">
          <thead>
            <tr className="tr1">
              <th>month</th>
              <th>Meta Ads</th>
              <th>Google Ads</th>
              <th>Total BDT</th>
              <th>Services</th>
              <th>Payment</th>
              <th>Due/Advance</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 12 }, (_, index) => {
              const month = index + 1; // month is 1-based
              return (
                <tr key={month}  className={`tr2`}>

                  <td >
                    {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                  </td>
                  <td >
                    <span className="text-md mr-1 font-extrabold">$</span>
                    {getMonthlyTotalMetaSpend(month)?.toFixed(0) || 0}
                  </td>
                  <td >
                    <span className="text-md mr-1 font-extrabold">$</span>
                    {getMonthlyTotalGoogleSpend(month)?.toFixed(0) || 0}
                  </td>

                  <td>
                    <span className="text-md mr-1 font-extrabold">৳</span>
                    { getMonthlyTotalBill(month)?.toFixed(0) || 0}
                  </td>

                  <td >
                    <span className="text-md mr-1 font-extrabold">৳</span>
                    {getMonthlyTotalPageSetup(month)?.toFixed(0) || 0}
                  </td>
                  
                  <td >
                    <span className="text-md mr-1 font-extrabold">৳</span>
                    {getMonthlyTotal(month)?.toFixed(0) || 0}
                  </td>
                  <td
  
>
  <span className="text-md mr-1 font-extrabold">৳</span>
  {(
    (parseFloat(getMonthlyTotalBill(month) || 0) +
      parseFloat(getMonthlyTotalPageSetup(month) || 0)) -
    parseFloat(getMonthlyTotal(month) || 0)
  ).toFixed(0)}
</td>

                </tr>
              );
            })}
            <tr className="tr1 font-bold">
              <td  className="p-3 text-right" colSpan="1">
                Total Amount:
              </td>

              <td>
                <span className="text-md mr-1 font-extrabold">৳</span>
                {findClients?.campaings?.filter(f=>f.role === 'metaAds')?.reduce(
      (acc, payment) => acc + parseFloat(payment?.tSpent || 0),
      0
    ).toFixed(0) || 0}
              </td>

              <td >
                <span className="text-md mr-1 font-extrabold">৳</span>
                {findClients?.campaings?.filter(f=>f.role === 'googleAds')?.reduce(
      (acc, payment) => acc + parseFloat(payment?.tSpent || 0),
      0
    ).toFixed(0) || 0}
              </td>

              <td >
                <span className="text-md mr-1 font-extrabold">৳</span>
                {findClients?.campaings?.reduce(
        (acc, campaign) =>
          acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
        0)}
              </td>

           
                <td >
                <span className="text-md mr-1 font-extrabold">৳</span>
                {findClients?.pageService?.reduce(
      (acc, payment) => acc + parseFloat(payment?.totalBill || 0),
      0
    ).toFixed(0) || 0}
              </td>
            

              <td >
                <span className="text-md mr-1 font-extrabold">৳</span>
                {findClients?.payments?.reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    ).toFixed(0) || 0}
              </td>

              <td >
  <span className="text-md mr-1 font-extrabold">৳</span>
  {(() => {
    // Safely get and calculate `tSpent` * `dollerRate` for all campaigns
    const totalCampaignSpent = (findClients?.campaings || []).reduce(
      (acc, campaign) => acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
      0
    );

    // Safely calculate the total bill for page services
    const totalPageServiceBill = (findClients?.pageService || []).reduce(
      (acc, payment) => acc + parseFloat(payment?.totalBill || 0),
      0
    );

    // Safely calculate total payments made
    const totalPayments = (findClients?.payments || []).reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    );

    // Final result with proper fallback to 0
    const totalResult = (totalCampaignSpent + totalPageServiceBill - totalPayments).toFixed(0) || 0;

    return totalResult;
  })()}
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
