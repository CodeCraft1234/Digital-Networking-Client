import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useAddAdsAccount = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: adAds=[]}=useQuery({
        queryKey:['adAds'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/adAds`)
            return res.data
        }
    })
        console.log(adAds)
        return [adAds,refetch]
};

export default useAddAdsAccount;