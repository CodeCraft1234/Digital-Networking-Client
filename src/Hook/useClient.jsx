
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";



const useClients = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: clients=[]}=useQuery({
        queryKey:['clients'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/clients`)
            return res.data
        }
    })
return [clients,refetch]

};

export default useClients;