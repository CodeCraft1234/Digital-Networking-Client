import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useUserr = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: userr = null, isLoading, isError } = useQuery({
        queryKey: ['userr', email],
        queryFn: async () => {
            if (!email) return null;
            const res = await AxiosPublic.get(`/userr/${email}`);
            return res.data;
        },
        enabled: !!email, 
        retry: false 
    });

    return { userr, refetch, isLoading, isError };
};

export default useUserr;
