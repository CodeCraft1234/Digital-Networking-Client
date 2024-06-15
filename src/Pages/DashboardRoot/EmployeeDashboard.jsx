import { NavLink } from "react-router-dom";
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
        <img
          className="w-24"
          src="https://i.ibb.co/Cnvg0RS/Digital-Network-Logo.png"
          alt="Logo"
        />
      </div>
      <ul className="space-y-1">
        <li className="my-1 text-base">
          <NavLink
            to="/dashboard/employee/home"
            activeClassName="text-red-500 bg-red-200"
            className="flex items-center py-3 px-6 rounded-lg hover:bg-gray-800"
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            <span className="font-medium">Dashboard</span>
          </NavLink>
        </li>
  
        <li className="my-1 text-base">
          <NavLink
            to="dashboard/AddClients"
            className="flex items-center py-3 px-6 rounded-lg hover:bg-gray-800"
            activeClassName="bg-green-300"
          >
            <IoPeopleSharp className="w-6 h-6 mr-2" />
            <span className="font-medium">Add Clients</span>
          </NavLink>
        </li>
  
        <li className="my-1 text-base">
          <NavLink
            to="dashboard/myCampaigns"
            className="flex items-center py-3 px-6 rounded-lg hover:bg-gray-800"
            activeClassName="bg-green-300"
          >
            <MdCampaign className="w-6 h-6 mr-2" />
            <span className="font-medium">Campaigns</span>
          </NavLink>
        </li>
  
        <li className="my-1 text-base">
          <NavLink
            to="dashboard/myClients"
            className="flex items-center py-3 px-6 rounded-lg hover:bg-gray-800"
            activeClassName="bg-green-300"
          >
            <IoIosPeople className="w-6 h-6 mr-2" />
            <span className="font-medium">Clients</span>
          </NavLink>
        </li>
        
        <li className="my-1 text-base">
          <NavLink
            to={`dashboard/adsAccount/${user?.email}`}
            className="flex items-center py-3 px-6 rounded-lg hover:bg-gray-800"
            activeClassName="bg-green-300"
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            <span className="font-medium">Ads Accounts</span>
          </NavLink>
        </li>
        <li className="my-1 text-base">
          <NavLink
            to={`dashboard/adsAccount/${user?.email}`}
            className="flex items-center py-3 px-6 rounded-lg hover:bg-gray-800"
            activeClassName="bg-green-300"
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </li>
        <li className="my-1 text-base">
          <NavLink
            to={`/`}
            className="flex items-center py-3 px-6 rounded-lg hover:bg-gray-800"
            activeClassName="bg-green-300"
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            <span className="font-medium">Home</span>
          </NavLink>
        </li>
      </ul>
    </div>
  </div>
  

  );
};
export default EmployeeDashboard;
