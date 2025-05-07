import { Link, NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle, MdPayment, MdSummarize, MdAttachMoney } from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { BsBank } from "react-icons/bs";
import { IoMdCash } from "react-icons/io";
import { CiBank } from "react-icons/ci";
import { FaDiceSix } from "react-icons/fa";

const DesignerDashboard = () => {
  
  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: '#0B3A84', color: 'white' }
      : {}
  );

  return (
    <div className="w-[205px] text-white bg-gray-800 pt-10 -ml-2 pr-2 min-h-screen">
      <ul>
        <NavLink
          to="/"
          className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
          style={({ isActive }) => getActiveStyle(isActive)}
        >
          <RxDashboard className="w-6 h-6 mr-2" />
          Dashboard
        </NavLink>

        <NavLink
          to="/graphicsDesign"
          className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
          style={({ isActive }) => getActiveStyle(isActive)}
        >
          <FaDiceSix className="w-6 h-6 mr-2" />
          Design
        </NavLink>

        <NavLink
          to="/salaryPayments"
          className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
          style={({ isActive }) => getActiveStyle(isActive)}
        >
          <MdPayment className="w-6 h-6 mr-2" />
          Salary Pay
        </NavLink>

        <NavLink
          to="/summery"
          className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
          style={({ isActive }) => getActiveStyle(isActive)}
        >
          <MdSummarize className="w-6 h-6 mr-2" />
          My Summary
        </NavLink>

        <NavLink
          to="/mySalary"
          className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
          style={({ isActive }) => getActiveStyle(isActive)}
        >
           <IoMdCash  className="w-6 h-6 mr-2" />Salary
        </NavLink>

        <NavLink
          to="/bankInfo"
          className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
          style={({ isActive }) => getActiveStyle(isActive)}
        >
           <CiBank   className="w-6 h-6 mr-2" />
                    Bank Info
        </NavLink>
      </ul>
    </div>
  );
};

export default DesignerDashboard;
