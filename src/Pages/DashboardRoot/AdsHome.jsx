import { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../Security/AuthProvider";
import { Helmet } from "react-helmet-async";
import useAdsPayment from "../../Hook/useAdsPayment";
import useAdsAccountCenter from "../../Hook/useAdsAccountCenter"; // Updated import path to match useAdsAccountCenter

const AdsDashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [adsPayment] = useAdsPayment();
  const [adsAccountCenter] = useAdsAccountCenter();

  const [payment, setPayment] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [adsAccounts, setAdsAccounts] = useState([]);
  const [TSpent, setTSpent] = useState(0);
  const [averageDollarRate, setAverageDollarRate] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    if (user) {
      const realdata = adsPayment.filter(
        (m) => m.employeeEmail === user.email
      );
      setPayment(realdata);
      const totalBill = realdata.reduce(
        (acc, campaign) => acc + parseFloat(campaign.payAmount),
        0
      );
      setTotalPayment(totalBill);
    }
  }, [adsPayment, user]);

  useEffect(() => {
    if (user) {
      const filterdata = adsAccountCenter.filter((m) => m.employeeEmail === user.email);
      setAdsAccounts(filterdata);
    }
  }, [adsAccountCenter, user]);

  useEffect(() => {
    const totalSpent = adsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.totalSpent || 0),
      0
    );
    setTSpent(totalSpent);

    const totalDollarRate = adsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.dollarRate || 0),
      0
    );
    const averageDollarRate = adsAccounts.length ? totalDollarRate / adsAccounts.length : 0;
    setAverageDollarRate(averageDollarRate);

    const totalBill = totalSpent * averageDollarRate;
    setTotalBill(totalBill);

    const totalDue = totalBill - totalPayment;
    setTotalDue(totalDue);
  }, [adsAccounts, totalPayment]);

  return (
    <div className="my-4 mb-24">
      <Helmet>
        <title>Dashboard | Digital Network</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      <div className="grid lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around p-5">
        <div className="px-5 py-10 rounded-2xl bg-green-400 shadow-lg text-center">
          <h2 className="text-4xl font-bold">Total Spent</h2>
          <p className="text-xl">Balance: $ {TSpent}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-green-400 shadow-lg text-center">
          <h2 className="text-4xl font-bold">Total Bill</h2>
          <p className="text-xl">Balance: $ {totalBill}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-green-400 shadow-lg text-center">
          <h2 className="text-4xl font-bold">Total Paid</h2>
          <p className="text-xl">Balance: $ {totalPayment}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-green-400 shadow-lg text-center">
          <h2 className="text-4xl font-bold">Total Due</h2>
          <p className="text-xl">Balance: $ {totalDue}</p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdsDashboardHome;
