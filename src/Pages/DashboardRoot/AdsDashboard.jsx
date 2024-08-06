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

const AdsDashboard = () => {
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
            to="/dashboard/ads/home"
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Dashboard
          </NavLink>
      
          <NavLink
            to={`dashboard/adsAccountCenter/${user?.email}`}
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            Ads Accounts
          </NavLink>
          <NavLink
            to='dashboard/adsPayments'
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            Payments
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
export default AdsDashboard;
