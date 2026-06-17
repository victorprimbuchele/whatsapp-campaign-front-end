import { useQuery } from "@tanstack/react-query";
import { listTemplates } from "../services/template-service";

const useTemplates = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["templates"],
    queryFn: listTemplates,
    staleTime: 1000 * 60 * 10,
  });

  return { data, isLoading, error };
};

export default useTemplates;
