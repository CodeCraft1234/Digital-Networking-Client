const SummaryCard = ({ title, value }) => {
  const currencySymbol = ["Total Spend", "Daily Spend", "Monthly Target", "Yearly Target"].includes(title) ? "$" : "৳";


  return (
    <div
      style={{
        backgroundColor: "var(--bg-colorCard)",
        color: "var(--text-color)",
        border: "var(--border)",
      }}
      className="px-5 py-10 shadow-2xl rounded-2xl text-white  text-center"
    >
      <h2 className="color-card-title">{title}</h2>
      <p className="color-card-subtitle">
        <span className="currency-symbol">{currencySymbol} </span>
        {value || 0}
      </p>
    </div>
  );
};

export default SummaryCard;
