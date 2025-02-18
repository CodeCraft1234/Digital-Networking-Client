import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useAdminPayPageTotal = (email, paymentMethod, status, month, year) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data: totals = {} } = useQuery({
    queryKey: ["adminPayTotals", email, paymentMethod, status, month, year],
    queryFn: async () => {
      if (!email) return {};
      const res = await AxiosPublic.get(
        `/adminPay/total/${email}?method=${paymentMethod}&status=${status}&month=${month}&year=${year}`
      );
      return res.data;
    },
    enabled: !!email,
  });

  return [totals, refetch];
};

export default useAdminPayPageTotal;
