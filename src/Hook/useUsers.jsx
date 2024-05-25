import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";
const useUsers = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: users=[]}=useQuery({
        queryKey:['users'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/users`)
            return res.data
        }
    })
        console.log(users)
        return [users,refetch]
}
export default useUsers;