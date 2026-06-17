import { api } from "../lib/api";
import { Campaign } from "../types/campaign";
import { CampaignStatusKey } from "../types/campaign-status-key";
import { CreateCampaignDto } from "../types/create-campaign-dto";
import { UpdateCampaignDto } from "../types/update-campaign-dto";
import { PaginatedResponse } from "../types/paginated-response";

export async function getCampaigns(params: {
  page: number;
  limit?: number;
  search?: string;
  status?: CampaignStatusKey;
}): Promise<PaginatedResponse<Campaign>> {
  const response = await api.get("/campaigns", { params });
  return response.data;
}

export async function getCampaignById(id: string): Promise<Campaign> {
  const response = await api.get(`/campaigns/${id}`);
  return response.data;
}

export async function createCampaign(dto: CreateCampaignDto): Promise<Campaign> {
  const response = await api.post("/campaigns", dto);
  return response.data;
}

export async function updateCampaign(id: string, dto: UpdateCampaignDto): Promise<Campaign> {
  const response = await api.patch(`/campaigns/${id}`, dto);
  return response.data;
}

export async function deleteCampaign(id: string): Promise<void> {
  await api.delete(`/campaigns/${id}`);
}
