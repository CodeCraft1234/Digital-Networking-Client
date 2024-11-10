import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import AdsDashboard from "./AdsDashboard";
import ClientDashboard from "./ClientDashboard"; // Make sure this is imported
import Skilitonloader from "./Skilitonloader"; // Import the SkeletonLoader component
import useUserr from "../../Hook/useUser";

const Dashboard = ({ showSidebar }) => {
  const { user } = useContext(AuthContext); // Get the authenticated user from the context
  const {userr}=useUserr(user?.email)
  const [showSkeleton, setShowSkeleton] = useState(true); // State to track skeleton display

  useEffect(() => {
    // Set a timeout to hide the skeleton loader after 1 second
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000); // Updated to 1000 ms (1 second)

    return () => clearTimeout(timer); 
  }, [userr, user]);

  return (
    <div
      className={`bg-gray-900 w-52 min-h-screen lg:fixed text-white ${
        showSidebar ? "block" : "hidden"
      } md:block`}
    >
      <ul className="menu text-center text-lg md:text-xl">
        {showSkeleton ? (
          <Skilitonloader /> 
        ) : (
          userr?.role === "admin" ? (
            <AdminDashboard />
          ) : userr?.role === "contributor" ? (
            <AdsDashboard />
          ) : userr?.role === "employee" ? (
            <EmployeeDashboard />
          ) : (
            <ClientDashboard />
           
          )
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
