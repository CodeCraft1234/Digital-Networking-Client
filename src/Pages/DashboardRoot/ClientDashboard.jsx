import { Link, NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle, MdOutlinePayments } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { SiGoogleads, SiMeta } from "react-icons/si";
import { RiPagesFill } from "react-icons/ri";

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: '#05a0db', color: 'white' }
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
    <div className="w-[225px]  text-white bg-gray-900 -mt-3 -ml-2 pr-2 min-h-screen">
      <div >
        <div className="flex  items-center justify-center py-4">
          <Link to={"/"}>
            <img
              className="w-24"
              src="https://i.ibb.co/rvH9Bz0/Logo-01.png"
              alt="Logo"
            />
          </Link>
        </div>
        <ul className="space-y-1">
        
          <NavLink
            to="/"
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Dashboard
          </NavLink>
      
          <NavLink
            to={`/client/metaAds/${clientUser}`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('metaAds')}
          >
            <SiMeta className="w-6 h-6 mr-2" />
            Meta Ads
          </NavLink>

          <NavLink
            to={`/client/googleAds/${clientUser}`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('googleAds')}
          >
            <SiGoogleads className="w-6 h-6 mr-2" />
            Google Ads
          </NavLink>
          <NavLink
            to={`/client/pageSetup/${clientUser}`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('metaAds')}
          >
            <RiPagesFill className="w-6 h-6 mr-2" />
            Page Setup
          </NavLink>
         
          <NavLink
            to={`/client/payments/${clientUser}`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('metaAds')}
          >
            <MdOutlinePayments className="w-6 h-6 mr-2" />
            My Payments
          </NavLink>
          <NavLink
            to={`/client/summery/${clientUser}`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('metaAds')}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            My Summery
          </NavLink>
          <NavLink
            to={`/bankInfo`}
            className="text-white hover:bg-[#f89320] hover:text-black py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
            onClick={() => changeTab('metaAds')}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            Bank Info
          </NavLink>

        </ul>
      </div>
    </div>
  );
};
export default ClientDashboard;
