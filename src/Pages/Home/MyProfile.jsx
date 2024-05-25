import { useContext } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { Link } from "react-router-dom";


const MyProfile = () => {
    const {user}=useContext(AuthContext)

    return (
        <div className="mx auto mt-24 ">
            <Link to={`/userInfo/${user?.email}`}>
            <img className="h-96 w-96 rounded-full mx-auto" src={user.photoURL} alt="" />
            <h1 className="text-center mx-auto font-bold text-7xl">My Profile</h1>
            </Link>
        </div>
    );
};

export default MyProfile;