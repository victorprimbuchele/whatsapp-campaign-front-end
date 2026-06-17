import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCampaign } from "../services/campaign-service";
import { UpdateCampaignDto } from "../types/update-campaign-dto";

const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, isSuccess } = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCampaignDto }) => updateCampaign(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", id] });
    },
  });

  return { mutate, mutateAsync, isPending, error, isSuccess };
};

export default useUpdateCampaign;
