import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useClientsPaymentsPage = (email, page = 1, sortMonth, selectedYear) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data = {} } = useQuery({
    queryKey: ["clientPayments", email, page, sortMonth, selectedYear],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "100",
        month: sortMonth || "",
        year: selectedYear || "",
      });

      const res = await AxiosPublic.get(`/client/payments/${email}?${queryParams.toString()}`);
      return res.data;
    },
    enabled: !!email && page > 0,
  });

  const clientPayments = data?.data || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;

  return { clientPayments, totalItems, totalPages, currentPage, refetch };
};

export default useClientsPaymentsPage;
