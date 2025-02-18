import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyUserRunningMonthSpent = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: myUserRunningMonthSpent = [] } = useQuery({
        queryKey: ['myUserRunningMonthSpent', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/myUser/runningMonth/spent/${email}`);
            return res.data;
        },
        enabled: !!email 
    });
    
    return [myUserRunningMonthSpent, refetch];
};

export default useMyUserRunningMonthSpent;
