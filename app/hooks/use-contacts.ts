import { useQuery } from "@tanstack/react-query";
import { getContacts } from "../services/contact-service";

type UseContactsParams = {
  page: number;
  limit?: number;
  search?: string;
};

const useContacts = (params: UseContactsParams) => {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["contacts", params],
    queryFn: () => getContacts(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

  return { data, isLoading, isFetching, error };
};

export default useContacts;
