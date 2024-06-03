//
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";



const useMpayment = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: MPayment=[]}=useQuery({
        queryKey:['MPayment'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/MPayment`)
            return res.data
        }
    })
console.log(MPayment)
return [MPayment,refetch]

};

export default useMpayment;