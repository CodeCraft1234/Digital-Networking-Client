import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyUser2 = (email, year) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: MyEmployeePayment = [] } = useQuery({
        queryKey: ['MyEmployeePayment', email, year],
        queryFn: async () => {
            if (!email || !year) return [];
            const res = await AxiosPublic.get(`/myUser2/${email}/${year}`); // Pass year to the API
            return res.data;
        },
        enabled: !!email && !!year
    });
    
    return [MyEmployeePayment, refetch];
};

export default useMyUser2;
