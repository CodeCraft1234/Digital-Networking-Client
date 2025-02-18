import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyClientsTotalsByEmail = (email) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data: totals = {} } = useQuery({
    queryKey: ['myclientsTotals', email],
    queryFn: async () => {
      if (!email) return {};
      const res = await AxiosPublic.get(`/myclients/total/${email}`);
      return res.data;
    },
    enabled: !!email // Only run the query if email is provided
  });

  return [totals, refetch];
};

export default useMyClientsTotalsByEmail;
