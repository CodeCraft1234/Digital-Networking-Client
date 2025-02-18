import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useAdminPayTotalMonthly = (email) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data: adminPayTotalMonthly = {} } = useQuery({
    queryKey: ['adminPayTotalMonthly', email],  // Updated queryKey structure
    queryFn: async () => {
      if (!email) return {};  // If email is not provided, return empty object
      const res = await AxiosPublic.get(`/adminPay/total/monthly/${email}`);
      return res.data;  // The response will be the aggregated paymentByMonth object
    },
    enabled: !!email,  // Ensure query is enabled only if email exists
  });

  return [adminPayTotalMonthly, refetch];  // Return the data and refetch function
};

export default useAdminPayTotalMonthly;
