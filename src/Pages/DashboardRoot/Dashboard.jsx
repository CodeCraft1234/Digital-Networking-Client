import { useContext } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import AdsDashboard from "./AdsDashboard";
import ClientDashboard from "./ClientDashboard"; // Make sure this is imported
import DeveloperDashboard from "./DeveloperDashboard";
import useUserr from "../../Hook/useUser";
import DesignerDashboard from "./DesignerDashboard";

const Dashboard = ({ showSidebar }) => {
  const { user } = useContext(AuthContext); // Get the authenticated user from the context
  const {userr}=useUserr(user?.email) 

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
    </div>
  );
};

export default Dashboard;
