import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMypymentsByEmail = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: Mypayments = [] } = useQuery({
        queryKey: ['Mypayments', email],
        queryFn: async () => {
            if (!email) return []; // Return empty if no email is provided
            const res = await AxiosPublic.get(`/Mypayments/${email}`);
            return res.data;
        },
        enabled: !!email // Only run the query if email is provided
    });
    
    return [Mypayments, refetch];
};

export default useMypymentsByEmail;
