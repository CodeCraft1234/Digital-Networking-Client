import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useSalarySheet = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: salary=[]}=useQuery({
        queryKey:['salary'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/salary`)
            return res.data
        }
    })
        console.log(salary)
        return [salary,refetch]
};
export default useSalarySheet;