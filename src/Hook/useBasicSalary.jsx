import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useBasicSellery = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: basicSalary=[]}=useQuery({
        queryKey:['basicSalary'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/basicSalary`)
            return res.data
        }
    })
        return [basicSalary,refetch]
};
export default useBasicSellery;