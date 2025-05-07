import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useContributorPaymentsPage = (email, method, status, month, page = 1, year) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data = {} } = useQuery({
    queryKey: ["contributorPayment", email, method, status, month, page, year], // Include year in the query key
    queryFn: async () => {
      const res = await AxiosPublic.get(
        `/contributorPayment/${email}?method=${method}&status=${status}&month=${month}&year=${year}&page=${page}&limit=100`
      );
      return res.data;
    },
    enabled: !!email && !!method && !!status && !!year && page > 0,
  });

  const contributorPay = data.data || [];
  const totalItems = data.totalItems || 0;
  const totalPages = data.totalPages || 1;
  const currentPage = data.currentPage || 1;

  return { contributorPay, totalItems, totalPages, currentPage, refetch };
};

export default useContributorPaymentsPage;
