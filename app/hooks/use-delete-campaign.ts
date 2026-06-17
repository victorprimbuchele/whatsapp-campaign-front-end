import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCampaign } from "../services/campaign-service";

const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });

  return { mutate, isPending, error };
};

export default useDeleteCampaign;
