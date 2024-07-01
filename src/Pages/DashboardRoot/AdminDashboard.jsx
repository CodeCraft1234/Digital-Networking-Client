import { NavLink } from "react-router-dom";
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

import { RxDashboard } from "react-icons/rx";

import { MdAccountCircle, MdCampaign } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { useEffect, useState } from "react";
import useLogo from "../../Hook/useLogo";
import { AiFillDashboard, AiTwotoneDashboard } from "react-icons/ai";
import { Menu } from "@headlessui/react";

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
  return (
    <div className="overflow-y-auto h-screen">
      <div className="w-[200px]">
        <img className="w-44 mx-auto" src={latestLogo?.photo} alt="" />
        <ul className="mt-4">
          <li className="my-1 text-base">
            <NavLink
              to="/dashboard/admin/home"
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "  bg-blue-300 text-blue-700"
                  : " hover:text-gray-100"
              }
            >
              <RxDashboard className="w-6 h-6 mr-2" />
              Dashboard
            </NavLink>
          </li>

          <li className="my-1 text-base">
            <NavLink
              to="dashboard/allAdSAccount"
              className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
              activeClassName=" bg-blue-400"
            >
              <MdAccountCircle className="w-6 h-6 mr-2" /> Ads Accounts
            </NavLink>
          </li>
          <li className="my-1 text-base">
            <NavLink
              to="dashboard/addEmployee"
              className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
              activeClassName=" bg-blue-400"
            >
              <MdAccountCircle className="w-6 h-6 mr-2" /> Add Employee
            </NavLink>
          </li>

          {/* <li className="my-1 text-base">
        <NavLink
              to="dashboard/allUsers"
          className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
          activeClassName=" bg-blue-400"
        >
          <MdAccountCircle className="w-6 h-6 mr-2" />All Users
        </NavLink>
      </li> */}

          <li className="my-1 text-base">
            <NavLink
              to="dashboard/allClients"
              className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-green-300"
            >
              <IoPeopleSharp className="w-6 h-6 mr-2" /> Clients
            </NavLink>
          </li>

          <li className="my-1 text-base">
            <NavLink
              to="dashboard/allCampaign"
              className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-green-300"
            >
              <MdCampaign className="w-6 h-6 mr-2" /> Campaigns
            </NavLink>
          </li>

          <li className="my-1 text-base">
            <NavLink
              to="dashboard/allEmployee"
              className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-green-300"
            >
              <FaPeopleGroup className="w-6 h-6 mr-2" /> Employees
            </NavLink>
          </li>

          <li className="my-1 text-base">
            <NavLink
              to="dashboard/employeePayment"
              className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
              activeClassName="bg-green-300"
            >
              <FaPeopleGroup className="w-6 h-6 mr-2" /> Payment
            </NavLink>
          </li>

          {/* <li className="my-1 text-base relative">
      <button onClick={toggleDropdownTwo}
        className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center w-full"
      >
         <FaPeopleGroup className="w-6 h-6 mr-2" /> Users
         <span className="ml-auto">
          {isOpen ? <FaAngleUp /> : <FaAngleDown />}
        </span>
      </button>
      {isOpenTwo && (
        <ul className="absolute left-0 w-full bg-white rounded-lg shadow-lg mx-8 z-10">
          <li className="text-black hover:bg-green-300 py-2 px-4 rounded-t-lg">
            <NavLink to="dashboard/Users" className="flex items-center">
              Users
            </NavLink>
          </li>
          <li className="text-black hover:bg-green-300 py-2 px-4 rounded-b-lg">
            <NavLink to="dashboard/allUsers" className="flex items-center">
              ALL Users
            </NavLink>
          </li>
        </ul>
      )}
        
      </li> */}

          <div className="flex my-1 text-base">
            <div className="">
              <div className="">
                <Menu>
                  <Menu.Button className="text-white py-2 px-4 rounded-lg flex items-center w-full">
                    <FaPeopleGroup className="w-6 h-6 mr-4" /> Users
                  </Menu.Button>
                  <Menu.Items className="mt-2">
                    <Menu.Item>
                      {({ active }) => (
                        <NavLink
                          to="dashboard/allUsers"
                          className={`text-white hover:text-black hover:bg-green-300 py-2 px-4 rounded-lg ${
                            active ? "hover:bg-green-300 " : ""
                          }`}
                        >
                          All Users
                        </NavLink>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <NavLink
                          to="dashboard/Users"
                          className={`text-white hover:text-black hover:bg-green-300 py-2 px-4 rounded-lg ${
                            active ? "hover:bg-green-300" : ""
                          }`}
                        >
                          Users
                        </NavLink>
                      )}
                    </Menu.Item>
                    {/* <Menu.Item>
                {({ active }) => (
                  <a
                    href="#profile"
                    className={`block py-2 px-4 ${active ? 'bg-gray-700' : ''}`}
                  >
                    Profile
                  </a>
                )}
              </Menu.Item> */}
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          </div>

          <li className="my-1 text-base relative">
            <button
              onClick={toggleDropdown}
              className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center w-full"
            >
              <FaCog className="w-6 h-6 mr-2" />
              Settings
              <span className="ml-auto">
                {isOpen ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </button>
            {isOpen && (
              <ul className="absolute left-0 w-full bg-white rounded-lg shadow-lg mt-12 z-10">
                <li className="text-black hover:bg-green-300 py-2 px-4 rounded-t-lg">
                  <NavLink
                    to="/dashboard/addLogos"
                    className="flex items-center"
                  >
                    Add Logos
                  </NavLink>
                </li>
                <li className="text-black hover:bg-green-300 py-2 px-4 rounded-b-lg">
                  <NavLink
                    to="/dashboard/settings"
                    className="flex items-center"
                  >
                    Add Links
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li className="my-1 text-base">
            <NavLink
              to="/"
              className="text-white hover:bg-green-300 hover:text-black py-2 px-4 rounded-lg flex items-center"
            >
              <FaHome className="w-6 h-6 mr-2" />
              Go Home
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default AdminDashboard;
