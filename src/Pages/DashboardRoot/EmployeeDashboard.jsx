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
        className={({ isActive }) =>
          isActive
            ? "flex items-center py-3 px-6 rounded-lg bg-blue-500 text-red-500"
            : "flex items-center py-3 px-6 rounded-lg hover:bg-gray-800"
        }
      >
        <RxDashboard className="w-6 h-6 mr-2" />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="dashboard/AddClients"
        className={({ isActive }) =>
          isActive
            ? "flex items-center py-3 px-6 rounded-lg bg-green-300"
            : "flex items-center py-3 px-6 rounded-lg hover:bg-gray-800"
        }
      >
        <IoPeopleSharp className="w-6 h-6 mr-2" />
        <span>Add Clients</span>
      </NavLink>

      <NavLink
        to="dashboard/myCampaigns"
        className={({ isActive }) =>
          isActive
            ? "flex items-center py-3 px-6 rounded-lg bg-green-300"
            : "flex items-center py-3 px-6 rounded-lg hover:bg-gray-800"
        }
      >
        <MdCampaign className="w-6 h-6 mr-2" />
        <span>Campaigns</span>
      </NavLink>

      <NavLink
        to="dashboard/myClients"
        className={({ isActive }) =>
          isActive
            ? "flex items-center py-3 px-6 rounded-lg bg-green-300"
            : "flex items-center py-3 px-6 rounded-lg hover:bg-gray-800"
        }
      >
        <IoIosPeople className="w-6 h-6 mr-2" />
        <span>Clients</span>
      </NavLink>

      <NavLink
        to={`dashboard/adsAccount/${user?.email}`}
        className={({ isActive }) =>
          isActive
            ? "flex items-center py-3 px-6 rounded-lg bg-green-300"
            : "flex items-center py-3 px-6 rounded-lg hover:bg-gray-800"
        }
      >
        <MdAccountCircle className="w-6 h-6 mr-2" />
        <span>Ads Accounts</span>
      </NavLink>
    </ul>
    </div>
  </div>
  

  );
};
export default EmployeeDashboard;
