import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useBankInfo = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: bankInfo=[]}=useQuery({
        queryKey:['bankInfo'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/bankInfo`)
            return res.data
        }
    })
        console.log(bankInfo)
        return [bankInfo,refetch]
};
export default useBankInfo;