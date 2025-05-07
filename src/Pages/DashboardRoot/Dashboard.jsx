

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import AdsDashboard from "./AdsDashboard";
import ClientDashboard from "./ClientDashboard"; 
import DeveloperDashboard from "./DeveloperDashboard";
import DesignerDashboard from "./DesignerDashboard";
import { FaArrowDown, FaArrowUp, FaFacebook, FaFacebookMessenger, FaTimes, FaWhatsapp } from "react-icons/fa";
import useUserr3 from "../../Hook/useUserr3";
import { LuMessageCircleMore } from "react-icons/lu";

const Dashboard = ({ showSidebar }) => {
  const { user } = useContext(AuthContext); 
  const {userr3}=useUserr3(user?.email)

  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollButton(true);
        setScrollDirection("up");
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (direction) => {
    const target = direction === "up" ? 0 : document.body.scrollHeight;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const [showButtons, setShowButtons] = useState(false);

  return (
    <div
      className={`bg-gray-900 w-52 min-h-screen md:fixed  lg:fixed text-white ${
        showSidebar ? "block" : "hidden"
      } md:block`}
    >
      <ul className="menu text-center text-lg md:text-xl">
        {  (
          userr3?.role === "admin" ? (
            <AdminDashboard />
          ) : userr3?.role === "contributor" ? (
            <AdsDashboard />
          ) : userr3?.role === "webDeveloper" ? (
            <DeveloperDashboard />
          ) : userr3?.role === "graphicDesigner" ? (
            <DesignerDashboard />
          ) : userr3?.role === "employee" ? (
            <EmployeeDashboard />
          ) : (
            <ClientDashboard />
          )
        )}
      </ul>

      <div className="flex flex-col items-center space-y-4">
      {/* Toggle Button */}
      <button
  onClick={() => setShowButtons(!showButtons)}
  className={`fixed bottom-32 right-8 z-50 ${
    showButtons ? 'bg-red-600' : 'bg-green-600'
  } p-3 rounded-full shadow-lg hover:bg-gray-800 transition duration-300`}
  title={showButtons ? "Hide" : "Show"}
>
  {showButtons ? (
    <FaTimes className="text-white text-xl" />
  ) : (
    <LuMessageCircleMore className="text-white text-xl" />
  )}
</button>


      {/* Social Buttons */}
      {showButtons && (
        <div className="flex flex-col items-end space-y-4">
          <a
            href={`https://wa.me/+88${userr3?.contactNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-[280px] right-8 z-50 bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
            title="Chat on WhatsApp"
          >
            <FaWhatsapp className="text-white text-xl" />
          </a>

          <a
            href={`https://m.me/${userr3?.facebookID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-[230px] right-8 z-50 bg-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            title="Chat on Messenger"
          >
            <FaFacebook className="text-white text-xl" />
          </a>

          <a
            href={`https://m.me/${userr3?.messengerID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-[180px] right-8 z-50 bg-[#0078FF] p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            title="Chat on Messenger"
          >
            <FaFacebookMessenger className="text-white text-xl" />
          </a>
        </div>
      )}

      {/* Scroll Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollTo(scrollDirection)}
          className="fixed bottom-20 right-8 z-50 bg-cyan-700 p-3 rounded-full shadow-lg hover:bg-cyan-800 transition duration-300"
          title={`Scroll to ${scrollDirection === "up" ? "Top" : "Bottom"}`}
        >
          {scrollDirection === "up" ? (
            <FaArrowUp className="text-white text-xl" />
          ) : (
            <FaArrowDown className="text-white text-xl" />
          )}
        </button>
      )}
    </div>
    </div>
  );
};

export default Dashboard;
