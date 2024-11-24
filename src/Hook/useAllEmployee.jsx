import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useAllEmployee = () => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: allEmployees = [] } = useQuery({
        queryKey: ['/allEmployees'],
        queryFn: async () => {
            const res = await AxiosPublic.get(`/allEmployees`);
            return res.data;
        },
    });
    
    return [allEmployees, refetch];
};

export default useAllEmployee;
