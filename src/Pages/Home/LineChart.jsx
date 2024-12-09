
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Ensures the Chart.js works correctly with React

const LineChart = ({ MyEmployeePayment, tPay }) => {
  const today = new Date();

  // Helper function to check if a date is in the given month and year
  const isInThisMonth = (date, month, year) => {
    const paymentDate = new Date(date);
    return paymentDate.getMonth() === month && paymentDate.getFullYear() === year;
  };

  // Prepare data for the chart
  const employeePaymentTotals = [];
  const transactionTotals = [];

  for (let month = 0; month < 12; month++) {
    // Employee Payment Totals
    const monthlyEmployeePayments = MyEmployeePayment.filter(
      (payment) =>
        isInThisMonth(payment.date, month, today.getFullYear()) &&
        payment.status === "Approved"
    );
    const monthlyEmployeeTotal = monthlyEmployeePayments.reduce(
      (acc, payment) => acc + parseFloat(payment.payAmount || 0),
      0
    );

    // Transaction Totals
    const monthlyTransactions = tPay?.filter((payment) =>
      isInThisMonth(payment.date, month, today.getFullYear())
    );
    const monthlyTransactionTotal = monthlyTransactions.reduce(
      (sum, payment) => sum + parseFloat(payment.amount || 0),
      0
    );

    // Push totals to arrays
    employeePaymentTotals.push(monthlyEmployeeTotal);
    transactionTotals.push(monthlyTransactionTotal);
  }

  // Chart Data
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Admin Payment",
        data: employeePaymentTotals,
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Area fill color
        fill: true,
        tension: 0.4, // Smooth curves
      },
      {
        label: "Income",
        data: transactionTotals,
        borderColor: "rgba(153, 102, 255, 1)", // Line color
        backgroundColor: "rgba(153, 102, 255, 0.2)", // Area fill color
        fill: true,
        tension: 0.4, // Smooth curves
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: 'var(--text-color)', // Legend text color
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: $${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'var(--text-color)', // X-axis text color
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: 'var(--text-color)',// Y-axis text color
          callback: (value) => `$${value.toFixed(2)}`, // Format Y-axis ticks
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
