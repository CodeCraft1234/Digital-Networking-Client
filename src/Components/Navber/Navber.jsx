import {  useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
const NavBar = () => {
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
  return (
    <div className="navbar  bg-indigo-700 text-white bg-opacity-50 backdrop-blur-lg p-5 rounded-md shadow-lg  lg:px-28 md:px-10 px-5  fixed z-50 top-0 border-b">
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

            className="menu menu-sm dropdown-content  bg-violet-950 mt-3 z-[1] p-2 shadow  rounded-box w-52 "
          >
          <li>

    <NavLink to={"/"}> <img className="h-8 w-8" src="https://i.ibb.co/hL4n8S1/10473299.png" alt="" />Home </NavLink>
  </li>
  <li>
    <NavLink to={"/features"}><img className="h-8 w-8" src="https://i.ibb.co/wKjbW5s/feature-3d-render-icon-illustration-png.png" alt="" />Features </NavLink>
  </li>



  <li>
    <NavLink to={"/blog"}> <img className="h-8 w-8" src="https://i.ibb.co/1sSTpBy/4729296.webp" alt="" />Blogs</NavLink>
  </li>
  <li>
    <NavLink to={"/profile"}><img className="h-10 w-10" src="https://i.ibb.co/kBSCBxv/4652486.webp" alt="" />Profile  </NavLink>
  </li>

          </ul>
        </div>
        <div className="flex justify-center items-center">
       
          <Link to={"/"}>
         
             
           <h1>Canteen Management</h1>
          </Link>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">

        <ul className="menu menu-horizontal items-center px-1 flex gap-4">
        <li>
            <NavLink to={"/"}> <img className="h-6 w-6" src="https://i.ibb.co/hL4n8S1/10473299.png" alt="" />Home </NavLink>
          </li>
          <li>
            <NavLink to={"/features"}><img className="h-6 w-6" src="https://i.ibb.co/wKjbW5s/feature-3d-render-icon-illustration-png.png" alt="" />Features </NavLink>
          </li>
          <li>
            <NavLink to={"/blog"}> <img className="h-6 w-6" src="https://i.ibb.co/1sSTpBy/4729296.webp" alt="" />Blogs</NavLink>
          </li>
          <li>
            <NavLink to={"/profile"}><img className="h-8 w-8" src="https://i.ibb.co/kBSCBxv/4652486.webp" alt="" />Profile  </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <label className="swap swap-rotate mr-5">
          <input
            type="checkbox"
            onChange={handleToggle}
            checked={theme == "light" ? false : true}
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
          
        </div>
      </div>
    </div>
  );
};
export default NavBar;