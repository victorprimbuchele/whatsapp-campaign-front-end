import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCampaign } from "../services/campaign-service";
import { CreateCampaignDto } from "../types/create-campaign-dto";

const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, isSuccess } = useMutation({
    mutationFn: (dto: CreateCampaignDto) => createCampaign(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });

  return { mutate, mutateAsync, isPending, error, isSuccess };
};

export default useCreateCampaign;
