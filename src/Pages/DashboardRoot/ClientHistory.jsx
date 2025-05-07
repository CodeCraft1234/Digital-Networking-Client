import {  useRef, } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useFindClient from "../Home/useFindClient";

const ClientHistory = () => {
  const param = useParams();
  const {findClients}=useFindClient(param?.email)

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

  return (
    <div className=" mt-5">


   <div className="lg:mt-5 mt-3  rounded-lg ">

       <div className="table-div" >
        <table className="min-w-full text-center">
          <thead>
            <tr className="tr1">
              <th>month</th>
              <th>Services</th>
              <th className="text-center">Meta</th>
              <th className="text-center">Google Ads</th>
              <th className="text-center">Bill</th>
              <th className="text-center">Payment</th>
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
                    <span className="text-md mr-1 font-extrabold">৳</span>
                    {getMonthlyTotalPageSetup(month)?.toFixed(0) || 0}
                  </td>

                  <td>
                  <span><span className="amount-doller">$</span><span className="ml-1">{getMonthlyTotalMetaSpend(month)?.toFixed(0) || 0}</span></span>
                  </td>
                  <td>
                  <span><span className="amount-doller">$</span><span className="ml-1"> {getMonthlyTotalGoogleSpend(month)?.toFixed(0) || 0}</span></span>
                  </td>
                  <td>
                  <span><span className="amount-taka">৳</span><span className="ml-1">{ getMonthlyTotalBill(month)?.toFixed(0) || 0}</span></span>
                  </td>
                  <td>
                  <span><span className="amount-taka">৳</span><span className="ml-1"> {getMonthlyTotal(month)?.toFixed(0) || 0}</span></span>
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

              <td >
                <span className="text-md mr-1 font-extrabold">৳</span>
                {findClients?.pageService?.reduce(
      (acc, payment) => acc + parseFloat(payment?.totalBill || 0),
      0
    ).toFixed(0) || 0}
              </td>

              <td>
              <span><span className="amount-doller">$</span><span className="ml-1">{findClients?.campaings?.filter(f=>f.role === 'metaAds')?.reduce(
      (acc, payment) => acc + parseFloat(payment?.tSpent || 0),
      0
    ).toFixed(0) || 0}</span></span>
              </td>
              <td>
              <span><span className="amount-doller">$</span><span className="ml-1"> {findClients?.campaings?.filter(f=>f.role === 'googleAds')?.reduce(
      (acc, payment) => acc + parseFloat(payment?.tSpent || 0),
      0
    ).toFixed(0) || 0}</span></span>
              </td>
              <td>
              <span><span className="amount-taka">৳</span><span className="ml-1"> {findClients?.campaings?.reduce(
        (acc, campaign) =>
          acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
        0)}</span></span>
              </td>
              <td>
              <span><span className="amount-taka">৳</span><span className="ml-1">  {findClients?.payments?.reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    ).toFixed(0) || 0}</span></span>
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
