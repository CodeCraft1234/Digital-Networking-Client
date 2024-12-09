import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMySalaryPayments = (email) => {
    
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: MySalaryPayment = [] } = useQuery({
        queryKey: ['MySalaryPayment', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/MySalaryPayment/${email}`);
            return res.data;
        },
        enabled: !!email 
    });
    
    return [MySalaryPayment, refetch];
};

export default useMySalaryPayments;
