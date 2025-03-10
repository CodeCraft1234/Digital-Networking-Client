import { useParams } from "react-router-dom";
import useFindClient from "../Home/useFindClient";
import useAllEmployee from "../../Hook/useAllEmployee";
import { useContext, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import useUserr from "../../Hook/useUser";

const ClientSummery = () => {
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


    const { user } = useContext(AuthContext);
    const { userr } = useUserr(user?.email); 
  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem(`activeTabag${user?.email}`) || "all" 
  : localStorage.getItem(`activeTabag${user?.email}`) || user?.email; 
  
  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);
    const [searchQuery, setSearchQuery] = useState("");

  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab);
    localStorage.setItem(`activeTabag${user?.email}`, tab);
  };
    const [allEmployees] = useAllEmployee();

  return (
    <div className=" mt-5">

<div className="flex mb-5 lg:mb-5 gap-3 justify-between items-center">
  {userr?.role === "admin" && (
    <select
      className="select2"
      value={selectedEmployee3}
      onChange={(e) => changeTab3(e.target.value)}
    >
      <option value="all">Select Digital Marketer</option>
      {allEmployees
        .filter((u) => u.role === "employee")
        .map(({ _id, email, name }) => (
          <option key={_id} value={email}>
            {name}
          </option>
        ))}
    </select>
  )}

<input
    type="text"
    placeholder="Search ...."
    className="input2"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />

              </div>

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

    const totalCampaignSpent = (findClients?.campaings || []).reduce(
      (acc, campaign) => acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
      0
    );

    const totalPageServiceBill = (findClients?.pageService || []).reduce(
      (acc, payment) => acc + parseFloat(payment?.totalBill || 0),
      0
    );

    const totalPayments = (findClients?.payments || []).reduce(
      (acc, payment) => acc + parseFloat(payment?.amount || 0),
      0
    );

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

export default ClientSummery;
