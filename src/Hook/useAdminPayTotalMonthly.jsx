import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useAdminPayTotalMonthly = (email, year) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data: adminPayTotalMonthly = {} } = useQuery({
    queryKey: ['adminPayTotalMonthly', email, year],  // Include year in query key
    queryFn: async () => {
      if (!email || !year) return {};  // If email or year is missing, return empty object
      const res = await AxiosPublic.get(`/adminPay/total/monthly/${email}/${year}`); // Send year in API request
      return res.data;  
    },
    enabled: !!email && !!year,  // Ensure query runs only if email & year exist
  });

  return [adminPayTotalMonthly, refetch];  // Return the data and refetch function
};

export default useAdminPayTotalMonthly;
