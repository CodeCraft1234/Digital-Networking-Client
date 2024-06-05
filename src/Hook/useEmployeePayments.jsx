import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useEmployeePayment = () => {
    const AxiosPublic=UseAxiosPublic()
    const { refetch, data: employeePayment=[]}=useQuery({
        queryKey:['employeePayment'],
        queryFn: async () => {
            const res=await AxiosPublic.get(`/employeePayment`)
            return res.data
        }
    })
    
console.log(employeePayment)
return [employeePayment,refetch]

};

export default useEmployeePayment;