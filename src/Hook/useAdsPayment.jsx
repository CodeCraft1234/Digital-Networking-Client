import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useAdsPayment = () => {
  const AxiosPublic = UseAxiosPublic();
  const { refetch, data: adsPayment = [] } = useQuery({
    queryKey: ["adsPayment"],
    queryFn: async () => {
      const res = await AxiosPublic.get(`/adsPayment`);
      return res.data;
    },
  });
  return [adsPayment, refetch];
};

export default useAdsPayment;
