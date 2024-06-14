import { Outlet } from "react-router-dom";
import Dashboard from "./Dashboard";
import { FaArrowLeft, FaBars } from "react-icons/fa";
import { useState } from "react";

const DashboardRoot = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="bg-[#85F4FA]">
      <div className="flex relative">
        <div className="absolute md:static lg:w-[18%] grid lg:grid-cols-[140px] top-0 gap-8 lg:gap-8  z-10">
          <Dashboard showSidebar={showSidebar}></Dashboard>
          <div
            className="absolute right-0 top-0 text-right lg:hidden "
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <button className="bg-gradient-to-r from-[#1e1b4b] via-indigo-800 to-[#1e1b4b] text-white p-2 md:hidden">
              {showSidebar && <FaArrowLeft />}
            </button>
          </div>
        </div>
        <div className=" bg-[#85F4FA] min-h-screen rounded-lg w-7xl lg:w-[82%] lg:col-span-2">
          <Outlet></Outlet>
        </div>
      </div>

      <div
        className="absolute left-0 top-0 text-right lg:hidden "
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <button className="bg-gradient-to-r from-[#1201fc] via-indigo-800 to-[#fbfbff] text-white p-2">
          {showSidebar || <FaBars />}
        </button>
      </div>
    </div>
  );
};

export default DashboardRoot;
