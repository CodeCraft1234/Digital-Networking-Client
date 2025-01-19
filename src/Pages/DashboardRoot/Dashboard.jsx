import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import AdsDashboard from "./AdsDashboard";
import ClientDashboard from "./ClientDashboard"; // Make sure this is imported
import DeveloperDashboard from "./DeveloperDashboard";
import useUserr from "../../Hook/useUser";
import DesignerDashboard from "./DesignerDashboard";
import { FaArrowDown, FaArrowUp, FaFacebook, FaFacebookMessenger, FaWhatsapp } from "react-icons/fa";
import useUserr3 from "../../Hook/useUserr3";

const Dashboard = ({ showSidebar }) => {
  const { user } = useContext(AuthContext); // Get the authenticated user from the context
  const {userr}=useUserr(user?.email) 

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

  return (
    <div
      className={`bg-gray-900 w-52 min-h-screen lg:fixed text-white ${
        showSidebar ? "block" : "hidden"
      } md:block`}
    >
      <ul className="menu text-center text-lg md:text-xl">
        {  (
          userr?.role === "admin" ? (
            <AdminDashboard />
          ) : userr?.role === "contributor" ? (
            <AdsDashboard />
          ) : userr?.role === "webDeveloper" ? (
            <DeveloperDashboard />
          ) : userr?.role === "graphicDesigner" ? (
            <DesignerDashboard />
          ) : userr?.role === "employee" ? (
            <EmployeeDashboard />
          ) : (
            <ClientDashboard />
           
          )
        )}
      </ul>

      <div className=" flex flex-col  items-center space-y-4 ">
        {/* WhatsApp Button */}
      <div>
          <a
          href={`https://wa.me/+88${userr3?.contactNumber}`} // Replace with your WhatsApp link
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-[400px] right-8 z-50 bg-green-500 p-3  rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp className="text-white text-xl" />
        </a>

             {/* Messenger Button */}
             <a
          href={`https://m.me/${userr3?.facebookID}`} // Replace with your Messenger link
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-[340px] right-8 z-50 bg-blue-600 p-3  rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          title="Chat on Messenger"
        >
          <FaFacebook className="text-white text-xl" />
        </a>

             {/* Messenger Button */}
             <a
          href={`https://m.me/${userr3?.facebookID}`} // Replace with your Messenger link
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-[280px] right-8 z-50 bg-[#0078FF] p-3  rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          title="Chat on Messenger"
        >
          <FaFacebookMessenger className="text-white text-xl" />
        </a>
      </div>

        {/* Scroll Button */}
        {showScrollButton && (
          <button
            onClick={() => scrollTo(scrollDirection)}
            className="fixed bottom-56 right-8 z-50 bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-800 transition duration-300"
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
