import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";


const useClientPageServiceByRole = (role) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: PageServiceRole = [] } = useQuery({
        queryKey: ['clientsPageService', role],
        queryFn: async () => {
            if (!role) return [];
            const res = await AxiosPublic.get(`/clientsPageService/${role}`);
            return res.data;
        },
        enabled: !!role 
    });
    
    return [PageServiceRole, refetch];
};

export default useClientPageServiceByRole;
