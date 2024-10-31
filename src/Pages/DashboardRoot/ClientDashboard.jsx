import { Link, NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle } from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "../../Security/AuthProvider";

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: '#05a0db', color: 'white' }
      : {}
  );

  return (
    <div className="overflow-hidden h-screen">
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
            to='dashboard/clientCampaigns'
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            Campaigns
          </NavLink>
          <NavLink
            to='dashboard/paymentsClient'
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            Payments
          </NavLink>

        </ul>
      </div>
    </div>
  );
};
export default ClientDashboard;
