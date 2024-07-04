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


import { IoIosPeople, IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useContext, useState } from "react";

import { FaPeopleGroup, FaUser } from "react-icons/fa6";




import { AuthContext } from "../../Security/AuthProvider";

const EmployeeDashboard = () => {
  const { user, logOut } = useContext(AuthContext);
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
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTwo, setIsOpenTwo] = useState(false);










  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropdownTwo = () => {
    setIsOpenTwo(!isOpenTwo);
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="overflow-hidden h-screen">
      <div className="w-[200px] bg-gray-900 text-white">
        <div className="flex  items-center justify-center py-4">
          <Link to={"/"}>
            <img
              className="w-24"
              src="https://i.ibb.co/Cnvg0RS/Digital-Network-Logo.png"
              alt="Logo"
            />
          </Link>
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
            <IoPeopleSharp className="w-6 h-6 mr-2" />
            Add Clients
          </NavLink>
          <NavLink
            to="dashboard/myCampaigns"
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdCampaign className="w-6 h-6 mr-2" />
            Campaigns
          </NavLink>
          <NavLink
            to="dashboard/myClients"
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <IoPeopleSharp className="w-6 h-6 mr-2" />
            Clients
          </NavLink>
          <NavLink
            to={`dashboard/adsAccount/${user?.email}`}
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            Ads Accounts
          </NavLink>
          <div className="relative" onMouseLeave={handleMouseLeave}>
            <NavLink
              to="dashboard/allUsers"
              className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
              style={({ isActive }) => getActiveStyle(isActive)}
              onMouseEnter={handleMouseEnter}
            >
              <FaPeopleGroup className="w-6 h-6 mr-2" />
              Payments
              {isOpen ? (
                <IoMdArrowDropup className="w-6 h-6 ml-2" />
              ) : (
                <IoMdArrowDropdown className="w-6 h-6 ml-2" />
              )}
            </NavLink>
            {isOpen && (
              <div
                className="absolute top-full left-0 w-48 bg-gray-600 rounded-lg shadow-lg py-2 z-50 animate-dropdown"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <NavLink
                  to="dashboard/adminPayments"
                  className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <FaPeopleGroup className="w-6 h-6 mr-2" />
                  Admin Pay
                </NavLink>
                <NavLink
                  to="dashboard/clientPayments"
                  className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <IoPeopleSharp className="w-6 h-6 mr-2" />
                  Client Pay
                </NavLink>
               
               
              </div>
            )}
          </div>

          {user?.email ? (
            <NavLink>
               <div className="flex my-5 mt-16 justify-start gap-2 px-4 items-center text-white ">
        <img className="h-10 w-10 rounded-full" src={user?.photoURL} alt="" />
        <h1>{user?.displayName}</h1>
        </div>
              <button
                onClick={handleLogOut}
                className="font-avenir w-full px-3 py-1 bg-red-700 rounded text-white"
              >
                Logout
              </button>
            </NavLink>
          ) : (
            <NavLink
              to={`/login`}
              className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            >
              <button className="font-avenir w-full px-3 py-1 bg-red-700 rounded text-white">
                Login
              </button>
            </NavLink>
          )}
        </ul>
      </div>
    </div>
  );
};
export default EmployeeDashboard;
