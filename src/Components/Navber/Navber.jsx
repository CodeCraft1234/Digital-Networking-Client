import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Security/AuthProvider";
import { IoIosPeople, IoMdArrowDropdown } from "react-icons/io";
import useAdmin from "../../Hook/useAdmin";
import useUsers from "../../Hook/useUsers";
import { FaHome, FaUserCheck, FaUserCog } from "react-icons/fa";
import { MdAccountCircle, MdCampaign } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { FaPeopleGroup, FaSackDollar } from "react-icons/fa6";
import { SlPeople } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";

const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [users] = useUsers();
  const userr = useLoaderData();
  const isAdmin = user?.email === "rrobiul@gmail.com";
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut().then().catch();
    navigate("/");
  };

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);

  const handleToggle = (e) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const [ddd, setDdd] = useState(null);

  useEffect(() => {
    if (users && user) {
      const fff = users.find((u) => u.email === user?.email);
      console.log(fff);
      setDdd(fff || {}); // Update state with found user or an empty object
    }
  }, [users, user]);

  console.log(ddd?.name);

  return (
    <div className="">
      <div className="navbar bg-white text-black bg-opacity-50 backdrop-blur-lg p-1 rounded-md shadow-lg lg:px-28 md:px-10 px-5 fixed z-50 top-0 border-b">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white mt-3 z-[1] p-2 rounded-box w-52 gap-2"
            >
              {ddd?.role === "admin" ? (
                <>
                  <li>
                    <NavLink
                      to="/"
                      className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                      activeClassName="bg-green-300"
                    >
                      <FaHome className="w-6 h-6" /> Home
                    </NavLink>
                  </li>
                  
                  <li>
                    <NavLink
                      to="/adAccountTable"
                      className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                      activeClassName="bg-green-300"
                    >
                      <FaUserCog className="w-6 h-6" /> User Ads Account
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/monthlyadAccountTable"
                      className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                      activeClassName="bg-green-300"
                    >
                      <FaUserCheck className="w-6 h-6" /> Monthly Ads Account
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`/userInfo/${user?.email}`}
                      className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                      activeClassName="bg-green-300"
                    >
                      <FaSackDollar className="w-5 h-5" /> Salary
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/allEmployee"
                      className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                      activeClassName="bg-green-300"
                    >
                      <SlPeople className="w-6 h-6" /> Employees
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                   <li>
                  <NavLink
                   to={`/`}
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <FaHome className="w-6 h-6" /> Home
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/myCampaigns"
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <MdCampaign className="w-6 h-6" />My Campaigns
                  </NavLink>
                </li>
                   <li>
                  <NavLink
                   to={`/myClients`}
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <IoIosPeople className="w-6 h-6" /> My Clients
                  </NavLink>
                </li>
                  

                  <li>
                    <NavLink
                      to={`/userInfo/${user?.email}`}
                      className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                      activeClassName="bg-green-300"
                    >
                      <MdAccountCircle className="w-6 h-6" />My Ads Account
                    </NavLink>
                  </li>
                  
                  <li>
                    <NavLink
                      to="/allCampaign"
                      className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                      activeClassName="bg-green-300"
                    >
                      <MdCampaign className="w-6 h-6" /> All Campaign
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/addClient"
                      className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                      activeClassName="bg-green-300"
                    >
                      <IoPeopleSharp className="w-6 h-6" /> Add Client
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="flex justify-center items-center">
            <Link to="/">
              <img
                className="h-20 rounded-full w-20"
                src="https://i.ibb.co/Cnvg0RS/Digital-Network-Logo.png"
                alt=""
              />
            </Link>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal items-center px-1 flex gap-4">
            {ddd?.role === "admin" ? (
              <>
                <li>
                  <NavLink
                    to={`/`}
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <FaHome className="w-6 h-6" /> Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/allAdSAccount"
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <MdAccountCircle className="w-6 h-6" /> Ads Accounts
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/allClients"
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <IoPeopleSharp className="w-6 h-6" /> Clients
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/allCampaign"
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <MdCampaign className="w-6 h-6" /> Campaigns
                  </NavLink>
                </li>
               
                <li>
                  <NavLink
                    to="/allEmployee"
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <FaPeopleGroup className="w-6 h-6" /> Employees
                  </NavLink>
                </li>
              </>
            ) : (
              <>
              <li>
                  <NavLink
                   to={`/`}
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <FaHome className="w-6 h-6" /> Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/myCampaigns"
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <MdCampaign className="w-6 h-6" />My Campaigns
                  </NavLink>
                </li>
                <li>
                  <NavLink
                   to={`/myClients`}
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <IoIosPeople className="w-6 h-6" /> My Clients
                  </NavLink>
                </li>
               
                <li>
                  <NavLink
                    to={`/adsAccount/${user?.email}`}
                    className="text-white bg-red-800 hover:bg-green-300 hover:text-black"
                    activeClassName="bg-green-300"
                  >
                    <MdAccountCircle className="w-6 h-6" />My Ads Accounts
                  </NavLink>
                </li>
               
               
              </>
            )}
          </ul>
        </div>
        <div className="navbar-end">
          <label className="swap swap-rotate mr-5">
            <input
              type="checkbox"
              onChange={handleToggle}
              checked={theme === "light" ? false : true}
            />
            <svg
              className="swap-on fill-current lg:w-10 md:w-10 w-8 lg:h-10 md:h-10 h-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            <svg
              className="swap-off fill-current lg:w-10 md:w-10 w-8 lg:h-10 md:h-10 h-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>

          <div className="items-center">
            {user?.displayName ? (
              <div className="dropdown center">
                <label tabIndex={0}>
                  <div className="flex justify-center items-center">
                    <img
                      className="h-8 w-8"
                      src="https://i.ibb.co/kBSCBxv/4652486.webp"
                      alt=""
                    />
                    <h1 className="">
                      {user?.displayName}{" "}
                      <span className="inline-block hover:dropdown">
                        <IoMdArrowDropdown />
                      </span>
                    </h1>
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-lg dropdown-content mt-3 right-1 z-[1] p-2 rounded-box w-52"
                >
                  <div className="dropdown">
                    <div
                      tabIndex={0}
                      className="dropdown-content z-[50] card card-compact w-44 p-2 shadow bg-base-100 border text-black"
                    >
                      <figure>
                        <img
                          className="h-20 w-20 rounded-full"
                          src={user?.photoURL}
                          alt=""
                        />
                      </figure>

                      <div className="card-body">
                        <hr />
                        <NavLink to="/updateProfile">
                          <button className="font-avenir w-full px-3 py-1 bg-neutral rounded text-white">
                            Update Info
                          </button>
                        </NavLink>
                        <button
                          onClick={handleLogOut}
                          className="font-avenir w-full px-3 py-1 bg-neutral rounded text-white"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </ul>
              </div>
            ) : (
              <Link to="/login">
                <button className="font-avenir px-3 py-1 bg-neutral rounded text-white">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
