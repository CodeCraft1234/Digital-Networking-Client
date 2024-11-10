import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyCampaingsByEmail = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: mycampaigns = [] } = useQuery({
        queryKey: ['mycampaigns', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/mycampaigns/${email}`);
            return res.data;
        },
        enabled: !!email // Only run the query if email is provided
    });
    
    return [mycampaigns, refetch];
};

export default useMyCampaingsByEmail;
