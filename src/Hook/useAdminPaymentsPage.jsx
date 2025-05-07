import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useAdminPaymentsPage = (email, method, status, month, page = 1, year) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data = {} } = useQuery({
    queryKey: ["adminPay", email, method, status, month, page, year], // Include year in the query key
    queryFn: async () => {
      const res = await AxiosPublic.get(
        `/adminPay/${email}?method=${method}&status=${status}&month=${month}&year=${year}&page=${page}&limit=100`
      );
      return res.data;
    },
    enabled: !!email && !!method && !!status && !!year && page > 0,
  });

  const adminPay = data.data || [];
  const totalItems = data.totalItems || 0;
  const totalPages = data.totalPages || 1;
  const currentPage = data.currentPage || 1;

  return { adminPay, totalItems, totalPages, currentPage, refetch };
};

export default useAdminPaymentsPage;
