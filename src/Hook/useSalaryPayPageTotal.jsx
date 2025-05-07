import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useSalaryPayPageTotal = (email, paymentMethod, month, year) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data: salaryTotals = {} } = useQuery({
    queryKey: ["salaryPay", email, paymentMethod,  month, year],
    queryFn: async () => {
      if (!email) return {};
      const res = await AxiosPublic.get(
        `/salaryPay/total/${email}?method=${paymentMethod}&month=${month}&year=${year}`
      );
      return res.data;
    },
    enabled: !!email,
  });

  return [salaryTotals, refetch];
};

export default useSalaryPayPageTotal;
