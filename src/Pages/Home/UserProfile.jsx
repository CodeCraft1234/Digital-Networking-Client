import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Security/AuthProvider";


const UserProfile = () => {
    const {user}=useContext(AuthContext)
    return (
        <div>
            <div className="mx auto mt-24 ">
            <Link to={`/client/${user?.email}`}>
            <img className="h-96 w-96 rounded-full mx-auto" src={user?.photoURL} alt="" />
            <h1 className="text-center mx-auto font-bold text-7xl">My Profile</h1>
            </Link>
        </div>
        </div>
    );
};

export default UserProfile;