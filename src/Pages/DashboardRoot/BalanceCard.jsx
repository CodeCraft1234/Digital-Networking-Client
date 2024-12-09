
const BalanceCard = ({img,amount}) => {
    return (
        <div>
            <div 
      style={{ backgroundColor: '#f7e8e8', border: 'var(--border)' }} 
      className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    >
      <img className="balance-card-img mx-auto h-10" src={img} alt="bKash Merchant" />
      <p className="balance-card-text text-lg lg:text-xl font-bold text-gray-700">
        <span className="text-lg lg:text-xl font-extrabold">৳</span>
        {amount}
      </p>
    </div>
        </div>
    );
};

export default BalanceCard;