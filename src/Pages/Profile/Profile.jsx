import { useContext } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import "./profile.css";
import { NavLink, useLoaderData } from "react-router-dom";

const Profile = () => {
  const { user, logOut } = useContext(AuthContext);

  

  const userr=useLoaderData()
  console.log(userr)


  const handleLogout = () => {
    logOut();
    window.location.href = "/";
  };
//dhdsffdsjh
  return (
    <div className="mt-24   ">
      <div >
      <img className="rounded-full mx-auto w-72 h-72" src={userr.photo} alt=""/>
      
    </div>
    <div className="flex mx-auto items-center px-10 space-x-2 overflow-hidden sm:justify-center flex-nowrap dark:bg-gray-800 dark:text-gray-100">
        <NavLink
          exact
          to="/profileUser"
          className="flex items-center flex-shrink-0 pl-16 py-2 border-b-4 dark:border-gray-700 dark:text-gray-400"
          activeClassName="dark:border-violet-400 dark:text-gray-50"
        >
          Profile
        </NavLink>
        <NavLink
          to="/ad-account"
          className="flex items-center flex-shrink-0 px-5 py-2 border-b-4 dark:border-gray-700 dark:text-gray-400"
          activeClassName="dark:border-violet-400 dark:text-gray-50"
        >
          Ad Account
        </NavLink>
        <NavLink
          to="/mobile-banking"
          className="flex items-center flex-shrink-0 px-5 py-2 border-b-4 dark:border-gray-700 dark:text-gray-400"
          activeClassName="dark:border-violet-400 dark:text-gray-50"
        >
          Mobile Banking
        </NavLink>
        <NavLink
          to="/salary"
          className="flex items-center flex-shrink-0 pr-16 py-2 border-b-4 dark:border-gray-700 dark:text-gray-400"
          activeClassName="dark:border-violet-400 dark:text-gray-50"
        >
          Salary
        </NavLink>
      </div>
      {/* 1st table */}
      
    </div>
  );
};

export default Profile;