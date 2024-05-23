
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";


const useAdAccount = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: ads=[]}=useQuery({
        queryKey:['ads'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/ads`)
            return res.data
        }
    })
        console.log(ads)
        return [ads,refetch]
};

export default useAdAccount;