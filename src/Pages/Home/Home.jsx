import { useContext, useEffect, useState } from "react";
import AdAccountTable from "./AdAccountTable";
import Banner from "./Banner";
import CampaignTable from "./CampaignTable";
import { AuthContext } from "../../Security/AuthProvider";
import SalarySheet from "../../Components/SalarySheet/SalarySheet";
import UserAdAccount from "../../Components/UserAdAccount/UserAdAccount";
import WorkList from "../../Components/WorkList/WorkList";
import PaymentHistory from "../../Components/PaymentHistory/PaymentHistory";
import MonthlyAdAccount from "./MonthlyAddAccount";
import EmployeerMouthlySelery from "./EmployeerMouthlySelery";
import Login from "../../Security/Login";
import useUsers from "../../Hook/useUsers";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Profile from "../Profile/Profile";
import MyProfile from "./MyProfile";
import TransictionCard from "./TransictionCard";

const Home = () => {

    const { user } = useContext(AuthContext);
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);

    useEffect(() => {
        if (users && user) {
            const fff = users.find(u => u.email === user?.email);
            console.log(fff);
            setDdd(fff || {}); // Update state with found user or an empty object
        }
    }, [users, user]);

    console.log(ddd?.name);

    return (
        <div>
            {
                user ? (
                    <div>
                        {
                            ddd?.role === "admin" ? (
                                <div>
                                    <TransictionCard />
                                    <Banner />
                                </div>
                            ) : (
                                <div>
                                    <MyProfile />
                                </div>
                            )
                        }
                    </div>
                ) : <Login />
            }

        </div>
    );
};

export default Home;
