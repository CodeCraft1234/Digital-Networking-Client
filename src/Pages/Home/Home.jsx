import { useContext, useEffect, useState } from "react";
import Banner from "./Banner";
import { AuthContext } from "../../Security/AuthProvider";
import Login from "../../Security/Login";
import useUsers from "../../Hook/useUsers";
import MyProfile from "./MyProfile";
import { Helmet } from "react-helmet-async";
import AdsDashboardHome from "../DashboardRoot/AdsHome";
import ClientHome from "./ClientHome";

const Home = () => {
    const { user } = useContext(AuthContext);
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);

    useEffect(() => {
        if (users && user) {
            const foundUser = users.find(u => u.email === user.email);
            setDdd(foundUser || {}); // Update state with found user or an empty object
        }
    }, [users, user]);

    console.log(ddd?.role);

    return (
        <div>
            <Helmet>
                <title>Digital Network | Home</title>
                <link rel="canonical" href="https://www.tacobell.com/" />
            </Helmet>
            
            {user ? (
                <div>
                    {ddd?.role === "admin" ? (
                        <Banner />
                    ) : ddd?.role === "contributor" ? (
                        <AdsDashboardHome />
                    ) : ddd?.role === "client" ? (
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
