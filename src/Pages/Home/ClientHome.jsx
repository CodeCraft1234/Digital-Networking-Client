import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
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
import useMpayment from "../../Hook/UseMpayment";
import useFindClient from "./useFindClient";
import SummaryCard from "./SummeryCard";

const ClientHome = () => {
  const { user } = useContext(AuthContext);
  const [MPayment] = useMpayment();
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlySpentData, setMonthlySpentData] = useState([]);
  const [monthlyCombinedData, setMonthlyCombinedData] = useState([]);
  const [clientUser, setClientUser] = useState(null);

  const { findClients } = useFindClient(clientUser);

  // Load the client user from local storage
  useEffect(() => {
    const storedClientUser = localStorage.getItem("clientUser");
    if (storedClientUser) {
      setClientUser(storedClientUser);
    }
  }, []);

  // Monthly Payments Data
  useEffect(() => {
    const realdata = findClients?.payments?.filter((m) => m.clientEmail === clientUser);

    const paymentsByMonth = {};
    realdata?.forEach((payment) => {
      const date = new Date(payment.date);
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (!paymentsByMonth[monthYear]) {
        paymentsByMonth[monthYear] = 0;
      }
      paymentsByMonth[monthYear] += parseFloat(payment.amount);
    });

    const last12Months = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthYear = `${month.toLocaleString("default", {
        month: "long",
      })} ${month.getFullYear()}`;
      last12Months.push({
        monthYear,
        amount: paymentsByMonth[monthYear] || 0,
      });
    }

    setMonthlyData(last12Months.reverse());
  }, [user?.email, MPayment]);

  // Monthly Spent Data
  useEffect(() => {
    if (!findClients) return;

    const spentByMonth = {};
    findClients?.campaings?.forEach((item) => {
      if (item.clientEmail === clientUser) {
        const date = new Date(item.date);
        const monthYear = `${date.toLocaleString("default", {
          month: "long",
        })} ${date.getFullYear()}`;

        if (!spentByMonth[monthYear]) {
          spentByMonth[monthYear] = 0;
        }
        spentByMonth[monthYear] += parseFloat(item.tSpent);
      }
    });

    const lastSpentMonths = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthYear = `${month.toLocaleString("default", {
        month: "long",
      })} ${month.getFullYear()}`;
      lastSpentMonths.push({
        monthYear,
        amount: spentByMonth[monthYear] || 0,
      });
    }

    setMonthlySpentData(lastSpentMonths.reverse());
  }, [findClients,clientUser, user?.email]);

  // Combined Data
  useEffect(() => {
    const combinedData = [];
    const allMonths = new Set([
      ...monthlyData.map((data) => data.monthYear),
      ...monthlySpentData.map((data) => data.monthYear),
    ]);

    allMonths.forEach((monthYear) => {
      const spent = monthlySpentData.find((data) => data.monthYear === monthYear)?.amount || 0;
      const payments = monthlyData.find((data) => data.monthYear === monthYear)?.amount || 0;
      const bill = spent * 140; // Dollar rate assumption

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
    <div className="">
      <Helmet>
        <title>{`User Profile | ${user?.displayName}`}</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 mt-5 rounded-lg md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-3 lg:gap-3 justify-around">
        <SummaryCard
          title="Total Spend"
          value={findClients?.campaings?.reduce(
            (acc, campaign) => acc + parseFloat(campaign?.tSpent || 0),
            0
          ).toFixed(2)}
        />
 <SummaryCard title="Total Bill" value={findClients?.campaings?.reduce(
    (acc, campaign) =>
      acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
    0
  ).toFixed(0)} />
        <SummaryCard
          title="Total Paid"
          value={findClients?.payments?.reduce(
            (acc, payment) => acc + parseFloat(payment?.amount || 0),
            0
          ).toFixed(2)}
        />
<SummaryCard
  title={`Total ${
    (findClients?.campaings?.reduce(
      (acc, campaign) =>
        acc +
        parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollarRate || 0),
      0
    ) -
      findClients?.payments?.reduce(
        (acc, payment) => acc + parseFloat(payment?.amount || 0),
        0
      )) >= 0
      ? "Due"
      : "Advance"
  }`}
  value={Math.abs(
    findClients?.campaings?.reduce(
      (acc, campaign) =>
        acc +
        parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollarRate || 0),
      0
    ) -
      findClients?.payments?.reduce(
        (acc, payment) => acc + parseFloat(payment?.amount || 0),
        0
      ) || 0
  ).toFixed(0)}
/>

      </div>

      {/* Charts */}
      <div className="pr-5 grid lg:grid-cols-2 my-10 gap-5">
       <div className="border border-gray-500 p-5 rounded-lg">
       <h2 className="text-center text-xl text-black font-bold underline px-5 mb-4">
          Monthly Payments
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <XAxis dataKey="monthYear" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#ff7300"
              strokeWidth={2}
              dot={{ fill: "#ff7300" }}
            />
          </LineChart>
        </ResponsiveContainer>

       </div>
        <div className="border border-gray-500 p-5 rounded-lg">
        <h2 className="text-center text-xl text-black font-bold underline px-5 mb-4">
          Monthly Total Spent
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySpentData}>
            <XAxis dataKey="monthYear" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#00C49F"
              strokeWidth={2}
              dot={{ fill: "#00C49F" }}
            />
          </LineChart>
        </ResponsiveContainer>
        </div>

       

          <div className="border border-gray-500 p-5 rounded-lg">
          <h2 className="text-center text-xl text-black font-bold underline px-5 mb-4">
          Monthly Overview: Spent, Bill, and Payments
        </h2>
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
          <div className="border border-gray-500 p-5 rounded-lg">
          <h2 className="text-center text-xl text-black font-bold underline px-5 mb-4">
          Monthly Overview: Spent, Bill, and Payments
        </h2>
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
    </div>
  );
};

export default ClientHome;
