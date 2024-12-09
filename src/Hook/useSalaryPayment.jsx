import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useSalaryPayment = () => {
  const AxiosPublic = UseAxiosPublic();
  const { refetch, data: salaryPayment = [] } = useQuery({
    queryKey: ["salaryPayment"],
    queryFn: async () => {
      const res = await AxiosPublic.get(`/salaryPayment`);
      return res.data;
    },
  });
  return [salaryPayment, refetch];
};

export default useSalaryPayment;
