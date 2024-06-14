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
    <div className="overflow-y-scroll h-screen">
      <div className="w-[250px]">
        <img
          className="w-44 mx-auto"
          src="https://i.ibb.co/Cnvg0RS/Digital-Network-Logo.png"
          alt=""
        />
        <ul className="space-y-5">
          <li className="bg-[#003A90] rounded-lg my-2">
            <NavLink
              to="/dashboard/employee/home"
              activeClassName="text-red-500 bg-red-200"
              className="flex items-center py-2 px-4 rounded-lg"
            >
              <RxDashboard className="mr-2" />
              My Dashboard
            </NavLink>
          </li>
                <li>
                  <NavLink
                    to="dashboard/myCampaigns"
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <MdCampaign className="w-6 h-6" />My Campaigns
                  </NavLink>
                </li>
                <li>
                  <NavLink
                   to={`dashboard/myClients`}
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <IoIosPeople className="w-6 h-6" /> My Clients
                  </NavLink>
                </li>
               
                <li>
                  <NavLink
                    to={`dashboard/adsAccount/${user?.email}`}
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <MdAccountCircle className="w-6 h-6" />My Ads Accounts
                  </NavLink>
                </li>

          <li className="bg-[#003A90] rounded-lg my-2">
            <NavLink to="/">
              <FaHome className="mr-2" />
              Go Home
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default EmployeeDashboard;
