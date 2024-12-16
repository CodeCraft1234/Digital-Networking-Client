

import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useClientsCampaingss = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: clientsCampaingss = [] } = useQuery({
        queryKey: ['clientsCampaingss', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/clientsCampaingss/${email}`);
            return res.data;
        },
        enabled: !!email
    });
    
    return [clientsCampaingss, refetch];
};

export default useClientsCampaingss;
