import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useEditNotification = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: editNotification=[]}=useQuery({
        queryKey:['editNotification'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/editNotification`)
            return res.data
        }
    })
        return [editNotification,refetch]
};
export default useEditNotification;