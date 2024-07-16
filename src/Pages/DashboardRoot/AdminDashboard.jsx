import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaAngleDown,
  FaAngleUp,
  FaBlog,
  FaBlogger,
  FaBorderAll,
  FaCog,
  FaEmpire,
  FaHome,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle, MdCampaign, MdOutlinePayment, MdOutlinePayments } from "react-icons/md";
import { IoPeopleSharp, IoSettingsSharp } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import useLogo from "../../Hook/useLogo";
import { AiFillDashboard, AiTwotoneDashboard } from "react-icons/ai";
import { Menu } from "@headlessui/react";
import { AuthContext } from "../../Security/AuthProvider";
import { RiSecurePaymentFill, RiSecurePaymentLine } from "react-icons/ri";

const AdminDashboard = () => {
  const [logo, setLogo] = useLogo();
  const [latestLogo, setLatestLogo] = useState(null);
  console.log(latestLogo, logo);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTwo, setIsOpenTwo] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropdownTwo = () => {
    setIsOpenTwo(!isOpenTwo);
  };

  useEffect(() => {
    if (logo && logo.length > 0) {
      // Sort the logos based on date in descending order
      const sortedLogo = [...logo].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Get the latest logo
      const latest = sortedLogo[0];

      // Set the sorted logo and latest logo state
      setLogo(sortedLogo);
      setLatestLogo(latest);
    }
  }, [logo, setLogo]);


  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };
  const handleMouseEnter2 = () => {
    setIsOpenTwo(true);
  };

  const handleMouseLeave2 = () => {
    setIsOpenTwo(false);
  };


  
  const {user,logOut}=useContext(AuthContext)
  const navigate = useNavigate();
  const handleLogOut = () => {
    logOut().then().catch();
    navigate("/login");
  };

  const getActiveStyle2 = (isActive) => (
    isActive
      ? { backgroundColor: 'green', color: 'white' }
      : {}
  );

  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: 'green', color: 'white' }
      : {}
  );

  return (
    <div className="overflow-y-auto bg-gray-900 h-screen">
      <div className="w-[200px]">
       <Link to={'/'}>
       <div className="flex  items-center justify-center py-4">
          <Link to={"/"}>
            <img
              className="w-24"
              src="https://i.ibb.co/Cnvg0RS/Digital-Network-Logo.png"
              alt="Logo"
            />
          </Link>
        </div>
       </Link>
        <ul className=" space-y-1">

          <NavLink
            to="/dashboard/admin/home"
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Dashboard
          </NavLink>

          <NavLink
            to="dashboard/allAdSAccount"
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" /> Ads Accounts
          </NavLink>

         

          <div className="relative" onMouseLeave={handleMouseLeave}>
            <NavLink
              to="dashboard/allUsers"
              className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
              style={({ isActive }) => getActiveStyle(isActive)}
              onMouseEnter={handleMouseEnter}
            >
              <FaPeopleGroup className="w-6 h-6 mr-2" />
              Users
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
                  to="dashboard/allUsers"
                  className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <FaPeopleGroup className="w-6 h-6 mr-2" />
                  All Users
                </NavLink>
                <NavLink
                  to="dashboard/allClients"
                  className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <IoPeopleSharp className="w-6 h-6 mr-2" />
                  Clients
                </NavLink>
                <NavLink
                   to="dashboard/addEmployee"
                  className="text-white hover:bg-green-300 hover:text-black py-2 px-3 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <IoPeopleSharp className="w-6 h-6 mr-2" />
                  Add Employee
                </NavLink>
                <NavLink
                  to="dashboard/allEmployee"
                  className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <FaPeopleGroup className="w-6 h-6 mr-2" />
                  Employees
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="dashboard/allCampaign"
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdCampaign className="w-6 h-6 mr-2" /> Campaigns
          </NavLink>


          <div className="relative" onMouseLeave={handleMouseLeave2}>
            <NavLink
           to="dashboard/employeePayment"
              className="text-white  py-2 px-4 rounded-lg flex items-center"
              onMouseEnter={handleMouseEnter2}
            >
              <MdOutlinePayments className="w-6 h-6 mr-2" />
              Payments
              {isOpenTwo ? (
                <IoMdArrowDropup className="w-6 h-6 ml-2" />
              ) : (
                <IoMdArrowDropdown className="w-6 h-6 ml-2" />
              )}
            </NavLink>
            {isOpenTwo && (
              <div
                className="absolute top-full left-0 w-48 bg-gray-600 rounded-lg shadow-lg py-2 z-50 animate-dropdown"
                onMouseEnter={handleMouseEnter2}
                onMouseLeave={handleMouseLeave2}
              >
                <NavLink
                  to="dashboard/employeePayment"
                  className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle2(isActive)}
                >
                  <RiSecurePaymentLine className="w-6 h-6 mr-2" />
                  Admin Pay
                </NavLink>
                <NavLink
                  to="dashboard/AllClientsPayments"
                  className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle2(isActive)}
                >
                  <RiSecurePaymentFill className="w-6 h-6 mr-2" />
                  Clients Pay
                </NavLink>
               
               
              </div>
            )}
          </div>

          <NavLink
            to="/dashboard/settings"
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <IoSettingsSharp className="w-6 h-6 mr-2" /> Settings
          </NavLink>

         

          {
            user?.email ? <NavLink className='mt-10'
          
        >
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
        </NavLink> : <NavLink
              to={`/login`}
            className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"

          >
             <button
                        
                          className="font-avenir w-full px-3 py-1 bg-red-700 rounded text-white"
                        >
                          Login
                        </button>
          </NavLink>
          }

          
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
