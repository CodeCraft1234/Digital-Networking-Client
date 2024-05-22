import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useUserAdAccount = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: useUserAdAccount=[]}=useQuery({
        queryKey:['useUserAdAccount'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/userad`)
            return res.data
        }
    })
        console.log(useUserAdAccount)
        return [useUserAdAccount,refetch]
};

export default useUserAdAccount;