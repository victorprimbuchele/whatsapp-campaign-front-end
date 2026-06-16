import { useMutation } from "@tanstack/react-query";
import { deleteCampaign } from "../services/campaign-service";

const useDeleteCampaign = (id: string) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: () => deleteCampaign(id),
  });

  return { mutate, isPending, error };
};

export default useDeleteCampaign;
