import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useCampaings = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: campaigns=[]}=useQuery({
        queryKey:['campaings'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/campaings`)
            return res.data
        }
    })
        console.log(campaigns)
        return [campaigns,refetch]
}
export default useCampaings;