import { Link, NavLink, } from "react-router-dom";
import {

  FaHistory,
  FaPaypal,

} from "react-icons/fa";
import { IoMdCash,  } from 'react-icons/io';
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle, MdCampaign,  MdOutlinePayments,  } from "react-icons/md";
import {  IoNotificationsCircleSharp, IoPeopleSharp } from "react-icons/io5";
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
           to="dashboard/allPayments"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdOutlinePayments  className="w-6 h-6 mr-2" />
            Payments
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

          <NavLink
            to="dashboard/payoneer"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-3 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <FaPaypal className="w-6 h-6 mr-2" /> Payoneer
          </NavLink>

<NavLink
            to={`dashboard/bankInfo`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
           <CiBank   className="w-6 h-6 mr-2" />
           Bank Info
          </NavLink>
          
          <NavLink
            to={`dashboard/notification`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
           <IoNotificationsCircleSharp   className="w-6 h-6 mr-2" />
           Notification
          </NavLink>
          
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
