import { Outlet } from "react-router-dom";
import Profile from "./Profile";


const ProfileRoot = () => {
    return (
        <div>
            <Profile></Profile>
            <Outlet></Outlet>
        </div>
    );
};

export default ProfileRoot;