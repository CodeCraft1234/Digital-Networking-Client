import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useSellery = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: sellery=[]}=useQuery({
        queryKey:['sellery'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/sellery`)
            return res.data
        }
    })
        console.log(sellery)
        return [sellery,refetch]
};
export default useSellery;