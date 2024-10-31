import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import useCampaings from "../../Hook/useCampaign";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import useMpayment from "../../Hook/UseMpayment";
import { Helmet } from "react-helmet-async";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const ClientHome = () => {
  const { user } = useContext(AuthContext);
  const [clients] = useClients();
  const [datas, setDatas] = useState();
  const [MPayment] = useMpayment();
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlySpentData, setMonthlySpentData] = useState([]);
  const [monthlyCombinedData, setMonthlyCombinedData] = useState([]);

  useEffect(() => {
    if (user?.email) {
      const realdata = clients.find((m) => m.clientEmail === user?.email);
      setDatas(realdata);
    }
  }, [user?.email, clients]);

  const [campaign] = useCampaings();
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [totalPaymeent, setTotalPayment] = useState([]);
  const [users] = useUsers();
  const [ddd, setDdd] = useState(null);

  useEffect(() => {
    if (users && user) {
      const fff = users.find((u) => u.email === user?.email);
      setDdd(fff || {});
    }
  }, [users, user]);

  useEffect(() => {
    const filtered = campaign.filter(
      (campaign) => campaign.clientEmail === user?.email
    );
    const totalBill = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
      0
    );
    setTotalBills(totalBill);

    const totalSpent = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tSpent),
      0
    );
    setTotalSpent(totalSpent);
  }, [campaign, user?.email]);

  useEffect(() => {
    const realdata = MPayment.filter((m) => m.clientEmail === user?.email);
    const totalBill = realdata.reduce(
      (acc, campaign) => acc + parseFloat(campaign.amount),
      0
    );
    setTotalPayment(totalBill);

    // Prepare monthly payment data
    const paymentsByMonth = {};
    realdata.forEach((payment) => {
      const date = new Date(payment.date);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;

      if (!paymentsByMonth[monthYear]) {
        paymentsByMonth[monthYear] = 0;
      }
      paymentsByMonth[monthYear] += parseFloat(payment.amount);
    });

    // Generate last 12 months for payments
    const last12Months = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthYear = month.toLocaleString("default", { month: "long" }) + ' ' + month.getFullYear();
      last12Months.push({
        monthYear,
        amount: paymentsByMonth[monthYear] || 0,
      });
    }

    setMonthlyData(last12Months.reverse());
  }, [user?.email, MPayment]);

  // New effect for monthly tSpent data
  useEffect(() => {
    const spentByMonth = {};
    campaign.forEach((item) => {
      if (item.clientEmail === user?.email) {
        const date = new Date(item.date);
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        const monthYear = `${month} ${year}`;

        if (!spentByMonth[monthYear]) {
          spentByMonth[monthYear] = 0;
        }
        spentByMonth[monthYear] += parseFloat(item.tSpent);
      }
    });

    // Generate last 12 months for tSpent
    const lastSpentMonths = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthYear = month.toLocaleString("default", { month: "long" }) + ' ' + month.getFullYear();
      lastSpentMonths.push({
        monthYear,
        amount: spentByMonth[monthYear] || 0,
      });
    }

    setMonthlySpentData(lastSpentMonths.reverse());
  }, [campaign, user?.email]);

  // New effect for combined data
  useEffect(() => {
    const combinedData = [];
    const months = [...new Set([...monthlyData, ...monthlySpentData].map(data => data.monthYear))];

    months.forEach(monthYear => {
      const spent = monthlySpentData.find(data => data.monthYear === monthYear)?.amount || 0;
      const payments = monthlyData.find(data => data.monthYear === monthYear)?.amount || 0;
      const bill = spent * 140; // Assuming dollarRate is fixed at 140 for calculations

      combinedData.push({
        monthYear,
        spent,
        bill,
        payments,
      });
    });

    setMonthlyCombinedData(combinedData);
  }, [monthlyData, monthlySpentData]);

  return (
    <div className="mt-5 lg:px-5">
      <Helmet>
        <title>{`User Profile | ${user?.displayName}`}</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-3 lg:gap-5 justify-around p-5">
        <div className="px-5 py-10 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-500 text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total Spent</h2>
          <p className="lg:text-4xl text-xl font-bold mt-2">$ {totalSpent.toFixed(2)}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total Bill</h2>
          <p className="lg:text-4xl text-xl font-bold mt-2">
            <span className="lg:text-4xl text-xl font-extrabold">৳</span> {totalBills.toFixed(2)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-gradient-to-r from-yellow-400 to-red-500 text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total Paid</h2>
          <p className="lg:text-4xl text-xl font-bold mt-2">
            <span className="lg:text-4xl text-xl font-extrabold">৳</span> {parseInt(totalPaymeent).toFixed(2)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total <span>{((totalBills - totalPaymeent).toFixed(2)) >= 0 ? 'Due' : 'Advance'}</span></h2>
          <p className="lg:text-4xl text-xl font-bold mt-2">
            <span className="lg:text-4xl text-xl font-extrabold">৳</span> {Math.abs((totalBills - totalPaymeent).toFixed(2))}
          </p>
        </div>
      </div>

<div className="pr-5 ">
          {/* Monthly Payments Chart */}
          <h2 className="text-center text-xl text-black font-bold underline px-5 mb-4">Monthly Payments</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData}>
          <XAxis dataKey="monthYear" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#ff7300" strokeWidth={2} dot={{ fill: '#ff7300' }} />
        </LineChart>
      </ResponsiveContainer>

      {/* Monthly tSpent Chart */}
      <h2 className="text-center text-xl text-black px-5 font-bold mb-4">Monthly Total Spent</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlySpentData}>
          <XAxis dataKey="monthYear" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#00C49F" strokeWidth={2} dot={{ fill: '#00C49F' }} />
        </LineChart>
      </ResponsiveContainer>

      {/* Combined Bar Chart */}
      <h2 className="text-center text-xl text-black px-5 font-bold mb-4">Monthly Overview: Spent, Bill, and Payments</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyCombinedData}>
          <XAxis dataKey="monthYear" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip />
          <Bar dataKey="spent" fill="#00C49F" />
          <Bar dataKey="bill" fill="#ff7300" />
          <Bar dataKey="payments" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
</div>
    </div>
  );
};

export default ClientHome;
