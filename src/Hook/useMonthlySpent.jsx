//
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const usemonthlySpent = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: monthlySpent=[]}=useQuery({
        queryKey:['monthlySpent'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/monthlySpent`)
            return res.data
        }
    })
console.log(monthlySpent)
return [monthlySpent,refetch]

};

export default usemonthlySpent;