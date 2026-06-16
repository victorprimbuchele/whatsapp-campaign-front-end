import { api } from "../lib/api";
import { Campaign } from "../types/campaign";
import { CampaignStatusKey } from "../types/campaign-status-key";
import { PaginatedResponse } from "../types/paginated-response";

// health
export async function health() {
  const response = await api.get("/health");
  return response.data;
}

// get campaigns
export async function getCampaigns(params: {
  page: number;
  limit: number;
  search: string;
  status: CampaignStatusKey;
}): Promise<PaginatedResponse<Campaign>> {
  const response = await api.get("/campaigns", { params });
  return response.data;
}

// get campaign by id
export async function getCampaignById(id: string): Promise<Campaign> {
  const response = await api.get(`/campaigns/${id}`);
  return response.data;
}

// create campaign
export async function createCampaign(campaign: Campaign): Promise<Campaign> {
  const response = await api.post("/campaigns", campaign);
  return response.data;
}

// update campaign
export async function updateCampaign(id: string, campaign: Campaign): Promise<Campaign> {
  const response = await api.put(`/campaigns/${id}`, campaign);
  return response.data;
}

// delete campaign
export async function deleteCampaign(id: string): Promise<void> {
  await api.delete(`/campaigns/${id}`);
}
