import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useUserr3 = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: userr3 = null, isLoading, isError } = useQuery({
        queryKey: ['userr3', email],
        queryFn: async () => {
            if (!email) return null;
            const res = await AxiosPublic.get(`/userr3/${email}`);
            return res.data;
        },
        enabled: !!email, 
        retry: false 
    });

    return { userr3, refetch, isLoading, isError };
};

export default useUserr3;
