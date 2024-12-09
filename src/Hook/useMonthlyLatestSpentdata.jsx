import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMonthlyLatestSpent = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: monthlyLatestSpent = [] } = useQuery({
        queryKey: ['monthlyLatestSpent', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/monthlyLatestSpent/${email}`);
            return res.data;
        },
        enabled: !!email 
    });
    
    return [monthlyLatestSpent, refetch];
};

export default useMonthlyLatestSpent;
