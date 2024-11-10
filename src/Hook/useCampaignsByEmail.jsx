import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useCampaingsByEmail = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: campaignss = [] } = useQuery({
        queryKey: ['campaignsss', email],
        queryFn: async () => {
            if (!email) return []; // Return empty if no email is provided
            const res = await AxiosPublic.get(`/campaignss/${email}`);
            return res.data;
        },
        enabled: !!email // Only run the query if email is provided
    });
    
    return [campaignss, refetch];
};

export default useCampaingsByEmail;
