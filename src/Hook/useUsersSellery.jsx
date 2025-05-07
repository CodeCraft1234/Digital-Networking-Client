import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useUsersSellery = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: usersSellery = [] } = useQuery({
        queryKey: ['/usersSellery', email],
        queryFn: async () => {
            if (!email) return []; 
            const res = await AxiosPublic.get(`/usersSellery/${email}`);
            return res.data;
        },
        enabled: !!email 
    });
    
    return [usersSellery, refetch];
};

export default useUsersSellery;




