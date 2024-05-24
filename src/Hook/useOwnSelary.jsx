//
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useContext } from "react";
import { AuthContext } from "../Security/AuthProvider";


const  useOwnSelary = () => {
    const AxiosPublic=UseAxiosPublic()
const { user }=useContext(AuthContext)
const { refetch, data: ownSelary=[]}=useQuery({
    queryKey:['/ownSelary',user?.email],
    queryFn: async () => {
        const res=await AxiosPublic.get(`/ownSelary?email=${user?.email}`)
        return res.data
    }
})

console.log(ownSelary)
return [ownSelary,refetch]

};

export default useOwnSelary;