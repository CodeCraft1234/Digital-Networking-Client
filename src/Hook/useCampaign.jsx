
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useCampaings = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: campaings=[]}=useQuery({
        queryKey:['campaigns'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/campaigns`)
            return res.data
        }
    })
return [campaings,refetch]

};

export default useCampaings;