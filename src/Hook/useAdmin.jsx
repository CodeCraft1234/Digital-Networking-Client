import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../Axios/UseAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../Security/AuthProvider";


const useAdmin = () => {
    const {user, loading} = useContext(AuthContext)
    const AxiosSecure = UseAxiosSecure();
    // use axios secure with tanstack  query
    const {data: isAdmin, isLoading: isAdminLoading} = useQuery({
        queryKey: ['isAdmin', user?.email],
        enabled: !loading,
        queryFn: async () => {
            const res = await AxiosSecure.get(`/users/admin/${user?.email}`);
            return res.data.admin;
        }
    })
    return [isAdmin, isAdminLoading]
}
export default useAdmin;