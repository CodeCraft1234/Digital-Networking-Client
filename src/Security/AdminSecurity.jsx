

import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAdmin from '../Components/hook/useAdmin';
import { AuthContext } from './AuthProvider';

const AdminSecurity = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [isAdmin, isAdminLoading] = useAdmin();
    const location = useLocation();
    
    if (loading || isAdminLoading) {
        return <h2 className='text-center text-2xl'>Loading...</h2>;
    }
    
    if (user && isAdmin) {
        return children;
    } 
    
    return <Navigate state={location.pathname} to='/login' />;
};

export default AdminSecurity;



