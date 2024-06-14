import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";


const useLogo= () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: logo=[]}=useQuery({
        queryKey:['logos'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/logos`)
            return res.data
        }
    })
        console.log(logo)
        return [logo,refetch]

}
export default useLogo;