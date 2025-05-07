import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMySalaryPayments = (email, page = 1, limit = 10) => {
    const AxiosPublic = UseAxiosPublic();
  
    const { refetch, data = {} } = useQuery({
      queryKey: ['MySalaryPayment', email, page, limit],
      queryFn: async () => {
        if (!email) return { data: [], totalCount: 0, totalPages: 0 };
        const res = await AxiosPublic.get(`/MySalaryPayment/${email}?page=${page}&limit=${limit}`);
        return res.data;
      },
      enabled: !!email,
    });
  
    const MySalaryPayment = data.data || [];
    const totalCount = data.totalCount || 0;
    const totalPages = data.totalPages || 0;  // 👈 fetch totalPages from backend
  
    return [MySalaryPayment, totalCount, totalPages, refetch];
  };
  
  export default useMySalaryPayments;
  