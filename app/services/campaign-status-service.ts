import { api } from "../lib/api";
import { CampaignStatusMeta } from "../types/campaign-status-meta";

export async function getCampaignStatuses(): Promise<CampaignStatusMeta[]> {
  const response = await api.get("/campaigns/statuses");
  return response.data;
}
