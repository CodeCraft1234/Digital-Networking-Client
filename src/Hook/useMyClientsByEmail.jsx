import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyClientsByEmail = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: myclients = [] } = useQuery({
        queryKey: ['myclients', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/myclients/${email}`);
            return res.data;
        },
        enabled: !!email // Only run the query if email is provided
    });
    
    return [myclients, refetch];
};

export default useMyClientsByEmail;
