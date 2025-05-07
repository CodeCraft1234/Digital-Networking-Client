import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import Login from "../../Security/Login";
import { Helmet } from "react-helmet-async";
import AdsDashboardHome from "../DashboardRoot/AdsHome";
import ClientHome from "./ClientHome";
import AdminHome from "./AdminHome";
import DeveloperHome from "./DeveloperHome";
import DesignerHome from "./DesignerHome";
import useUserr3 from "../../Hook/useUserr3";

const Home = () => {
    const { user } = useContext(AuthContext);
    const {userr3}=useUserr3(user?.email)
    const [clientUser, setClientUser] = useState(null);

    useEffect(() => {
      const storedClientUser = localStorage.getItem("clientUser");
      if (storedClientUser) {
        setClientUser(storedClientUser);
      }
    }, []);



    return (
        <div>
          <Helmet>
        <title>Digital Network | Home</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>

            <div>
      
      {clientUser || user ? (
        <div>
          {user ? (
            <div>
             {userr3?.role === "admin" ? (
                        <AdminHome></AdminHome>
                    ) : userr3?.role === "contributor" ? (
                        <AdsDashboardHome />
                    ) : userr3?.role === "webDeveloper" ? (
                        <DeveloperHome />
                    ) : userr3?.role === "graphicDesigner" ? (
                        <DesignerHome />
                    ) : userr3?.role === "employee" ? (
                        <AdminHome></AdminHome>
                    ) : (
                        <ClientHome />
                    )}
            </div>
          ) : (
            <ClientHome />
          )}
        </div>
      ) : (
        <Login />
      )}
    </div>
             
        </div>
    );
};

export default Home;
