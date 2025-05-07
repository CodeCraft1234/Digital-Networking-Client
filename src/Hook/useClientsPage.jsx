import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useClientsPage = (email, page = 1, searchQuery = "") => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data = {} } = useQuery({
    queryKey: ["client", email, page, searchQuery],
    queryFn: async () => {
      const res = await AxiosPublic.get(
        `/client/${email}?page=${page}&limit=100&search=${encodeURIComponent(searchQuery)}`
      );
      return res.data;
    },
    enabled: !!email && page > 0,
  });

  const client = data.data || [];
  const totalItems = data.totalItems || 0;
  const totalPages = data.totalPages || 1;
  const currentPage = data.currentPage || 1;

  return [client, totalItems, totalPages, currentPage, refetch];
};

export default useClientsPage;
