import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useContributorPayTotalMonthly = (email, year) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data: contributorPayTotalMonthly = {} } = useQuery({
    queryKey: ['contributorPayTotalMonthly', email, year],  // Include year in query key
    queryFn: async () => {
      if (!email || !year) return {};  // If email or year is missing, return empty object
      const res = await AxiosPublic.get(`/contributorPay/total/monthly/${email}/${year}`); // Send year in API request
      return res.data;  
    },
    enabled: !!email && !!year,  // Ensure query runs only if email & year exist
  });

  return [contributorPayTotalMonthly, refetch];  // Return the data and refetch function
};

export default useContributorPayTotalMonthly;
