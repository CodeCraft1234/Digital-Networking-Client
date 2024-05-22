import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const usePaymentHistory = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: payments=[]}=useQuery({
        queryKey:['payments'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/payments`)
            return res.data
        }
    })
        console.log(payments)
        return [payments,refetch]
};
export default usePaymentHistory;