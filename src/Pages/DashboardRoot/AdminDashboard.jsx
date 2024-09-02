import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaAngleDown,
  FaAngleUp,
  FaBlog,
  FaBlogger,
  FaBorderAll,
  FaCog,
  FaEmpire,
  FaHistory,
  FaHome,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup, IoMdCash } from 'react-icons/io';
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle, MdCampaign, MdOutlinePayment, MdOutlinePayments, MdPayments } from "react-icons/md";
import { IoLogOutOutline, IoPeopleSharp, IoSettingsSharp } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import useLogo from "../../Hook/useLogo";
import { AiFillDashboard, AiTwotoneDashboard } from "react-icons/ai";
import { Menu } from "@headlessui/react";
import { AuthContext } from "../../Security/AuthProvider";
import { RiSecurePaymentFill, RiSecurePaymentLine } from "react-icons/ri";
import { LuActivitySquare } from "react-icons/lu";

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
      ? { backgroundColor: '#05a0db', color: 'white' }
      : {}
  );

  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: '#05a0db', color: 'white' }
      : {}
  );

  return (
    <div className=" bg-gray-900 h-screen">
      <div className="w-[200px]">
       <Link to={'/'}>
       <div className="flex  items-center justify-center py-4">
          <Link to={"/"}>
            <img
              className="w-24"
              src="https://i.ibb.co/rvH9Bz0/Logo-01.png"
              alt="Logo"
            />
          </Link>
        </div>
       </Link>
        <ul className=" ">

          <NavLink
            to="/"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Dashboard
          </NavLink>

          <NavLink
            to="dashboard/allAdSAccount"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" /> Ads Accounts
          </NavLink>
          <NavLink
            to="dashboard/allCampaign"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdCampaign className="w-6 h-6 mr-2" />All Campaigns
          </NavLink>

         
         

         

         
         
          {/* <NavLink
                  to="dashboard/adsUser"
                  className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <FaPeopleGroup className="w-6 h-6 mr-2" />
                  Ads User
                </NavLink> */}
             
         




        
        
        
         
          
         
          <NavLink
                  to="dashboard/allUsers"
                  className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <FaPeopleGroup className="w-6 h-6 mr-2" />
                  All Users
                </NavLink>
          <NavLink
                  to="dashboard/allClients"
                  className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <IoPeopleSharp className="w-6 h-6 mr-2" />
                 All Clients
                </NavLink>
          <NavLink
           to="dashboard/paymentHistory"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdOutlinePayments  className="w-6 h-6 mr-2" />
            Pay History
          </NavLink>
       
          <NavLink
            to={`dashboard/AllSummery`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <LuActivitySquare  className="w-6 h-6 mr-2" />
           All Summery
          </NavLink>
         
          <NavLink
            to="/dashboard/history"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
           <FaHistory className="w-6 h-6 mr-2" />History
          </NavLink>
          <NavLink
            to="/dashboard/sellery"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <IoMdCash  className="w-6 h-6 mr-2" />Salary
          </NavLink>

         



          
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
