import { Link, NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle } from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { CiBank } from "react-icons/ci";
import { FaHistory } from "react-icons/fa";

const AdsDashboard = () => {
  const { user} = useContext(AuthContext);

  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }
      : {}
  );

  return (
    <div className="w-[225px]  text-white bg-gray-900 -mt-3 -ml-2 pr-2 min-h-screen">
      <div className="">
        <div className="flex  items-center justify-center py-4">
          <Link to={"/"}>
            <img
              className="w-24"
              src="https://i.ibb.co/rvH9Bz0/Logo-01.png"
              alt="Logo"
            />
          </Link>
        </div>
        <ul className="space-y-1">
        
          <NavLink
            to="/"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Dashboard
          </NavLink>
      
          <NavLink
            to={`/contributorAdsAccount`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            Ads Account
          </NavLink>
          <NavLink
            to='/contributorPayments'
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
           My Payment
          </NavLink>
          <NavLink
            to='/contributorSummery'
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}>
            <MdAccountCircle className="w-6 h-6 mr-2" />
           My Summery
          </NavLink>

          <NavLink
            to='/contributorMonthlySpend'
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}>
            <FaHistory className="w-6 h-6 mr-2" />
            Monthly Spend
          </NavLink>

          <NavLink
            to={`/bankInfo`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
           <CiBank   className="w-6 h-6 mr-2" />
           Bank Info
          </NavLink>

        </ul>
      </div>
    </div>
  );
};
export default AdsDashboard;
