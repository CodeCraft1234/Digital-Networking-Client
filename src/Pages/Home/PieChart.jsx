import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data27, options27 }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-color3)",
        color: "var(--text-color2)",
        
      }}
      className="bg-gray-800 rounded-lg "
    >
      <h1 className="font-bold text-xl rounded-t-lg border-gray-300 pb-3">
        Income Overview
      </h1>
      <Pie data={data27} options={options27} />
    </div>
  );
};

export default PieChart;
