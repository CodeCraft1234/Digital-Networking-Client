//
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useContext } from "react";
import { AuthContext } from "../Security/AuthProvider";


const useCampaings = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: campaings=[]}=useQuery({
        queryKey:['campaigns'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/campaigns`)
            return res.data
        }
    })
console.log(campaings)
return [campaings,refetch]

};

export default useCampaings;