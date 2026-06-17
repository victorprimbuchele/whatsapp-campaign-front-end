import { CampaignStatusMeta } from "./campaign-status-meta";

export type Campaign = {
  id: string;
  name: string;
  status: CampaignStatusMeta;
  userId: string;
  templateId: string;
  variables: Record<string, string>;
  phoneNumbers: string[];
  scheduleAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  percentSent: number;
  percentDelivered: number;
  percentRead: number;
};
