import { useQuery } from "@tanstack/react-query";
import UseAxiosPublic from "../Axios/UseAxiosPublic";

const useClientsCampaignsPage = (email, page = 1, sortMonth, selectedStatus, selectedYear,role) => {
    const AxiosPublic = UseAxiosPublic();

    const { refetch, data = {} } = useQuery({
        queryKey: ["clientCampaigns", email, page, sortMonth, selectedStatus, selectedYear,role],
        queryFn: async () => {
            const queryParams = new URLSearchParams({
                page: page,
                limit: 100,
                month: sortMonth || "",
                status: selectedStatus || "all",
                year: selectedYear || "",
                role: role || "",
            });
            const res = await AxiosPublic.get(`/client/campaigns/${email}?${queryParams.toString()}`);
            return res.data;
        },
        enabled: !!email && page > 0,
    });

    const clientCampaigns = data.data || [];
    const totalItems = data.totalItems || 0;
    const totalPages = data.totalPages || 1;
    const currentPage = data.currentPage || 1;

    return { clientCampaigns, totalItems, totalPages, currentPage, refetch };
};

export default useClientsCampaignsPage;
