import { Link, NavLink } from "react-router-dom";
import { FaHistory, FaPaypal} from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle, MdCampaign, MdOutlineSummarize } from "react-icons/md";
import { useContext } from "react";
import { FaPeopleGroup } from "react-icons/fa6";
import { AuthContext } from "../../Security/AuthProvider";
import { LuActivitySquare } from "react-icons/lu";
import { CiBank } from "react-icons/ci";



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
                  to="dashboard/myClients"
                  className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <FaPeopleGroup className="w-6 h-6 mr-2" />
                  My Clients
                </NavLink>
          <NavLink
            to="dashboard/myCampaigns"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdCampaign className="w-6 h-6 mr-2" />
            Campaigns
          </NavLink>
         
          <NavLink
            to={`dashboard/myAdsAccount/:email`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            Ads Accounts
          </NavLink>
         
          <NavLink
            to={`dashboard/myPayments`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
           My Payments
          </NavLink>
          <NavLink
            to={`dashboard/mySellery`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdOutlineSummarize className="w-6 h-6 mr-2" />
            My Salary
          </NavLink>
          <NavLink
            to={`dashboard/myhistory`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <FaHistory className="w-6 h-6 mr-2" />
            My History
          </NavLink>

          <NavLink
            to={`dashboard/mySummery`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <LuActivitySquare  className="w-6 h-6 mr-2" />
           My Summery
          </NavLink>
          <NavLink
            to="dashboard/payoneer"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <FaPaypal className="w-6 h-6 mr-2" /> Payoneer
          </NavLink>
          <NavLink
            to={`dashboard/bankInfo`}
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
