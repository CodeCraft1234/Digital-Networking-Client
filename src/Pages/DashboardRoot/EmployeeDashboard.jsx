import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBlog,
  FaBlogger,
  FaBorderAll,
  FaDAndD,
  FaEmpire,
  FaHistory,
  FaHome,
  FaUsers,
} from "react-icons/fa";

import { RxDashboard } from "react-icons/rx";

import { MdAccountCircle, MdCampaign, MdOutlinePayments, MdOutlineSummarize } from "react-icons/md";
import { IoLogOutOutline, IoPeopleSharp } from "react-icons/io5";


import { IoIosAddCircleOutline, IoIosPeople, IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useContext, useState } from "react";

import { FaPeopleGroup, FaUser } from "react-icons/fa6";




import { AuthContext } from "../../Security/AuthProvider";
import { GiClick } from "react-icons/gi";
import { RiSecurePaymentFill, RiSecurePaymentLine } from "react-icons/ri";
import { LuActivitySquare } from "react-icons/lu";

const EmployeeDashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogOut = () => {
    logOut().then().catch();
    navigate("/login");
  };


  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: '#05a0db', color: 'white' }
      : {}
  );

  const getActiveStyle2 = (isActive) => (
    isActive
      ? { backgroundColor: '#f89320', color: 'white' }
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
                  to="dashboard/adminPayments"
                  className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle2(isActive)}
                >
                  <RiSecurePaymentLine className="w-6 h-6 mr-2" />
                  Admin Pay
                </NavLink>
                <NavLink
                  to="dashboard/clientPayments"
                  className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle2(isActive)}
                >
                  <RiSecurePaymentFill className="w-6 h-6 mr-2" />
                  Client Pay
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
            to={`dashboard/myActivity`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <LuActivitySquare  className="w-6 h-6 mr-2" />
            Activity
          </NavLink>
         
        </ul>
      </div>
    </div>
  );
};
export default EmployeeDashboard;
