import { useQuery } from "@tanstack/react-query";
import { getCampaignById } from "../services/campaign-service";

const useGetCampaign = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => getCampaignById(id),
  });

  return { data, isLoading, error };
};

export default useGetCampaign;
