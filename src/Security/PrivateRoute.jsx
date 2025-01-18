import loadingAnimation from '../../public/Animation - 1716909160617.json';
import Lottie from 'lottie-react';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import useUserr from '../Hook/useUser';

const PrivateRoute = ({children}) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const {userr}=useUserr(user?.email)

  const [clientUser, setClientUser] = useState(null);
  console.log(clientUser);

  useEffect(() => {
    const storedClientUser = localStorage.getItem("clientUser");
    if (storedClientUser) {
      setClientUser(storedClientUser);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center min-h-screen justify-center ">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
    );
  }

      if (!userr) {
        return (
          <div className="flex items-center min-h-screen justify-center ">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
        );
      }

  if (!user && clientUser?.lenth < 0) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
