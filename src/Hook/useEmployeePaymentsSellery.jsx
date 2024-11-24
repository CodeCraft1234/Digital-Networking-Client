import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useEmployeePaymentsSellery = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: employeePaymentSellery = [] } = useQuery({
        queryKey: ['/employeePaymentSellery', email],
        queryFn: async () => {
            if (!email) return []; 
            const res = await AxiosPublic.get(`/employeePaymentSellery/${email}`);
            return res.data;
        },
        enabled: !!email 
    });
    
    return [employeePaymentSellery, refetch];
};

export default useEmployeePaymentsSellery;
