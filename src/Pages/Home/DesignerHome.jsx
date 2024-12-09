import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import useUsersSellery from '../../Hook/useUsersSellery';
import { AuthContext } from '../../Security/AuthProvider';

// Register the Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const DesignerHome = () => {
  const [chartData, setChartData] = useState(null);
  const { user } = useContext(AuthContext);
  const [usersSellery] = useUsersSellery(user?.email);

  useEffect(() => {
    if (usersSellery) {
      const { sellery } = usersSellery;

      const monthlyData = months.map(month => {
        const selleryData = (sellery || []).filter(sell => sell.month === month);
        const totalSellery = selleryData.reduce((acc, sell) => acc + (sell.amount || 0), 0);
        return totalSellery;
      });

      // Set up data for the chart
      setChartData({
        labels: months,
        datasets: [
          {
            label: 'Total Salary (৳)',
            data: monthlyData,
            borderColor: '#05a0db',
            backgroundColor: 'rgba(5, 160, 219, 0.5)',
            fill: true,
          },
        ],
      });
    }
  }, [usersSellery]);

  return (
    <div className="m-5">
      <Helmet>
        <title>Developers Salary | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="p-5 rounded-lg" style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)' }}>
        <div className="w-full h-[600px]">
          {chartData ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false, // Allow full-width resizing
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Monthly Total Salary Data (৳)',
                  },
                },
              }}
            />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignerHome;
