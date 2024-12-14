const SummaryCard = ({ title, value }) => (
    <div
      style={{ backgroundColor: 'var(--bg-colorCard)',  color: 'var(--text-color)', border: 'var(--border)' }}
      className="px-5 py-10 rounded-2xl text-white shadow-lg text-center"
    >
      <h2 className="color-card-title">{title}</h2>
      <p className="color-card-subtitle">
        <span className="currency-symbol">৳ </span>{value}
      </p>
    </div>
  );
 export default SummaryCard  