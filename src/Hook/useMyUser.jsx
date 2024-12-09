import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyUser = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: MyEmployeePayment = [] } = useQuery({
        queryKey: ['MyEmployeePayment', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/myUser/${email}`);
            return res.data;
        },
        enabled: !!email 
    });
    
    return [MyEmployeePayment, refetch];
};

export default useMyUser;
