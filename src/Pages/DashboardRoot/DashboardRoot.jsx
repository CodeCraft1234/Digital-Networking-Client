import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { FaArrowLeft, FaBars, FaCcAmazonPay } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import Login from "../../Security/Login";
import { AuthContext } from "../../Security/AuthProvider";
import Register from "../../Security/Register";
import { IoAddCircle, IoLogOut, IoLogOutOutline, IoSettingsSharp } from "react-icons/io5";
import { MdAccountCircle, MdCampaign, MdOutlinePayments } from "react-icons/md";
import { LuActivitySquare, LuLayoutDashboard } from "react-icons/lu";
import { IoIosAddCircle, IoIosLogOut, IoMdCash, IoMdLogOut } from "react-icons/io";
import useUsers from "../../Hook/useUsers";
import { RiSecurePaymentLine } from "react-icons/ri";
import { FaPeopleRoof, FaUsersViewfinder } from "react-icons/fa6";

const DashboardRoot = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const { user,logOut } = useContext(AuthContext);

  if (!user) {
    if (location.pathname === '/signup') {
      return <Register />;
    }
    return <Login />;
  }

  const navigate = useNavigate();
  const handleLogOut = () => {
    logOut().then().catch();
    navigate("/login");
  };



  const [ddd, setDdd] = useState()
  const [users]=useUsers()

  useEffect(() => {
      if (users && user) {
          const fff = users.find(u => u.email === user?.email);
          setDdd(fff || {}); // Update state with found user or an empty object
      }
  }, [users, user]);
  
  return (
    <div className="bg-[#85F4FA] ">
      <div className="flex relative">
      <div className={`${showSidebar ? 'fixed' : 'absolute'} md:static lg:w-auto grid top-0 gap-8 lg:gap-8 z-10`}>
          <Dashboard showSidebar={showSidebar} />
          <div
            className="absolute right-0 top-0 text-right lg:hidden"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <button className="  text-white p-2 md:hidden">
              {showSidebar && <FaArrowLeft />}
            </button>
          </div>
        </div>
        <div className=" lg:ml-52 min-h-screen shadow-xl rounded-lg w-full lg:col-span-2">
        <div className="bg-white font-bold mx-auto shadow-xl border fixed z-50 w-full mr-1 p-3 hidden md:block">
  <div className="flex left-0 text-black items-center justify-center gap-5">
    <div className="flex justify-start items-center gap-5">
      {ddd?.role === 'admin' ? (
        <>
          <Link
            className="flex justify-start gap-0 hover:text-blue-600"
            to="dashboard/paymentHistory"
          >
            <MdOutlinePayments className="w-6 h-6 mr-2" />
            <span> Payment History</span>
          </Link>
          <Link
            className="flex justify-start gap-0 hover:text-blue-600"
            to="dashboard/addEmployee"
          >
            <IoIosAddCircle className="w-6 h-6 mr-2" />
            <span> Add Users</span>
          </Link>
          <Link
            className="flex justify-start gap-0 hover:text-blue-600"
            to="dashboard/AllSummeryy"
          >
            <LuActivitySquare className="w-6 h-6 mr-2" />
            <span> All Summery</span>
          </Link>
          <Link
            className="flex justify-start gap-0 hover:text-blue-600"
            to="dashboard/sellery"
          >
            <IoMdCash className="w-6 h-6 mr-2" />
            Salary
          </Link>
          <Link
            className="hover:text-blue-600 flex justify-start gap-0"
            to="/dashboard/settings"
          >
            <IoSettingsSharp className="w-6 h-6 mr-2" />
            <span> Setting</span>
          </Link>
        </>
      ) : (
        <>
          <Link
            className="hover:text-blue-600 flex justify-start gap-0"
            to={`/dashboard/adsAccount/${user?.email}`}
          >
            <IoAddCircle className="w-6 h-6 mr-2" />
            <span> Ads Account</span>
          </Link>
          <Link
            className="hover:text-blue-600 flex justify-start gap-0"
            to="/dashboard/myClients"
          >
            <FaPeopleRoof className="w-6 h-6 mr-2" />
            <span> My Clients </span>
          </Link>
          <Link
            className="hover:text-blue-600 flex justify-start gap-0"
            to="/dashboard/adminPayments"
          >
            <MdCampaign className="w-6 h-6 mr-2" />
            <span> Campaign</span>
          </Link>
          <Link
            className="hover:text-blue-600 flex justify-start gap-0"
            to="/dashboard/adminPayments"
          >
            <RiSecurePaymentLine className="w-6 h-6 mr-2" />
            <span> Admin Payment History</span>
          </Link>
        </>
      )}
    </div>
    <div className="flex justify-start ml-28 gap-2">
      <div className="hover:text-blue-700 flex justify-start gap-2 px-4 items-center text-black">
        <img
          className="h-10 w-10 bg-gray-500 p-0.5 rounded-full"
          src={user?.photoURL}
          alt=""
        />
        <Link className="" to={'/dashboard/updateProfile'}>
          <h1>{user?.displayName}</h1>
        </Link>
      </div>
      <button
        onClick={handleLogOut}
        className="text-black inline-block hover:text-red-600 rounded"
      >
        Logout <IoLogOut className="inline-block" />
      </button>
    </div>
  </div>
</div>

         <div className="pt-16 mt-2 min-h-screen h-full bg-[rgb(244,243,243)]">
         <Outlet />
         </div>
        </div>
      </div>

      <div
  className="fixed left-0 top-0 w-full text-left lg:hidden bg-blue-700 p-2 z-5"
  
>
  <div className="flex shadow-blue-700 shadow-2xl justify-between items-center">
    <button onClick={() => setShowSidebar(!showSidebar)} className="text-white border border-white hover:bg-violet-700 p-2">
      {showSidebar || <FaBars />}
    </button>

  <div className="flex justify-start items-center gap-3">
  <Link to={'/'}>
  <p className="text-white"> < LuLayoutDashboard /></p>
  </Link>
  <Link to={'/dashboard/myPayments'}>
  <p className="text-white"> <MdOutlinePayments /></p>
  </Link>
  <Link to={'/dashboard/myClients'}>
  <p className="text-white"> <FaUsersViewfinder /></p>
  </Link>
  </div>

    <div className="hover:text-white flex justify-start gap-2 px-4 items-center text-white">
      <img
        className="h-10 w-10 bg-gray-500 p-0.5 rounded-full"
        src={user?.photoURL}
        alt=""
      />
      <Link className="" to={'/dashboard/updateProfile'}>
        <h1>{user?.displayName}</h1>
      </Link>
      <p  onClick={handleLogOut} className="text-white"><IoIosLogOut /></p>
    </div>
  </div>
</div>


    </div>
  );
};

export default DashboardRoot;
