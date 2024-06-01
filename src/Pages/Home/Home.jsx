import { useContext, useEffect, useState } from "react";
import Banner from "./Banner";
import { AuthContext } from "../../Security/AuthProvider";
import Login from "../../Security/Login";
import useUsers from "../../Hook/useUsers";
import MyProfile from "./MyProfile";

const Home = () => {
    const { user } = useContext(AuthContext);
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);

    useEffect(() => {
        if (users && user) {
            const foundUser = users.find(u => u.email === user.email);
            console.log(foundUser);
            setDdd(foundUser || {}); // Update state with found user or an empty object
        }
    }, [users, user]);

    console.log(ddd?.role);

    return (
        <div>
            {user ? (
                <div>
                    {ddd?.role === "admin" ? (
                        <Banner />
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
