import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useNotification = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: notification=[]}=useQuery({
        queryKey:['notification'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/notification`)
            return res.data
        }
    })
        console.log(notification)
        return [notification,refetch]
};
export default useNotification;