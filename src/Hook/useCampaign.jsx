//
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useContext } from "react";
import { AuthContext } from "../Security/AuthProvider";


const useCampaings = () => {
    const AxiosPublic=UseAxiosPublic()
const { user }=useContext(AuthContext)
const { refetch, data: campaings=[]}=useQuery({
    queryKey:['/campaings',user?.email],
    queryFn: async () => {
        const res=await AxiosPublic.get(`/campaings?email=${user?.email}`)
        return res.data
    }
})

console.log(campaings)
return [campaings,refetch]

};

export default useCampaings;