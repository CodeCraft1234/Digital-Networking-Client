import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useClientsPage2 = (email, page = 1) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data = {} } = useQuery({
    queryKey: ["client", email, ],
    queryFn: async () => {
      const res = await AxiosPublic.get(`/client/${email}?`);
      return res.data;
    },
    enabled: !!email && page > 0,
  });

  const client2 = data.data || [];
  const totalItems = data.totalItems || 0;
  const currentPage = data.currentPage || 1;

  return [client2, totalItems,  currentPage, refetch];
};

export default useClientsPage2;
