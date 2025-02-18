import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import useUserr3 from "../Hook/useUserr3";
import useUserr from "../Hook/useUser";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const {userr3}=useUserr3(user?.email)
  const {userr}=useUserr(user?.email)
  const [clientUser, setClientUser] = useState(null);

  useEffect(() => {
    const storedClientUser = localStorage.getItem("clientUser");
    if (storedClientUser) {
      setClientUser(JSON.parse(storedClientUser)); // Parse JSON if stored as object
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center min-h-screen justify-center">
      <img
        className="w-72 animate-pulse h-72"
        src="https://i.ibb.co/kgtRN6zt/Digital-Network-White.png"
        alt="Logo"
      />
    </div>
    );
  }

  if ( user && !userr3 && !clientUser) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <img
          className="w-72 animate-pulse h-72"
          src="https://i.ibb.co/kgtRN6zt/Digital-Network-White.png"
          alt="Logo"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
