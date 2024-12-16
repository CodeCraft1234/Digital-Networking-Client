
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";



const useOnlyClientEmail = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: onlyClientEmail=[]}=useQuery({
        queryKey:['onlyClientEmail'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/onlyClientEmail`)
            return res.data
        }
    })
return [onlyClientEmail,refetch]

};

export default useOnlyClientEmail;