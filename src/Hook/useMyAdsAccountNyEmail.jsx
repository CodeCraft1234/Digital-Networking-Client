import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyAdsAccountByEmail = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: myAdsAccount = [] } = useQuery({
        queryKey: ['myAdsAccount', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/myAdsAccount/${email}`);
            return res.data;
        },
        enabled: !!email
    });
    
    return [myAdsAccount, refetch];
};

export default useMyAdsAccountByEmail;
