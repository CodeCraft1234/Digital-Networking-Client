import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyContributorPayment = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: MyContributorPayments = [] } = useQuery({
        queryKey: ['MyContributorPayments', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/MyContributorPayments/${email}`);
            return res.data;
        },
        enabled: !!email 
    });
    
    return [MyContributorPayments, refetch];
};

export default useMyContributorPayment;
