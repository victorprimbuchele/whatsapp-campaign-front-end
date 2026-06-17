import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCampaigns } from "../services/campaign-service";
import { CampaignStatusKey } from "../types/campaign-status-key";

const useCampaigns = (params: {
  page: number;
  limit?: number;
  search?: string;
  status?: CampaignStatusKey;
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["campaigns", params],
    queryFn: () => getCampaigns(params),
    placeholderData: keepPreviousData,
    refetchOnMount: true,
  });

  return { data, isLoading, error, refetch };
};

export default useCampaigns;
