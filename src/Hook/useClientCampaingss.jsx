
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";



const useClientsCampaingss = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: clientsCampaingss=[]}=useQuery({
        queryKey:['clients'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/clientsCampaingss`)
            return res.data
        }
    })
return [clientsCampaingss,refetch]

};

export default useClientsCampaingss;