import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useUserAdAccount = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: userad=[]}=useQuery({
        queryKey:['userad'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/userad`)
            return res.data
        }
    })
        console.log(userad)
        return [userad,refetch]
};

export default useUserAdAccount;