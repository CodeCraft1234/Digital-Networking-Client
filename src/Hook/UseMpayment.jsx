//
import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";



const useMpayment = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: MPayment=[]}=useQuery({
        queryKey:['Mpayment'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/Mpayment`)
            return res.data
        }
    })

return [MPayment,refetch]

};

export default useMpayment;