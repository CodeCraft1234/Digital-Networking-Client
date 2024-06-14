
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import AdminDashboard from "./AdminDashboard";
import useUsers from "../../Hook/useUsers";
import EmployeeDashboard from "./EmployeeDashboard";


const Dashboard = ({ showSidebar }) => {
  const { user } = useContext(AuthContext);
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);

    useEffect(() => {
        if (users && user) {
            const foundUser = users.find(u => u.email === user?.email);
            console.log(foundUser);
            setDdd(foundUser || {}); // Update state with found user or an empty object
        }
    }, [users, user]);

    console.log(ddd?.role);

  return (
        <div
          className={` bg-[#1b1b1b] w-72 min-h-screen lg:fixed text-white  ${
            showSidebar ? "block" : "hidden"
          } md:block`}
        >
          <ul className="menu  text-center text-lg md:text-xl">
            {
              ddd?.role === 'admin' ?  <AdminDashboard></AdminDashboard> : <EmployeeDashboard> </EmployeeDashboard>
            }
          </ul>
        </div>
  );
};

export default Dashboard;
