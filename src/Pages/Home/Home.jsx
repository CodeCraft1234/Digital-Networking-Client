import { useContext } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import Login from "../../Security/Login";
import MyProfile from "./MyProfile";
import { Helmet } from "react-helmet-async";
import AdsDashboardHome from "../DashboardRoot/AdsHome";
import ClientHome from "./ClientHome";
import useUserr from "../../Hook/useUser";
import AdminHome from "./AdminHome";
import DeveloperHome from "./DeveloperHome";
import DesignerHome from "./DesignerHome";

const Home = () => {
    const { user } = useContext(AuthContext);
    const {userr}=useUserr(user?.email)
    
    return (
        <div>
            <Helmet>
                <title>Digital Network | Home</title>
                <link rel="canonical" href="https://www.tacobell.com/" />
            </Helmet>
            
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
                    ) : userr?.role === "client" ? (
                        <ClientHome />
                    ) : (
                        <MyProfile />
                    )}
                </div>
            ) : (
                <Login />
            )}
        </div>
    );
};

export default Home;
