import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useOnlyClientEmailByEmail = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: onlyClientEmails = [], error } = useQuery({
        queryKey: ['clientEmails', email],
        queryFn: async () => {
            if (!email) return []; 
            const res = await AxiosPublic.get(`/clientEmails/${email}`);
            return res.data;
        },
        enabled: !!email // Ensure query runs only when email is valid
    });

    if (error) {
        console.error("Error fetching client emails:", error.message);
    }
    
    return [onlyClientEmails, refetch];
};

export default useOnlyClientEmailByEmail;
