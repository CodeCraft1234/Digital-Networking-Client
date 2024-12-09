import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";

const useFindClient = (id) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: findClients = {}, isLoading, isError } = useQuery({
        queryKey: ['findClients', id],
        queryFn: async () => {
            if (!id) return null; // Return null if no id is provided
            const res = await AxiosPublic.get(`/findClients/${id}`);
            return res.data; // Assuming the backend sends the correct data
        },
        enabled: !!id, // Only enable the query if id exists
    });

    return { findClients, refetch, isLoading, isError };
};

export default useFindClient;
