
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChart = ({ data }) => {

  const chartData = [
    {
      name: 'Today',
      income: data.today,
      adminPay: data.todayAdminPay,
    },
    {
      name: 'This Week',
      income: data.thisWeek,
      adminPay: data.thisWeekAdminPay,
    },
    {
      name: 'This Month',
      income: data.thisMonth,
      adminPay: data.thisMonthAdminPay,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="adminPay"
          stroke="#82ca9d"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
