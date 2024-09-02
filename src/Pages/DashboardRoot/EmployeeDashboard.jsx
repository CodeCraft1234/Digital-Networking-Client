import { Link, NavLink } from "react-router-dom";
import { FaHistory} from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle, MdCampaign, MdOutlineSummarize } from "react-icons/md";
import { useContext } from "react";
import { FaPeopleGroup } from "react-icons/fa6";
import { AuthContext } from "../../Security/AuthProvider";
import { LuActivitySquare } from "react-icons/lu";

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);

  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: '#05a0db', color: 'white' }
      : {}
  );


  return (
    <div className=" h-screen">
      <div className="w-[200px] bg-gray-900 text-white">
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
            to={`dashboard/adsAccount/${user?.email}`}
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
         
        </ul>
      </div>
    </div>
  );
};
export default EmployeeDashboard;
