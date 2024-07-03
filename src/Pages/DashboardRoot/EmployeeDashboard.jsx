import { Link, NavLink, useNavigate } from "react-router-dom";
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
  const {user,logOut}=useContext(AuthContext)




  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut().then().catch();
    navigate("/login");
  };

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
        <div className="flex justify-start gap-2 px-4 items-center text-white ">
        <img className="h-10 w-10 rounded-full" src={user?.photoURL} alt="" />
        <h1>{user?.displayName}</h1>
        </div>
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

             <button
                          onClick={handleLogOut}
                          className="font-avenir w-full px-3 py-1 bg-red-700 rounded text-white"
                        >
                          Logout
                        </button>
          
    </ul>
    </div>
  </div>
  

  );
};
export default EmployeeDashboard;
