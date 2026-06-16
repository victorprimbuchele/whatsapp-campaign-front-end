import { useQuery } from "@tanstack/react-query";
import { getCampaignStatuses } from "../services/campaign-status-service";

const useGetCampaignStatuses = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaign-statuses"],
    queryFn: () => getCampaignStatuses(),
    staleTime: Infinity,
  });

  return { data, isLoading, error };
};

export default useGetCampaignStatuses;
