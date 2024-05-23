import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useWorkList = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: works=[]}=useQuery({
        queryKey:['works'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/works`)
            return res.data
        }
    })
        console.log(works)
        return [works,refetch]
};

export default useWorkList;