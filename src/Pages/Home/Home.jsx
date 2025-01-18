import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import Login from "../../Security/Login";
import { Helmet } from "react-helmet-async";
import AdsDashboardHome from "../DashboardRoot/AdsHome";
import ClientHome from "./ClientHome";
import useUserr from "../../Hook/useUser";
import AdminHome from "./AdminHome";
import DeveloperHome from "./DeveloperHome";
import DesignerHome from "./DesignerHome";
import Lottie from "lottie-react";
import loadingAnimation from '../../../public/Animation - 1716909160617.json';

const Home = () => {
    const { user } = useContext(AuthContext);
    const {userr}=useUserr(user?.email)
    const [clientUser, setClientUser] = useState(null);
    console.log(user,userr,clientUser);

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
      <Helmet>
        <title>Digital Network | Home</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>

      {clientUser || user ? (
        <div>
          {user ? (
            <div>
             {userr?.role === "admin" ? (
                        <AdminHome></AdminHome>
                    ) : userr?.role === "contributor" ? (
                        <AdsDashboardHome />
                    ) : userr?.role === "webDeveloper" ? (
                        <DeveloperHome />
                    ) : userr?.role === "graphicDesigner" ? (
                        <DesignerHome />
                    ) : userr?.role === "employee" ? (
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
