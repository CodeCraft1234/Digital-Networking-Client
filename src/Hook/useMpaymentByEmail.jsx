import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMpymentsByEmail = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: Mpayments = [] } = useQuery({
        queryKey: ['Mpayments', email],
        queryFn: async () => {
            if (!email) return []; // Return empty if no email is provided
            const res = await AxiosPublic.get(`/Mpayments/${email}`);
            return res.data;
        },
        enabled: !!email // Only run the query if email is provided
    });
    
    return [Mpayments, refetch];
};

export default useMpymentsByEmail;
