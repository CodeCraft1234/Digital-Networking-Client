const BalanceCard = ({ img, amount }) => {
  return (
    <div>
      <div 
        style={{ backgroundColor: '#f7e8e8', border: 'var(--border)' }} 
        className="card-div rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
      >
        <img className="logo" src={img} alt="bKash Merchant" />
        <p className="card-title">
          <span>৳</span>
          {new Intl.NumberFormat("en-IN", {
            maximumFractionDigits: 2,
          }).format(isNaN(amount) ? 0 : amount)}
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
