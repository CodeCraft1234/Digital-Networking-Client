
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";


const useAdsAccountCenter = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: adsAccountCenter=[]}=useQuery({
        queryKey:['adsAccountCenter'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/adsAccountCenter`)
            return res.data
        }
    })
        console.log(adsAccountCenter)
        return [adsAccountCenter,refetch]
};

export default useAdsAccountCenter;