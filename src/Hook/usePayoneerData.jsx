import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const usePayoneerData = () => {
  const AxiosPublic = UseAxiosPublic();
  const { refetch, data: payoneerData = [] } = useQuery({
    queryKey: ["payoneerData"],
    queryFn: async () => {
      const res = await AxiosPublic.get(`/payoneerData`);
      return res.data;
    },
  });
  return [payoneerData, refetch];
};

export default usePayoneerData;
