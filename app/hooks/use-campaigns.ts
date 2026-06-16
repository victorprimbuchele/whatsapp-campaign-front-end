import { useQuery } from "@tanstack/react-query";
import { getCampaigns } from "../services/campaign-service";
import { CampaignStatusKey } from "../types/campaign-status-key";

const useCampaigns = (params: {
  page: number;
  limit: number;
  search: string;
  status: CampaignStatusKey;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => getCampaigns(params),
  });

  return { data, isLoading, error };
};

export default useCampaigns;
