import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useClientsDueAvance = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: clientsDueAdvance = {}, isLoading, isError } = useQuery({
        queryKey: ['clientsPayments', email], 
        queryFn: async () => {
            if (!email) return { totalItems: 0, totalDue: 0, totalAdvance: 0 };

            try {
                const res = await AxiosPublic.get(`/clients/due/advance/${email}`);
                return res.data || { totalItems: 0, totalDue: 0, totalAdvance: 0 };
            } catch (error) {
                console.error("Error fetching clients due/advance:", error);
                return { totalItems: 0, totalDue: 0, totalAdvance: 0 };
            }
        },
        enabled: !!email, 
    });

    return { clientsDueAdvance, refetch, isLoading, isError };
};

export default useClientsDueAvance;
