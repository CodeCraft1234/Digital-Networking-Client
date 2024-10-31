import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import AdsDashboard from "./AdsDashboard";
import ClientDashboard from "./ClientDashboard"; // Make sure this is imported
import Skilitonloader from "./Skilitonloader"; // Import the SkeletonLoader component
import useUsers from "../../Hook/useUsers"; // Import your custom hook

const Dashboard = ({ showSidebar }) => {
  const { user } = useContext(AuthContext); // Get the authenticated user from the context
  const [users] = useUsers(); // Fetch the list of users
  const [currentUser, setCurrentUser] = useState(null); // Local state to store the current user details
  const [loading, setLoading] = useState(true); // State to track loading
  const [showSkeleton, setShowSkeleton] = useState(true); // State to track skeleton display

  useEffect(() => {
    // Set a timeout to hide the skeleton loader after 1 second
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000); // Updated to 1000 ms (1 second)

    if (users && user) {
      // Find the user details from the list of users based on the authenticated user's email
      const foundUser = users.find((u) => u.email === user?.email);
      setCurrentUser(foundUser || {}); // Update state with found user or an empty object if not found
      setLoading(false); // Data is loaded, stop showing skeleton
    }

    return () => clearTimeout(timer); 
  }, [users, user]);

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
          currentUser?.role === "admin" ? (
            <AdminDashboard />
          ) : currentUser?.role === "contributor" ? (
            <AdsDashboard />
          ) : currentUser?.role === "employee" ? (
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
