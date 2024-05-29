import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import loadingAnimation from '../../public/Animation - 1716909160617.json';
import Lottie from 'lottie-react';

const PrivateRoute = ({children}) => {
    const {user,loading}=useContext(AuthContext)
    const location=useLocation()
    
    if(loading){
        // return <span className="loading loading-spinner text-secondary"></span>;
        return  <div className="flex items-center justify-center h-96">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
      }

      if(user){
        return children;
    }
        
    

    return (
        <Navigate to={'/login'} state={location.pathname}>
            
        </Navigate>
    )
};


export default PrivateRoute;