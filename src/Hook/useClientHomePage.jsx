import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useClientHomePage = (email) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data: clientHomePage = {} } = useQuery({
    queryKey: ["clientHomePage", email],
    queryFn: async () => {
      const res = await AxiosPublic.get(`/clients/homePage/${email}`);
      return res.data;
    },
    enabled: !!email // Ensure query doesn't run without an email
  });

  return [clientHomePage, refetch];
};

export default useClientHomePage;
