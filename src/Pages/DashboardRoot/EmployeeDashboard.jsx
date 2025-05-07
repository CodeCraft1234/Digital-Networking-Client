import { NavLink } from "react-router-dom";
import { FaHistory} from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle, MdCampaign, MdHomeRepairService, MdOutlinePayments, MdOutlineSummarize } from "react-icons/md";
import { FaNoteSticky, FaPeopleGroup } from "react-icons/fa6";
import { CiBank } from "react-icons/ci";
import { IoMdCash } from "react-icons/io";


const EmployeeDashboard = () => {

  const getActiveStyle = (isActive) => (
    isActive
      ? { backgroundColor: '#0B3A84', color: 'white' }
      : {}
  );


  return (
    <div  className="w-[205px]  text-white bg-gray-800 pt-10 -ml-2 pr-2 min-h-screen">
      <div className="">

        <ul className="space-y-1">
        
          <NavLink
            to="/"
            className="text-white hover:bg-[#0B3A84]  py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Dashboard
          </NavLink>

          <NavLink
            to={`/adsAccount`}
            className="text-white hover:bg-[#0B3A84]  py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdAccountCircle className="w-6 h-6 mr-2" />
            Ads Account
          </NavLink>
          <NavLink
                  to="/clients"
                  className="text-white hover:bg-[#0B3A84]  py-2 px-4 rounded-lg flex items-center"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <FaPeopleGroup className="w-6 h-6 mr-2" />
                 My Client
                </NavLink>
                <NavLink
            to="/campaigns"
            className="text-white hover:bg-[#0B3A84]  py-2 px-4 rounded-lg flex items-center text-lg"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdCampaign className="w-6 h-6 mr-2" />
            Campaigns
          </NavLink>

             <NavLink
                      to="/services"
                      className="text-white hover:bg-[#0B3A84]  py-2 px-4 rounded-lg flex items-center text-lg"
                      style={({ isActive }) => getActiveStyle(isActive)}
                    >
                      <MdHomeRepairService className="w-6 h-6 mr-2" />
                      Services
                    </NavLink>
       
          <NavLink
            to={`/allPayments`}
            className="text-white hover:bg-[#0B3A84]  py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdOutlinePayments className="w-6 h-6 mr-2" />
           Payment
          </NavLink>
          <NavLink
            to={`/summery`}
            className="text-white hover:bg-[#0B3A84]  py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <MdOutlineSummarize className="w-6 h-6 mr-2" />
           Summery
          </NavLink>

          <NavLink
            to={`/monthlySpend`}
            className="text-white hover:bg-[#0B3A84]  py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <FaHistory className="w-6 h-6 mr-2" />
            Spend
          </NavLink>
          <NavLink
            to={`/salary`}
            className="text-white hover:bg-[#0B3A84]  py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
            <IoMdCash className="w-6 h-6 mr-2" />
            Salary
          </NavLink>

          <NavLink
            to={`/bankInfo`}
            className="text-white hover:bg-[#0B3A84]  py-2 px-4 rounded-lg flex items-center"
            style={({ isActive }) => getActiveStyle(isActive)}
          >
           <CiBank   className="w-6 h-6 mr-2" />
           Bank Info
          </NavLink>

            <NavLink
                      to={`/invoice`}
                      className="text-white hover:bg-[#0B3A84]  py-2 px-4 rounded-lg flex items-center text-lg"
                      style={({ isActive }) => getActiveStyle(isActive)}
                    >
                     <FaNoteSticky   className="w-6 h-6 mr-2" />
                     Invoice
                    </NavLink>
         
        </ul>
      </div>
    </div>
  );
};
export default EmployeeDashboard;
