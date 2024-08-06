import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBlog,
  FaBlogger,
  FaBorderAll,
  FaDAndD,
  FaEmpire,
  FaHome,
  FaUsers,
} from "react-icons/fa";

import { RxDashboard } from "react-icons/rx";

import { MdAccountCircle, MdCampaign, MdOutlinePayments, MdOutlineSummarize } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";


import { IoIosAddCircleOutline, IoIosPeople, IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useContext, useState } from "react";

import { FaPeopleGroup, FaUser } from "react-icons/fa6";




import { AuthContext } from "../../Security/AuthProvider";
import { GiClick } from "react-icons/gi";
import { RiSecurePaymentFill, RiSecurePaymentLine } from "react-icons/ri";

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

  const getActiveStyle2 = (isActive) => (
    isActive
      ? { backgroundColor: 'green', color: 'white' }
      : {}
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpenTwo, setIsOpenTwo] = useState(false);










  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropdown2 = () => {
    setIsOpen(!isOpen2);
  };
  const toggleDropdownTwo = () => {
    setIsOpenTwo(!isOpenTwo);
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave2 = () => {
    setIsOpen2(false);
  };
  const handleMouseEnter2 = () => {
    setIsOpen2(true);
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
          <div className="relative" onMouseLeave={handleMouseLeave2}>
            <NavLink
              to="dashboard/myClients"
              className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
              style={({ isActive }) => getActiveStyle(isActive)}
              onMouseEnter={handleMouseEnter2}
            >
              <GiClick className="w-6 h-6 mr-2" />
              Clients
              {isOpen2 ? (
                <IoMdArrowDropup className="w-6 h-6 ml-2" />
              ) : (
                <IoMdArrowDropdown className="w-6 h-6 ml-2" />
              )}
            </NavLink>
            {isOpen2 && (
              <div
                className="absolute top-full left-0 w-48 bg-gray-600 rounded-lg shadow-lg py-2 z-50 animate-dropdown"
                onMouseEnter={handleMouseEnter2}
                onMouseLeave={handleMouseLeave2}
              >
                <NavLink
                  to="dashboard/myClients"
                  className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <FaPeopleGroup className="w-6 h-6 mr-2" />
                  My Clients
                </NavLink>
                <NavLink
                 to="dashboard/AddClients"
                  className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <IoIosAddCircleOutline className="w-6 h-6 mr-2" />
                  Add Clients
                </NavLink>
               
               
              </div>
            )}
          </div>

          <NavLink
            to="dashboard/myCampaigns"
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdCampaign className="w-6 h-6 mr-2" />
            Campaigns
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
           to="dashboard/adminPayments"
              className="text-white  py-2 px-4 rounded-lg flex items-center"
              onMouseEnter={handleMouseEnter}
            >
              <MdOutlinePayments className="w-6 h-6 mr-2" />
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
                  style={({ isActive }) => getActiveStyle2(isActive)}
                >
                  <RiSecurePaymentLine className="w-6 h-6 mr-2" />
                  Admin Pay
                </NavLink>
                <NavLink
                  to="dashboard/clientPayments"
                  className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle2(isActive)}
                >
                  <RiSecurePaymentFill className="w-6 h-6 mr-2" />
                  Client Pay
                </NavLink>
               
               
              </div>
            )}
          </div>
          <NavLink
            to={`dashboard/summery`}
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdOutlineSummarize className="w-6 h-6 mr-2" />
            Em Summery
          </NavLink>

          {user?.email ? (
            <NavLink>
               <div className="flex my-5 mt-16 justify-start gap-2 px-4 items-center text-white ">
        <img className="h-10 w-10 rounded-full" src={user?.photoURL} alt="" />
        <Link to={'/dashboard/updateProfile'}>
                <h1>{user?.displayName}</h1>
                </Link>
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
