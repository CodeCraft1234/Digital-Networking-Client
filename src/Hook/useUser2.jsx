import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useUserr2 = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: userr2 = null, isLoading, isError } = useQuery({
        queryKey: ['userr', email],
        queryFn: async () => {
            if (!email) return null;
            const res = await AxiosPublic.get(`/userr2/${email}`);
            return res.data;
        },
        enabled: !!email, 
        retry: false 
    });

    return { userr2, refetch, isLoading, isError };
};

export default useUserr2;
