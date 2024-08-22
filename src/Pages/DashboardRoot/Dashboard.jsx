import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import AdminDashboard from "./AdminDashboard";
import useUsers from "../../Hook/useUsers";
import EmployeeDashboard from "./EmployeeDashboard";
import AdsDashboard from "./AdsDashboard";






const Dashboard = ({ showSidebar }) => {
  const { user } = useContext(AuthContext); // Get the authenticated user from the context
  const [users] = useUsers(); // Fetch the list of users
  const [currentUser, setCurrentUser] = useState(null); // Local state to store the current user details

  useEffect(() => {
    if (users && user) {
      // Find the user details from the list of users based on the authenticated user's email
      const foundUser = users.find(u => u.email === user?.email);
      console.log(foundUser);
      setCurrentUser(foundUser || {}); // Update state with found user or an empty object if not found
    }
  }, [users, user]);

  console.log(currentUser?.role); // Log the role for debugging purposes

  return (
    <div
      className={`bg-gray-900 w-52 min-h-screen lg:fixed text-white ${
        showSidebar ? "block" : "hidden"
      } md:block`}
    >
      <ul className="menu text-center text-lg md:text-xl">
        {
          currentUser?.role === 'admin' ? 
            <AdminDashboard /> : 
            (currentUser?.role === 'adsAccount' ? <AdsDashboard></AdsDashboard>  :  <EmployeeDashboard />)
        }
      </ul>
    </div>
  );
};

export default Dashboard;
