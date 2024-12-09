import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

// Register necessary components for Doughnut chart
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const DoughnutChart = ({ data4, options4 }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-color3)",
        color: "var(--text-color2)",
        border: "var(--border)",
      }}
      className="bg-gray-800 mb-5 rounded-lg p-5"
    >
      <h1 className="font-bold text-xl rounded-t-lg border-gray-300 pb-3">
        Salary Overview
      </h1>
      <Doughnut data4={data4} options4={options4} />
    </div>
  );
};

export default DoughnutChart;
