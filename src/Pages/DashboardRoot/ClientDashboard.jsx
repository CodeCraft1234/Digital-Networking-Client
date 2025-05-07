import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle, MdOutlinePayments } from "react-icons/md";
import { useEffect, useState } from "react";
import { SiGoogleads, SiMeta } from "react-icons/si";
import { RiPagesFill } from "react-icons/ri";
import { hover } from "framer-motion";

const ClientDashboard = () => {

  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: '#0B3A84', color: 'white' }
      : {}
  );

  const [clientUser, setClientUser] = useState(null);
  useEffect(() => {
    const storedClientUser = localStorage.getItem("clientUser");
    if (storedClientUser) {
      setClientUser(storedClientUser); 
    }
  }, []);

  const changeTab = (tab) => {
    localStorage.setItem("activeTabClientProfile", tab); 
  };

  return (
    <div  className="w-[205px]  text-white bg-gray-800 pt-10 -ml-2 pr-2 min-h-screen">
    <div className="">

      <ul className=" ">

        <NavLink
          to="/"
          className="text-white hover:bg-[#0B3A84]  py-2 px-3 rounded-lg flex items-center text-lg"
          style={({ isActive }) => getActiveStyle(isActive)}
        >
          <RxDashboard className="w-6 h-6 mr-2" />
          Dashboard
        </NavLink>
      
          <NavLink
            to={`/client/metaAds/${clientUser}`}
            className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('metaAds')}
          >
            <SiMeta className="w-6 h-6 mr-2" />
            Meta Ads
          </NavLink>

          <NavLink
            to={`/client/googleAds/${clientUser}`}
            className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('googleAds')}
          >
            <SiGoogleads className="w-6 h-6 mr-2" />
            Google Ads
          </NavLink>
          <NavLink
            to={`/client/pageSetup/${clientUser}`}
            className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('metaAds')}
          >
            <RiPagesFill className="w-6 h-6 mr-2" />
            Page Setup
          </NavLink>
         
          <NavLink
            to={`/client/payments/${clientUser}`}
            className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('metaAds')}
          >
            <MdOutlinePayments className="w-6 h-6 mr-2" />
            My Payments
          </NavLink>
          <NavLink
            to={`/client/summery/${clientUser}`}
            className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('metaAds')}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            My Summery
          </NavLink>
          <NavLink
            to={`/bankInfo`}
            className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('metaAds')}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            Bank Info
          </NavLink>

          <NavLink
            to={`/client-profile-update/${clientUser}`}
            className="text-white hover:bg-[#0B3A84] py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('metaAds')}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            Update Profile
          </NavLink>

        </ul>
      </div>
    </div>
  );
};
export default ClientDashboard;
