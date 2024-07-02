import { Link, NavLink } from "react-router-dom";
import {
  FaBlog,
  FaBlogger,
  FaBorderAll,
  FaEmpire,
  FaHome,
  FaUsers,
} from "react-icons/fa";

import { RxDashboard } from "react-icons/rx";

import { MdAccountCircle, MdCampaign } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { FaPeopleGroup,  } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from "../../Security/AuthProvider";

const EmployeeDashboard = () => {
  const {user}=useContext(AuthContext)

  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: 'purple', color: 'white' }
      : {}
  );
  return (
    <div className="overflow-hidden h-screen">
    <div className="w-[200px] bg-gray-900 text-white">
      <div className="flex items-center justify-center py-4">
       <Link to={'/'}>
       
       <img
          className="w-24"
          src="https://i.ibb.co/Cnvg0RS/Digital-Network-Logo.png"
          alt="Logo"
        /></Link>
      </div>
      <ul className="space-y-1">
      <NavLink
             to="/dashboard/employee/home"
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Dashboard
          </NavLink>
      <NavLink
             to="dashboard/AddClients"
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Add Clients
          </NavLink>
      <NavLink
              to="dashboard/myCampaigns"
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Campaigns
          </NavLink>
      <NavLink
             to="dashboard/myClients"
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Clients
          </NavLink>
      <NavLink
              to={`dashboard/adsAccount/${user?.email}`}
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Ads Accounts
          </NavLink>
    </ul>
    </div>
  </div>
  

  );
};
export default EmployeeDashboard;
