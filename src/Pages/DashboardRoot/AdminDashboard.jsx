import { NavLink } from "react-router-dom";
import {
  FaBlog,
  FaBlogger,
  FaBorderAll,
  FaCog,
  FaEmpire,
  FaHome,
  FaUser,
  FaUsers,
} from "react-icons/fa";

import { RxDashboard } from "react-icons/rx";

import { MdAccountCircle, MdCampaign } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { useEffect, useState } from "react";
import useLogo from "../../Hook/useLogo";
import { AiFillDashboard, AiTwotoneDashboard } from "react-icons/ai";

const AdminDashboard = () => {
  const [logo, setLogo] = useLogo();
  const [latestLogo, setLatestLogo] = useState(null);
  console.log(latestLogo, logo);

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
  return (
    <div className="overflow-hidden h-screen">
      <div className="w-[250px]">
        <img className="w-44 mx-auto" src={latestLogo?.photo} alt="" />
        <ul className="mt-4">
          <li className="my-1">
            <NavLink
              to="/dashboard/admin/home"
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "bg-blue-600 text-white text-lg sm:text-sm md:text-xl lg:text-2xl"
                  : "hover:bg-blue-600 hover:text-white text-white text-lg sm:text-sm md:text-xl lg:text-2xl"
              }
            >
              <AiFillDashboard className="w-6 h-6 mr-2" />
              Dashboard
            </NavLink>
          </li>

          <li className="my-1">
            <NavLink
              to="dashboard/allAdSAccount"
              className="text-white text-lg sm:text-sm md:text-xl lg:text-2xl hover:bg-blue-600 hover:text-white py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-blue-600 text-white"
            >
              <MdAccountCircle className="w-6 h-6 mr-2" /> Ads Accounts
            </NavLink>
          </li>

          <li className="my-1">
            <NavLink
              to="dashboard/allUsers"
              className="text-white text-lg sm:text-sm md:text-xl lg:text-2xl hover:bg-blue-600 hover:text-white py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-blue-600 text-white"
            >
              <FaUser  className="w-6 h-6 mr-2" /> All Users
            </NavLink>
          </li>

          <li className="my-1">
            <NavLink
              to="dashboard/allClients"
              className="text-white text-lg sm:text-sm md:text-xl lg:text-2xl hover:bg-blue-600 hover:text-white py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-blue-600 text-white"
            >
              <IoPeopleSharp className="w-6 h-6 mr-2" /> Clients
            </NavLink>
          </li>

          <li className="my-1">
            <NavLink
              to="dashboard/AddClients"
              className="text-white text-lg sm:text-sm md:text-xl lg:text-2xl hover:bg-blue-600 hover:text-white py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-blue-600 text-white"
            >
              <IoPeopleSharp className="w-6 h-6 mr-2" /> Add Clients
            </NavLink>
          </li>

          <li className="my-1">
            <NavLink
              to="dashboard/allCampaign"
              className="text-white text-lg sm:text-sm md:text-xl lg:text-2xl hover:bg-blue-600 hover:text-white py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-blue-600 text-white"
            >
              <MdCampaign className="w-6 h-6 mr-2" /> Campaigns
            </NavLink>
          </li>

          <li className="my-1">
            <NavLink
              to="dashboard/allEmployee"
              className="text-white text-lg sm:text-sm md:text-xl lg:text-2xl hover:bg-blue-600 hover:text-white py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-blue-600 text-white"
            >
              <FaPeopleGroup className="w-6 h-6 mr-2" /> Employees
            </NavLink>
          </li>

          <li className="my-1">
            <NavLink
              to="dashboard/employeePayment"
              className="text-white text-lg sm:text-sm md:text-xl lg:text-2xl hover:bg-blue-600 hover:text-white py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-blue-600 text-white"
            >
              <FaPeopleGroup className="w-6 h-6 mr-2" /> Payment
            </NavLink>
          </li>

          <li className="my-1">
            <NavLink
              to="dashboard/Users"
              className="text-white text-lg sm:text-sm md:text-xl lg:text-2xl hover:bg-blue-600 hover:text-white py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-blue-600 text-white"
            >
              <FaPeopleGroup className="w-6 h-6 mr-2" /> Users
            </NavLink>
          </li>

          <li className="my-1">
            <NavLink
              to="/dashboard/settings"
              className="text-white text-lg sm:text-sm md:text-xl lg:text-2xl hover:bg-blue-600 hover:text-white py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-blue-600 text-white"
            >
              <FaCog className="w-6 h-6 mr-2" /> Settings
            </NavLink>
          </li>

          <li className="my-1">
            <NavLink
              to="/"
              className="text-white text-lg sm:text-sm md:text-xl lg:text-2xl hover:bg-blue-600 hover:text-white py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-blue-600 text-white"
            >
              <FaHome className="w-6 h-6 mr-2" /> Go Home
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default AdminDashboard;
