import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyUserTotalSpend = (email) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data: totalSpent = 0 } = useQuery({
    queryKey: ['totalSpent', email],
    queryFn: async () => {
      if (!email) return 0;
      const res = await AxiosPublic.get(`/myUser/totalSpent/${email}`);
      return res.data.totalSpent;
    },
    enabled: !!email
  });

  return [totalSpent, refetch];
};

export default useMyUserTotalSpend;
