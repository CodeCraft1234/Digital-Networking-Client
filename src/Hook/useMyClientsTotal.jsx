import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyClientsTotal = (email, month) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data: myClientsTotal = {} } = useQuery({
    queryKey: ['myClientsTotal', { email, month }],
    queryFn: async ({ queryKey }) => {
      const { email, month } = queryKey[1];
      if (!email) return {};

      const res = await AxiosPublic.get(`/myclients/total/${email}?month=${month}`);
      return res.data;
    },
    enabled: !!email,
  });

  return [myClientsTotal, refetch];
};

export default useMyClientsTotal;
