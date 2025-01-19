import { Link, NavLink } from "react-router-dom";
import { FaHistory, FaPaypal} from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle, MdCampaign, MdOutlinePayments, MdOutlineSummarize } from "react-icons/md";
import { useContext } from "react";
import { FaPeopleGroup } from "react-icons/fa6";
import { AuthContext } from "../../Security/AuthProvider";
import { CiBank } from "react-icons/ci";
import { SiGoogleads, SiMeta } from "react-icons/si";
import { RiPagesFill } from "react-icons/ri";
import { TbHeartRateMonitor } from "react-icons/tb";
import { IoMdCash } from "react-icons/io";

const BalanceCard = ({ title, amount }) => {
  return (
    <div
    className="balance-card items-center rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105"
    style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', border: 'var(--border)' }}
  >
    <p className="text-lg lg:text-2xl font-bold my-2">
      <span className="text-lg lg:text-2xl font-extrabold">৳</span>
      {amount}
    </p>
    <h1 className="text-xl font-bold pb-2 text-center">{title}</h1>
  </div>
  
  );
};

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);

  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }
      : {}
  );
  const changeTab = (tab) => {
    localStorage.setItem("activeTabClientProfile", tab); 
  };

  return (
    <div className=" w-[225px] bg-gray-900 text-white -mt-3 -ml-2 pr-2 min-h-screen">
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
            to={`/adsAccount`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            Ads Account
          </NavLink>
          <NavLink
                  to="/clients"
                  className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <FaPeopleGroup className="w-6 h-6 mr-2" />
                 My Client
                </NavLink>
                <NavLink
            to="/campaigns"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center text-lg"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdCampaign className="w-6 h-6 mr-2" />
            Campaigns
          </NavLink>
          <NavLink
            to="/pageSetup"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <RiPagesFill className="w-6 h-6 mr-2" />
            Page Setup
          </NavLink>
          <NavLink
            to="/monitization"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <TbHeartRateMonitor className="w-6 h-6 mr-2" />
            Monitization
          </NavLink>
         
         
         
          <NavLink
            to={`/allPayments`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdOutlinePayments className="w-6 h-6 mr-2" />
           My Payment
          </NavLink>
          <NavLink
            to={`/summery`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdOutlineSummarize className="w-6 h-6 mr-2" />
           My Summery
          </NavLink>

          <NavLink
            to={`/monthlySpend`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <FaHistory className="w-6 h-6 mr-2" />
            Monthly Spend
          </NavLink>
          <NavLink
            to={`/salary`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <IoMdCash className="w-6 h-6 mr-2" />
            My Salary
          </NavLink>

         

          
         
          <NavLink
            to="/payoneer"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <FaPaypal className="w-6 h-6 mr-2" /> Payoneer
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
export default EmployeeDashboard;
