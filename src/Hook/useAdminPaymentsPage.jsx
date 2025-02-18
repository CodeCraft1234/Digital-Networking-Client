import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useAdminPaymentsPage = (email, method, status, month, page = 1) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data = {} } = useQuery({
    queryKey: ["adminPay", email, method, status, month, page],
    queryFn: async () => {
      const res = await AxiosPublic.get(
        `/adminPay/${email}?method=${method}&status=${status}&month=${month}&page=${page}&limit=100`
      );
      return res.data;
    },
    enabled: !!email && !!method && !!status && page > 0,
  });

  const adminPay = data.data || [];
  const totalItems = data.totalItems || 0;
  const totalPages = data.totalPages || 1;
  const currentPage = data.currentPage || 1;

  return { adminPay, totalItems, totalPages, currentPage, refetch };
};

export default useAdminPaymentsPage;
