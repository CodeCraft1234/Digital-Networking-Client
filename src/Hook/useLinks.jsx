import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";


const useLinks= () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: links=[]}=useQuery({
        queryKey:['links'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/links`)
            return res.data
        }
    })
        console.log(links)
        return [links,refetch]

}
export default useLinks;