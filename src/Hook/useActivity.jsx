
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useActivity = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: activity=[]}=useQuery({
        queryKey:['activity'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/activity`)
            return res.data
        }
    })

return [activity,refetch]

};

export default useActivity;