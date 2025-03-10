import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useRates = () => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data: rates = {} } = useQuery({
    queryKey: ['rates'],
    queryFn: async () => {
      const res = await AxiosPublic.get(`/rates`);
      return res.data || {}; // Ensure an empty object is returned if no data exists
    }
  });

  return { rates, refetch };
};

export default useRates;
