import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useMyEmployeePayments = (email) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data: MyEmployeePayment = [] } = useQuery({
        queryKey: ['MyEmployeePayments', email],
        queryFn: async () => {
            if (!email) return [];
            const res = await AxiosPublic.get(`/MyEmployeePayments/${email}`);
            return res.data;
        },
        enabled: !!email 
    });
    
    return [MyEmployeePayment, refetch];
};

export default useMyEmployeePayments;




// const filters = { status: "Approved", paymentMethod: selectedCategory, };
// const [MyEmployeePayment, refetch] = useMyEmployeePayments(selectedEmployee3, filters);

// useEffect(() => {
//     console.log("Fetched Payments: ", MyEmployeePayment); // Debugging fetched data
// }, [MyEmployeePayment]);




// import { useQuery } from "@tanstack/react-query";
// import UseAxiosPublic from "../Axios/UseAxiosPublic";

// const useMyEmployeePayments = (email, filters) => {
//     const AxiosPublic = UseAxiosPublic();

//     const { refetch, data: MyEmployeePayment = [] } = useQuery({
//         queryKey: ['MyEmployeePayments', email, filters],
//         queryFn: async () => {
//             if (!email) return [];
//             const params = new URLSearchParams(filters).toString(); // Serialize filters to query string
//             console.log(`Query Params: ${params}`); // Debugging
//             const response = await AxiosPublic.get(`/MyEmployeePayments/${email}?${params}`);
//             return response.data;
//         },
//         enabled: !!email, // Run only if email is present
//     });

//     return [MyEmployeePayment, refetch];
// };

// export default useMyEmployeePayments;












// app.get("/MyEmployeePayments/:email", async (req, res) => {
//     const email = req.params.email;
//     const { status, year, paymentMethod, month } = req.query;
  
//     // Build the MongoDB filter object
//     const filter = email === "all" ? {} : { employeeEmail: email };
  
//     if (status && status !== "All") {
//         filter.status = status;
//     }
//     if (year) {
//         const yearInt = parseInt(year, 10);
//         filter.$expr = filter.$expr
//             ? { $and: [filter.$expr, { $eq: [{ $year: "$date" }, yearInt] }] }
//             : { $eq: [{ $year: "$date" }, yearInt] };
//     }
//     if (month) {
//         const monthInt = parseInt(month, 10);
//         filter.$expr = {
//             ...filter.$expr,
//             $and: [{ $eq: [{ $month: "$date" }, monthInt] }],
//         };
//     }
//     if (paymentMethod && paymentMethod !== "All") {
//         filter.paymentMethod = paymentMethod;
//     }
  
//     try {
//         const result = await adminPaymentCollection.find(filter).toArray();
//         res.send(result);
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).send({ message: "Error fetching data" });
//     }
//   });
