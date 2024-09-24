
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";
 
//

const useAdsAccount = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: adsAccount=[]}=useQuery({
        queryKey:['/adsAccount'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/adsAccount`)
            return res.data
        }
    })
        return [adsAccount,refetch]
};

export default useAdsAccount;