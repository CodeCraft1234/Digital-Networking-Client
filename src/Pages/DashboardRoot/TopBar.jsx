import { useLocation } from "react-router-dom";

export default function TopBar() {
  const location = useLocation();

  // Find dynamic title based on path
  const getTitle = () => {
    if (location.pathname.includes('/clients')) return 'ক্লায়েন্টস';
    if (location.pathname.includes('/employees')) return 'এমপ্লয়ি';
    if (location.pathname.includes('/campaigns')) return 'ক্যাম্পেইন';
    if (location.pathname.includes('/allPayments')) return 'পেমেন্টস';
    return 'ইনবক্স'; // Default title
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-pink-600 text-white flex items-center justify-between px-4 py-3 shadow-md">
        <p></p>
      <h1 className="text-lg text-center font-bold">{getTitle()}</h1>
      <div className="relative">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Origami_bird.svg/1024px-Origami_bird.svg.png" 
          alt="Icon"
          className="w-6 h-6"
        />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
      </div>
    </div>
  );
}
