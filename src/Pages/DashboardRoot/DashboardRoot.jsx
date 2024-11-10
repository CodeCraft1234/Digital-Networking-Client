import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { FaArrowLeft,  FaHome } from "react-icons/fa";
import { useContext, useEffect, useRef, useState } from "react";
import Login from "../../Security/Login";
import { AuthContext } from "../../Security/AuthProvider";
import Register from "../../Security/Register";
import {  MdCampaign, MdOutlinePayments } from "react-icons/md";
import useUsers from "../../Hook/useUsers";
import { RiAccountPinBoxLine } from "react-icons/ri";
import { FaUsersViewfinder } from "react-icons/fa6";
import { BsCashCoin } from "react-icons/bs";
import useNotification from "../../Hook/useNotification";
import useEditNotification from "../../Hook/useEditNotificaation";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { formatDistanceToNow } from "date-fns";
import { IoNotificationsCircleSharp } from "react-icons/io5";

const DashboardRoot = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const { user,logOut } = useContext(AuthContext);
  const [clientUser, setClientUser] = useState(null); // State for clientUser from localStorage

  useEffect(() => {
    const storedClientUser = localStorage.getItem("clientUser");
    if (storedClientUser) {
      setClientUser(storedClientUser);
    }
  }, []);

 
  const navigate = useNavigate();
  const handleLogOut = () => {
    logOut().then().catch();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const [users]=useUsers()

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const dropdownRef = useRef(null); 
  const dropdownRef2 = useRef(null); 
  const [ddd, setDdd] = useState({}); 

  useEffect(() => {
      if (users && user) {
          const fff = users.find(u => u.email === user?.email);
          setDdd(fff || {}); 
      }
  }, [users, user]);
  
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };


  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleDropdown2 = () => setIsOpen2(!isOpen2);
    const toggleDropdown3 = () => setIsOpen3(!isOpen3);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    useEffect(() => {
      const handleClickOutside2 = (event) => {
        if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
          setIsOpen2(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside2);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside2);
      };
    }, []);
  
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
    useEffect(() => {
      localStorage.setItem('theme', theme);
      document.querySelector('html').setAttribute('data-theme', theme);
    }, [theme]);
  
    const handleThemeChange = (e) => {
      setTheme(e.target.value);
    };

    const handleLogout = () => {
      localStorage.removeItem("clientUser"); 
      localStorage.removeItem("clientUsername"); 
      setClientUser(null); 
      navigate("/"); 
    };
  
    const [notification, refetch] = useNotification();
    const [editNotification] = useEditNotification();
  
    const sortedNotifications = notification.sort((a, b) => {
      if (a.status === "unread" && b.status === "read") return -1;
      if (a.status === "read" && b.status === "unread") return 1;
      return new Date(b.date) - new Date(a.date);
    });
    const sortedNotifications2 = editNotification.sort((a, b) => {
      if (a.status === "unread" && b.status === "read") return -1;
      if (a.status === "read" && b.status === "unread") return 1;
      return new Date(b.date) - new Date(a.date);
    });
  
  
  
    const AxiosPublic=UseAxiosPublic()
    const handleUpdate = (notification) => {
      const data = { status: "read" };
      AxiosPublic.patch(`/notification/${notification._id}`, data)
        .then(() => {
          refetch();
        })
        .catch((err) => console.error("Error updating notification:", err));
    };
  

  if (!user  ) {
    if (location.pathname === '/signup') {
      return <Register />;
    }
    return <Login />;
  }


  return (
    <div className=" ">
      <div className="flex relative">
      <div className={`${showSidebar ? 'fixed' : 'absolute'} md:static lg:w-auto grid top-0 gap-8 lg:gap-8 z-10 transition-transform duration-800 ease-in-out`}>
          <Dashboard showSidebar={showSidebar} />
          <div
            className="absolute right-0 top-0 text-right lg:hidden"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <button className="  text-white  md:hidden">
              {showSidebar && <FaArrowLeft />}
            </button>
          </div>
        </div>
        
        <div className="lg:ml-56  min-h-screen min-w-min  rounded-lg w-full lg:col-span-2">
        <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}  className="  font-bold mx-auto   fixed z-50 w-full mr-1 p-3 hidden md:block">
  <div className="left-0  items-center grid lg:grid-cols-3 gap-5">

    <div className="flex justify-start items-center ml-3 gap-5">
     
       <div className="navbar-end ">
      <select
        value={theme}
        onChange={handleThemeChange}
        className="select-theme-dropdown bg-white px-4 py-2 rounded-md text-black mr-5"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="pink">Pink</option>
      </select>
    </div>

 {clientUser && (
  <div style={{ color: 'var(--text-color)' }} className="flex justify-center gap-5 items-center">
  <h1 className="font-bold text-xl">{clientUser}</h1>
  <h1
    className="font-bold text-xl  cursor-pointer"
    onClick={handleLogout} // Call handleLogout on click
  >
    LogOut
  </h1>
</div>

      )}
      
    </div>

    <div className="flex justify-end ml-16 gap-2">

    {
    ddd.role === 'admin' && <div className=" gap-2">
    <div className="items-center">
     <div className="" ref={dropdownRef}>
       <label
         tabIndex={0}
         className="relative cursor-pointer"
         onClick={toggleDropdown3}
       >
         <h1 className="text-5xl font-bold"><p className=""><IoNotificationsCircleSharp /></p> </h1>
       </label>
       {isOpen3 && (
         <ul
           tabIndex={0}
           className="absolute mt-7 text-white left-1  z-[1] p-1 rounded-box shadow-lg bg-white"
         >
           <div className="p-4 text-center">
             <div className="text-start ">
               <div className="text-center ">
               {(sortedNotifications.length > 0 || sortedNotifications2.length > 0) ? (
[...sortedNotifications, ...sortedNotifications2]
 .sort((a, b) => {
   const dateA = a.deleteDate || a.editDate;
   const dateB = b.deleteDate || b.editDate;
   return new Date(b.date || dateB) - new Date(a.date || dateA);
 })
 .slice(0, 5) 
 .map((item) => (
       <div
         key={item._id}
         className={`flex items-start  justify-start gap-2  px-6 py-4 mb-1 rounded-xl cursor-pointer shadow-lg transition-colors ${
           item.status === "read" ? "bg-white" : "bg-yellow-100"
         } hover:bg-blue-100 border-l-4 ${item.status === "read" ? "border-gray-200" : "border-yellow-500"}`}
         onClick={() => handleUpdate(item)}
       >
         <div >
          <div className="text-blue-700 flex justify-start items-start gap-2 font-semibold">
          <div>
          <img className="h-12 w-12 rounded-full" src={item.photo} alt="" />
          </div>
        <div>
        <p className="flex justify-start items-center gap-1"> <p className="text-black font-bold">{item.name}</p> <p className="text-gray-600">{item.message}</p>
        </p>
        <p className="text-blue-700 text-start">
           {isNaN(new Date(item.deleteDate || item.editDate)) 
             ? 'Invalid date' 
             : formatDistanceToNow(new Date(item.deleteDate || item.editDate), { addSuffix: true })}
           </p>
        </div>
          </div>
           </div>
       </div>
     ))
 ) : (
   <div className="px-4 py-3 text-gray-600 text-center">No notifications</div>
 )}
                 <Link to={'/dashboard/notification'}>
                   <p className="text-white bg-[#394148] hover:bg-blue-500 text-sm border border-gray-500 rounded-lg py-1.5 mt-2 px-3">
                     See All
                   </p>
                 </Link>
               </div>
             </div>
             <hr className="my-2" />
           </div>
         </ul>
       )}
     </div>
 </div>
 </div>

    }
    <div className="items-center">
      
      {user?.displayName ? (
        <div className="relative" ref={dropdownRef}>
          
          <label
            tabIndex={0}
            className="relative cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              className="h-10 w-10 mt-1 rounded-full"
              src={user.photoURL}
              alt="Profile"
            />
            {/* Dropdown Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="absolute right-0 bottom-0 h-3 w-3 bg-black rounded-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isOpen ? 'M19 15l-7-7-7 7' : 'M19 9l-7 7-7-7'}
              />
            </svg>
          </label>

          {/* Dropdown Menu */}
          {isOpen && (
            <ul
              tabIndex={0}
              className="absolute mt-3 text-white right-1 z-[1] p-1 rounded-box w-52 shadow-lg bg-[#2e353a]"
            >
              <div className="p-4 text-center">
                <img
                  className="h-16 w-16 rounded-full mx-auto"
                  src={user?.photoURL}
                  alt="Profile"
                />
                <Link
                  className="text-white font-bold"
                  to={'/dashboard/updateProfile'}
                >
                  <h1 className="my-2">
                    {user?.displayName}
                  </h1>
                </Link>

                <div className="text-start">
                  <div className="text-center">

                    {
                      ddd.role === 'admin' && <>
                    
                    <Link to={'/dashboard/allUsers'}>
                      <p className="text-white text-sm hover:bg-blue-500 bg-[#394148] border border-gray-500 rounded-lg py-1.5 px-3">
                        All Users
                      </p>
                    </Link>
                    <Link to={'/dashboard/history'}>
                      <p className="text-white bg-[#394148] hover:bg-blue-500 text-sm border border-gray-500 rounded-lg py-1.5 px-3 mt-2">
                       All History
                      </p>
                    </Link>
                    <Link to={'/dashboard/AllSummery'}>
                      <p className="text-white bg-[#394148] hover:bg-blue-500 text-sm border border-gray-500 rounded-lg py-1.5 px-3 mt-2">
                        All Summery
                      </p>
                    </Link>
                    <Link  to="/dashboard/settings">
                      <p className="text-white bg-[#394148] hover:bg-blue-500 text-sm border border-gray-500 rounded-lg py-1.5 px-3 mt-2">
                        Settings
                      </p>
                    </Link>
                      </>
                    }
                    {
                      ddd.role === 'employee' && <>

                    <Link to={'/dashboard/mySellery'}>
                      <p className="text-white text-sm hover:bg-blue-500 bg-[#394148] border border-gray-500 rounded-lg py-1.5 px-3">
                        My Activity
                      </p>
                    </Link>
                    <Link to={'/dashboard/myhistory'}>
                      <p className="text-white bg-[#394148] hover:bg-blue-500 text-sm border border-gray-500 rounded-lg py-1.5 px-3 mt-2">
                        My History
                      </p>
                    </Link>
                      </>
                    }
                    {
                      ddd.role === 'contributor' && <>

                      
                      </>
                    }

                    <Link to={'/dashboard/updateProfile'}>
                      <p className="text-white bg-[#394148] hover:bg-blue-500 text-sm border border-gray-500 rounded-lg py-1.5 mt-2 px-3">
                        Update Profile
                      </p>
                    </Link>
                  </div>
                </div>
                <hr className="my-2" />

                <NavLink
                  onClick={handleLogOut}
                  className={({ isActive }) =>
                    isActive
                      ? 'underline text-blue-700'
                      : 'hover:text-gray-600'
                  }
                >
                  <button className="py-1 px-3 rounded-lg bg-red-500 text-white font-bold">
                    Log Out
                  </button>
                </NavLink>
              </div>
            </ul>
          )}
        </div>
      ) : (<>
       
        {
          !clientUser &&  <Link to="/login">
          <button className="font-avenir px-3 py-1 bg-neutral rounded text-white">
            Login
          </button>
        </Link>
        }
      </>
      )}
    </div>
    <h1 className="mt-3 text-xl">
                    {user?.displayName}
                  </h1>
    



     
    </div>

  </div>
</div>

<div style={{ backgroundColor: 'var(--bg-color2)'}} className="lg:pt-16 pt-12   min-h-screen h-full  " >
  <Outlet />
</div>



        </div>
      </div>

      <div
  className="fixed left-0 top-0 w-full text-left lg:hidden bg-gray-900 p-2 z-5">
  <div className="flex shadow-blue-700 shadow-2xl  justify-between items-center">
  <div className="flex justify-center items-center mx-4 text-2xl gap-7">
      <Link to={'/'}>
        <p className={` ${isActive('/') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          <FaHome />
        </p>
      </Link>

     {
      ddd?.role === 'admin' && <>
       <Link to={'/dashboard/allClients'}>
        <p className={` ${isActive('/dashboard/allClients') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          <FaUsersViewfinder />
        </p>
      </Link>
      <Link to={'/dashboard/allCampaign'}>
        <p className={` ${isActive('/dashboard/allCampaign') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          <MdCampaign />
        </p>
      </Link>
      <Link to={'/dashboard/allAdsAccount'}>
        <p className={` ${isActive('/dashboard/allAdsAccount') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          <RiAccountPinBoxLine />
        </p>
      </Link>
      <Link to={'/dashboard/allPayments'}>
        <p className={` ${isActive('/dashboard/paymentHistory') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          <MdOutlinePayments />
        </p>
      </Link>
      <Link to={'/dashboard/sellery'}>
        <p className={` ${isActive('/dashboard/sellery') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          < BsCashCoin />
        </p>
      </Link>
      </>
     }

     {
      ddd?.role === 'employee' && <>
       <Link to={'/dashboard/myClients'}>
        <p className={` ${isActive('/dashboard/myClients') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          <FaUsersViewfinder />
        </p>
      </Link>
      <Link to={'/dashboard/myCampaigns'}>
        <p className={` ${isActive('/dashboard/myCampaigns') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          <MdCampaign />
        </p>
      </Link>
      <Link to={'/dashboard/myAdsAccount'}>
        <p className={` ${isActive('/dashboard/myAdsAccount') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          <RiAccountPinBoxLine />
        </p>
      </Link>
      <Link to={'/dashboard/myPayments'}>
        <p className={` ${isActive('/dashboard/myPayments') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          <MdOutlinePayments />
        </p>
      </Link>
      <Link to={'/dashboard/mySellery'}>
        <p className={` ${isActive('/dashboard/mySellery') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          < BsCashCoin />
        </p>
      </Link>

      </>
     }

     {
      ddd?.role === 'contributor' && <>
      
      </>
     }
     {
      ddd?.role === 'client' && <>
            <Link to={'/dashboard/clientCampaigns'}>
        <p className={` ${isActive('/dashboard/clientCampaigns') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          <MdCampaign />
        </p>
      </Link>
      <Link to={'/dashboard/clientPayments'}>
        <p className={` ${isActive('/dashboard/clientPayments') ? 'text-red-500 border-b-2 border-white' : 'text-white'}`}>
          <MdOutlinePayments />
        </p>
      </Link>
      </>
     }


    </div>

    <div className="items-center">
      {user?.displayName ? (
        <div className="relative" >
          {/* Profile Image and Dropdown Toggle */}
          <label
            tabIndex={0}
            className="relative cursor-pointer"
            onClick={toggleDropdown2}
          >
            <img
              className="h-8 w-8 rounded-full"
              src={user.photoURL}
              alt="Profile"
            />
            {/* Dropdown Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="absolute right-0 bottom-0 h-4 w-4 bg-white rounded-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isOpen ? "M19 15l-7-7-7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </label>

          {/* Dropdown Menu */}
          {isOpen2 && (
            <ul
              tabIndex={0}
              className="absolute mt-3 text-white right-1 z-[1] p-1 rounded-box w-52 shadow-lg bg-[#2e353a]"
            >
              <div className="p-4 text-center">
                <img
                  className="h-16 w-16 rounded-full mx-auto"
                  src={user?.photoURL}
                  alt="Profile"
                />
                <Link
                  className="text-white font-bold"
                  to={"/dashboard/updateProfile"}
                >
                  <h1 className="my-2">{user?.displayName?.split(" ")[0]}</h1>
                </Link>

                <div className="text-start">
                  <div className="text-center">
                    {ddd.role === "admin" && (
                      <>
                        <Link to={"/dashboard/allUsers"}>
                          <p className="text-white text-sm hover:bg-blue-500 bg-[#394148] border border-gray-500 rounded-lg py-1.5 px-3">
                            All Users
                          </p>
                        </Link>
                        <Link to={"/dashboard/history"}>
                          <p className="text-white bg-[#394148] hover:bg-blue-500 text-sm border border-gray-500 rounded-lg py-1.5 px-3 mt-2">
                            All History
                          </p>
                        </Link>
                        <Link to={"/dashboard/AllSummery"}>
                          <p className="text-white bg-[#394148] hover:bg-blue-500 text-sm border border-gray-500 rounded-lg py-1.5 px-3 mt-2">
                            All Summary
                          </p>
                        </Link>
                      </>
                    )}
                    {ddd.role === "employee" && (
                      <>
                        <Link to={"/dashboard/mySellery"}>
                          <p className="text-white text-sm hover:bg-blue-500 bg-[#394148] border border-gray-500 rounded-lg py-1.5 px-3">
                            My Activity
                          </p>
                        </Link>
                        <Link to={"/dashboard/myhistory"}>
                          <p className="text-white bg-[#394148] hover:bg-blue-500 text-sm border border-gray-500 rounded-lg py-1.5 px-3 mt-2">
                            My History
                          </p>
                        </Link>
                      </>
                    )}
                    {ddd.role === "contributor" && (
                      <>
                        {/* Contributor-specific options */}
                      </>
                    )}
                    {ddd.role === "client" && (
                      <>
                        {/* Client-specific options */}
                      </>
                    )}

                    <Link to={"/dashboard/updateProfile"}>
                      <p className="text-white bg-[#394148] hover:bg-blue-500 text-sm border border-gray-500 rounded-lg py-1.5 mt-2 px-3">
                        Update Profile
                      </p>
                    </Link>
                  </div>
                </div>
                <hr className="my-2" />
                {/* Logout Button */}
                <NavLink
                  onClick={handleLogOut}
                  className={({ isActive }) =>
                    isActive ? "underline text-blue-700" : "hover:text-gray-600"
                  }
                >
                  <button className="py-1 px-3 rounded-lg bg-red-500 text-white font-bold">
                    Log Out
                  </button>
                </NavLink>
              </div>
            </ul>
          )}
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

export default DashboardRoot;
