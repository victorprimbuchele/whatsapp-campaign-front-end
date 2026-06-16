import { api } from "../lib/api";
import { CampaignStatusKey } from "../types/campaign-status-key";
import { PaginatedResponse } from "../types/paginated-response";

// campaign status
export async function getCampaignStatuses(): Promise<PaginatedResponse<CampaignStatusKey>> {
  const response = await api.get("/campaigns/statuses");
  return response.data;
}
