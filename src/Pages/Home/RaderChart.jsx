import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary components for the radar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RadarChart = ({ data3, options3 }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-color3)",
        color: "var(--text-color2)",
       
      }}
      className="bg-gray-800 rounded-lg p-5"
    >
      <h1 className="font-bold text-xl rounded-t-lg border-gray-300 pb-3">
        Orders Overview
      </h1>
      <Radar data={data3} options={options3} />
    </div>
  );
};

export default RadarChart;
