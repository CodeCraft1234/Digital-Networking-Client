import { useContext, useEffect, useState } from "react";
import useUsers from "../../Hook/useUsers";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Security/AuthProvider";
import useAdsPayment from "../../Hook/useAdsPayment";
import useAdsAccountCenter from "../../Hook/useAdsAccountCenter";
import { Helmet } from "react-helmet-async";

const AdsUser = () => {
  const [users, refetch] = useUsers(); 
  const [payoneerTotal, setPayoneerTotal] = useState(0); 
  const { user } = useContext(AuthContext);
  const [ddd, setDdd] = useState(null);
  
  useEffect(() => {
    if (users && user) {
      const fff = users.find(u => u.email === user?.email);
      setDdd(fff || {}); // Update state with found user or an empty object
    }
  }, [users, user]);

  const [employee, setEmployee] = useState([]);
  useEffect(() => {
    if (users && user) {
      const fff = users.filter(u => u.role === 'adsAccount');
      setEmployee(fff || []);
    }
  }, [users, user]);

  const [adsPayment] = useAdsPayment();
  const [adsAccountCenter] = useAdsAccountCenter();

  const [totalPayment, setTotalPayment] = useState(0);
  useEffect(() => {
    const totalBill = adsPayment.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount || 0),
      0
    );
    setTotalPayment(totalBill);
  }, [adsPayment]);

  const [totalPayment2, setTotalPayment2] = useState(0);
  const [TSpent2, setTSpent2] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    const totalBill = adsPayment.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount || 0),
      0
    );
    setTotalPayment2(totalBill);
  }, [adsPayment]);

  useEffect(() => {
    const totalSpent = adsAccountCenter.reduce(
      (acc, campaign) => acc + parseFloat(campaign.totalSpent || 0),
      0
    );
    setTSpent2(totalSpent);

    const totalDollarRate = adsAccountCenter.reduce(
      (acc, campaign) => acc + parseFloat(campaign.dollerRate),
      0
    );

    const averageDollarRate = adsAccountCenter.length ? totalDollarRate / adsAccountCenter.length : 0;
    const totalBill = totalSpent * averageDollarRate;
    setTotalBill(totalBill);

    const totalDue = totalBill - totalPayment;
    setTotalDue(totalDue);
  }, [adsAccountCenter, totalPayment]);

  return (
    <div className=" px-5 dark:text-green-800">
      <Helmet>
        <title>Ads User | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="grid lg:grid-cols-4 text-white sm:grid-cols-2 gap-5 justify-around py-5">
        <div className="px-5 py-10 rounded-2xl bg-[#c6e529] shadow-lg text-center">
          <h2 className="text-xl">Total Spent</h2>
          <p className="text-4xl font-bold"> $ {TSpent2.toFixed(2)}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] shadow-lg text-center">
          <h2 className="text-xl">Total Bill</h2>
          <p className="text-4xl font-bold"> ৳ {totalBill.toFixed(2)}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] shadow-lg text-center">
          <h2 className="text-xl">Total Paid</h2>
          <p className="text-4xl font-bold"> ৳ {totalPayment2.toFixed(2)}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-[#ce1a38] shadow-lg text-center">
          <h2 className="text-xl">Total Due</h2>
          <p className="text-4xl font-bold"> ৳ {totalDue.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl text-black border border-gray-400 ">
        <table className="min-w-full text-xs md:text-base">
          <thead className="bg-[#05a0db] text-white font-bold text-sm md:text-xl">
            <tr>
              <th className="p-3 text-center">Employee Name</th>
              {ddd?.role === 'admin' && (
                <>
                  <th className="p-3 text-center">Total Spent</th>
                  <th className="p-3 text-center">Total Bill</th>
                  <th className="p-3 text-center">Total Payment</th>
                  <th className="p-3 text-center">Total Due</th>
                </>
              )}
            </tr>
          </thead>
          {employee.map((userr, index) => {
            // Calculate the dynamic values for each employee
            const employeePayments = adsPayment.filter(payment => payment.employeeEmail === userr.email);
            const employeeAccounts = adsAccountCenter.filter(account => account.employeeEmail === userr.email);

            const employeeTotalSpent = employeeAccounts.reduce(
              (acc, account) => acc + parseFloat(account.totalSpent || 0),
              0
            );

            const employeeTotalBill = employeeAccounts.reduce(
              (acc, account) => acc + parseFloat(account.totalSpent || 0) * parseFloat(account.dollerRate || 0),
              0
            );

            const employeeTotalPayment = employeePayments.reduce(
              (acc, payment) => acc + parseFloat(payment.payAmount || 0),
              0
            );

            const employeeTotalDue = employeeTotalBill - employeeTotalPayment;

            return (
              <tbody className="text-black text-sm md:text-xl" key={userr._id}>
                <tr className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b border-opacity-20`}>
                  <td className="p-3 hover:font-bold  hover:text-blue-600     flex flex-col md:flex-row justify-start text-center ml-2 md:ml-10 items-center gap-2 border-r-2 border-gray-300">
                    <Link to={`/dashboard/userInfo/${userr?.email}`}>
                      <img className="w-10 h-10 rounded-full" src={userr?.photo} alt="" />
                    </Link>
                    <Link to={`/dashboard/adsuserInfo/${userr?.email}`}>{userr.name}</Link>
                  </td>
                  {ddd?.role === 'admin' && (
                    <>
                      <td className="p-3 text-center border-r-2 border-gray-300">৳ {employeeTotalSpent.toFixed(2)}</td>
                      <td className="p-3 text-center border-r-2 border-gray-300">৳ {employeeTotalBill.toFixed(2)}</td>
                      <td className="p-3 text-center border-r-2 border-gray-300">৳ {employeeTotalPayment.toFixed(2)}</td>
                      <td className="p-3 text-center border-r-2 border-gray-300">৳ {employeeTotalDue.toFixed(2)}</td>
                    </>
                  )}
                </tr>
              </tbody>
            );
          })}
          <tfoot>
              <tr className="bg-[#05a0db] text-white font-bold text-sm md:text-xl">
                <td className="p-3 text-center">Total</td>
                <td className="p-3 text-center"> $ {TSpent2.toFixed(2)}</td>
                <td className="p-3 text-center">৳ {totalBill.toFixed(2)}</td>
                <td className="p-3 text-center"> ৳ {totalPayment2.toFixed(2)}</td>
                <td className="p-3 text-center"> ৳ {totalDue.toFixed(2)}</td>
              </tr>
            </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AdsUser;
