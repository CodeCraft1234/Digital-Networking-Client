import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyActivity = (email) => {
  const AxiosPublic = UseAxiosPublic();

  const { refetch, data: myActivity = [], isError, error } = useQuery({
    queryKey: ['myActivity', email],
    queryFn: async () => {
      if (!email) return [];
      const res = await AxiosPublic.get(`/myActivity/${email}`);
      return res.data;
    },
    enabled: !!email, 
  });

  if (isError) {
    console.error("Error fetching myActivity:", error);
  }

  return [myActivity, refetch];
};

export default useMyActivity;
