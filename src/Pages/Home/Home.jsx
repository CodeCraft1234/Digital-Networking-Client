import { useContext, useEffect, useState } from "react";
import Banner from "./Banner";
import { AuthContext } from "../../Security/AuthProvider";
import Login from "../../Security/Login";
import useUsers from "../../Hook/useUsers";
import MyProfile from "./MyProfile";
import { Helmet } from "react-helmet-async";
import AdsDashboardHome from "../DashboardRoot/AdsHome";
import ClientHome from "./ClientHome";
import useUserr from "../../Hook/useUser";

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
                        <Banner />
                    ) : userr?.role === "contributor" ? (
                        <AdsDashboardHome />
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
