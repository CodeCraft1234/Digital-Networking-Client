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
        (acc, campaign) => acc + parseFloat(campaign.payAmount || 0),
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
      (acc, campaign) => acc + parseFloat(campaign.dollerRate), // Convert string to number and add to accumulator
      0 // Initial value of accumulator
    );
    
    console.log(adsAccounts.length, totalDollarRate);
    const averageDollarRate = adsAccounts.length ? totalDollarRate / adsAccounts.length : 0;
    setAverageDollarRate(averageDollarRate);

    const totalBill = totalSpent * averageDollarRate;
    setTotalBill(totalBill);

    const totalDue = totalBill - totalPayment;
    setTotalDue(totalDue);

    // Debugging statements
    console.log('Total Spent:', totalSpent);
    console.log('Average Dollar Rate:', averageDollarRate);
    console.log('Total Bill:', totalBill);
    console.log('Total Payment:', totalPayment);
    console.log('Total Due:', totalDue);
  }, [adsAccounts, totalPayment]);

  return (
    <div className="mt-4 ">
      <Helmet>
        <title>Dashboard | Digital Network</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      <div className="grid lg:grid-cols-4 text-white grid-cols-2 gap-3 lg:gap-5 justify-around p-5">
        <div className="px-5 py-10 rounded-2xl bg-[#c6e529] shadow-lg text-center">
          <h2 className="text-xl">Total Spent</h2>
          <p className="lg:text-4xl text-sm font-bold"> $ {TSpent.toFixed(2)}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] shadow-lg text-center">
          <h2 className="text-xl">Total Bill</h2>
          <p className="lg:text-4xl text-sm font-bold"> ৳ {totalBill.toFixed(2)}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] shadow-lg text-center">
          <h2 className="text-xl">Total Paid</h2>
          <p className="lg:text-4xl text-sm font-bold"> ৳ {totalPayment.toFixed(2)}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-[#ce1a38] shadow-lg text-center">
          <h2 className="text-xl ">Total Due</h2>
          <p className=" lg:text-4xl text-sm font-bold"> ৳ {totalDue.toFixed(2)}</p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdsDashboardHome;
