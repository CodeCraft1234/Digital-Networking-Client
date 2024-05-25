//
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useContext } from "react";
import { AuthContext } from "../Security/AuthProvider";


const useOwnSelary = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: ownSalery=[]}=useQuery({
        queryKey:['ownSelary'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/ownSelary`)
            return res.data
        }
    })
console.log(ownSalery)
return [ownSalery,refetch]

};

export default useOwnSelary;