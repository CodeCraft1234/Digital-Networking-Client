import { Link, NavLink, } from "react-router-dom";
import {

  FaHistory,
  FaPaypal,

} from "react-icons/fa";
import { IoMdCash,  } from 'react-icons/io';
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle, MdCampaign,  MdOutlinePayments,  } from "react-icons/md";
import {  IoPeopleSharp } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuActivitySquare } from "react-icons/lu";
import { CiBank } from "react-icons/ci";

const AdminDashboard = () => {

  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: 'var(--bg-colorActive)', color: 'var(--text-color)' }
      : {}
  );

  return (
    <div  className="w-[225px]  text-white bg-gray-900 -mt-3 -ml-2 pr-2 min-h-screen">
      <div className="">
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
                  to="/clients"
                  className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <IoPeopleSharp className="w-6 h-6 mr-2" />
                 Clients
                </NavLink>
          <NavLink
            to="/metaAds"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdCampaign className="w-6 h-6 mr-2" />Meta Ads
          </NavLink>

          <NavLink
            to="/googleAds"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdCampaign className="w-6 h-6 mr-2" />Google Ads
          </NavLink>

          <NavLink
            to="/pageSetup"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdCampaign className="w-6 h-6 mr-2" />
            Page Setup
          </NavLink>
         
         
          <NavLink
           to="/allPayments"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdOutlinePayments  className="w-6 h-6 mr-2" />
            Payments
          </NavLink>
       
          <NavLink
            to="/salary"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <IoMdCash  className="w-6 h-6 mr-2" />All Salary
          </NavLink>

          <NavLink
            to="/AdsAccount"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" /> Ads Account
          </NavLink>
         
          <NavLink
            to={`/monthlySpend`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <FaHistory className="w-6 h-6 mr-2" />
            Monthly Spend
          </NavLink>

          <NavLink
            to={`/summery`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <LuActivitySquare  className="w-6 h-6 mr-2" />
           All Summery
          </NavLink>

         

          <NavLink
                  to="/allUsers"
                  className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <FaPeopleGroup className="w-6 h-6 mr-2" />
                  All Users
                </NavLink>

          <NavLink
            to="/payoneer"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <FaPaypal className="w-6 h-6 mr-2" /> Payoneer
          </NavLink>

<NavLink
            to={`/bankInfo`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
           <CiBank   className="w-6 h-6 mr-2" />
           Bank Info
          </NavLink>
          
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
