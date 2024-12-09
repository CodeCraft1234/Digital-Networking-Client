import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const usePayoneerEmail = () => {
  const AxiosPublic = UseAxiosPublic();
  const { refetch, data: payoneerEmail = [] } = useQuery({
    queryKey: ["payoneerEmail "],
    queryFn: async () => {
      const res = await AxiosPublic.get(`/payoneerEmail`);
      return res.data;
    },
  });
  return [payoneerEmail , refetch];
};

export default usePayoneerEmail ;
