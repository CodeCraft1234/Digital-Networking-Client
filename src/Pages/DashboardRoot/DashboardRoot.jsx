import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { FaArrowLeft,    FaHome, } from "react-icons/fa";
import { useContext, useEffect, useRef, useState } from "react";
import Login from "../../Security/Login";
import { AuthContext } from "../../Security/AuthProvider";
import Register from "../../Security/Register";
import useAllEmployee from "../../Hook/useAllEmployee";
import useFindClient from "../Home/useFindClient";
import useUserr3 from "../../Hook/useUserr3";
import {  ClipboardList, CreditCard, Users, BarChart3 } from "lucide-react"; 

const DashboardRoot = () => {
  const { user,logOut } = useContext(AuthContext);
  const {userr3}=useUserr3(user?.email)
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const [clientUser, setClientUser] = useState(null); 

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
  
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const dropdownRef = useRef(null); 
  const dropdownRef2 = useRef(null); 
  const [ddd, setDdd] = useState({}); 
  
  const [allEmployees]=useAllEmployee()
  useEffect(() => {
      if (allEmployees && user) {
          const fff = allEmployees.find(u => u.email === user?.email);
          setDdd(fff || {}); 
      }
  }, [allEmployees, user]);
  
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
  

    const handleLogout = () => {
      localStorage.removeItem("clientUser"); 
      localStorage.removeItem("clientUsername"); 
      setClientUser(null); 
      navigate("/"); 
    };
  
    const {findClients}=useFindClient(clientUser)

    if (!user &&  !clientUser) {
      if (location.pathname === '/signup') {
        return <Register />;
      }
      return <Login />;
    }
 

  return (
    <div className=" ">
      <div className="flex relative">
      <div className={`${showSidebar ? 'fixed' : 'absolute'}  lg:w-auto grid top-16 gap-8 lg:gap-8 z-10  transition-transform duration-800 ease-in-out`}>
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

        <div   className=" bg-gray-800 text-white shadow-2xl font-bold mx-auto   fixed z-30 min-w-full mr-1 p-2 hidden md:block">
  <div className="left-0  items-center grid grid-cols-2 gap-5">

    <div className="flex justify-start items-center ml-3 gap-5">
     
    <div className="">
          <Link to={"/"}>
            <img
              className="w-32 h-14"
              src="https://i.ibb.co.com/0VsQSnQC/DIGITAL-NETWORK-VERTICAL-LOGO-WHITE.png"
              alt="Logo"
            />
          </Link>
        </div>

 {clientUser && (
  <div  className="flex justify-center ml-44 gap-5 items-center">
   
    <h1>{findClients?.clientName}</h1>
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

    <div className="flex justify-end pr-10 ml-16 gap-2">


    <div className="items-center ">
      
      {user?.displayName ? (
        <div className="relative " ref={dropdownRef}>
          
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

          {isOpen && (
            <ul
              tabIndex={0}
              className="absolute mt-3 text-white right-1 z-[1] p-1 rounded-box w-52 shadow-lg bg-[#2e353a]"
            >
              <div className="p-4 text-center">
                <img
                  className="h-16 w-16 rounded-full mx-auto"
                  src={userr3?.photo}
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
                  <Link to={'/updateProfile'}>
                      <p className="text-white bg-[#394148] hover:bg-blue-500 text-sm border border-gray-500 rounded-lg py-1.5 mt-2 px-3">
                        Profile
                      </p>
                    </Link>

                    {
                      ddd.role === "admin" &&  <Link to={'/settings'}>
                      <p className="text-white bg-[#394148] hover:bg-blue-500 text-sm border border-gray-500 rounded-lg py-1.5 px-3 mt-2">
                        Settings
                      </p>
                    </Link>

                    }

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
        
        <div className="lg:ml-52  min-h-screen min-w-min  rounded-lg w-full lg:col-span-2">
       

<div>
  <div className="lg:pt-24 pb-5   lg:px-5    min-h-screen h-full  " >
    <Outlet />
  </div>
</div>



        </div>
      </div>

      <div className="fixed  bottom-0 left-0 right-0 z-50 bg-blue-600 text-white flex justify-between items-center px-6 py-3 shadow-lg md:hidden transition-all duration-300">
  




      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B3A84] backdrop-blur-md shadow-2xl md:hidden px-4 py-2 ">
  <div className="grid grid-cols-5 items-center text-center text-[10px] font-semibold text-white">
    
    <NavLink
      to="/summery"
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 transition-all ${
          isActive
          ? 'text-white font-extrabold scale-110'
          : 'text-white  hover:scale-110'
      }`
      }
    >
      {({ isActive }) => (
        <>
          <BarChart3 className={`w-6 h-6 ${isActive ? 'w-8 h-8' : ''}`} />
          <span>Summary</span>
        </>
      )}
    </NavLink>

    <NavLink
      to="/monthlySpend"
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 transition-all ${
          isActive
          ? 'text-white font-extrabold scale-110'
          : 'text-white  hover:scale-110'
      }`
      }
    >
      {({ isActive }) => (
        <>
          <ClipboardList className={`w-6 h-6 ${isActive ? 'w-8 h-8' : ''}`} />
          <span>Spend</span>
        </>
      )}
    </NavLink>

    <NavLink
      to="/"
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 transition-all ${
          isActive
            ? 'text-blue-400 scale-110'
            : 'text-white hover:text-blue-600 hover:scale-110'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="nav-button">
            <FaHome className={`w-8 h-8`} />
          </div>
          <span>Home</span>
        </>
      )}
    </NavLink>

    <NavLink
      to="/allPayments"
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 transition-all ${
          isActive
          ? 'text-white font-extrabold scale-110'
          : 'text-white  hover:scale-110'
      }`
      }
    >
      {({ isActive }) => (
        <>
          <CreditCard className={`w-6 h-6 ${isActive ? 'w-8 h-8' : ''}`} />
          <span>Payment</span>
        </>
      )}
    </NavLink>

    <NavLink
      to="/clients"
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 transition-all ${
          isActive
          ? 'text-white font-extrabold scale-110'
          : 'text-white  hover:scale-110'
      }`
      }
    >
      {({ isActive }) => (
        <>
          <Users className={`w-6 h-6 ${isActive ? 'w-8 h-8' : ''}`} />
          <span>Client</span>
        </>
      )}
    </NavLink>

  </div>
</div>





</div>


    </div>
  );
};

export default DashboardRoot;
