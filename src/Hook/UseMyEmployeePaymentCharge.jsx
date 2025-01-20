import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyEmployeePaymentsCharge = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: MyEmployeePaymentCharge = [] } = useQuery({
        queryKey: ['MyEmployeePaymentsCharge', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/MyEmployeePaymentsCharge/${email}`);
            return res.data;
        },
        enabled: !!email 
    });
    
    return [MyEmployeePaymentCharge, refetch];
};

export default useMyEmployeePaymentsCharge;
