import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useUsersSellery2 = (email, year, month) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: usersSellery2 = [] } = useQuery({
        queryKey: ['/usersSellery2', email, year, month],
        queryFn: async () => {
            if (!email || !year || !month) return [];
            const res = await AxiosPublic.get(`/usersSellery2/${email}/${year}/${month}`);
            return res.data;
        },
        enabled: !!email && !!year && !!month 
    });
    
    return [usersSellery2, refetch];
};

export default useUsersSellery2;
