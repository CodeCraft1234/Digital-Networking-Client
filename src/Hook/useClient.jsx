import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useClients = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: clientsPayments = [] } = useQuery({
        queryKey: ['clientsPaymentss', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/clientsPaymentss/${email}`);
            return res.data;
        },
        enabled: !!email, // Ensure query only runs if email is valid
    });

    return [clientsPayments, refetch];
};

export default useClients;
