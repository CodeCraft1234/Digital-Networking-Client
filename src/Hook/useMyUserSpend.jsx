import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyUserSpend = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: myUserSpend = [] } = useQuery({
        queryKey: ['MyUserSpend', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/myUser/spend/${email}`);
            return res.data;
        },
        enabled: !!email 
    });
    
    return [myUserSpend, refetch];
};

export default useMyUserSpend;
