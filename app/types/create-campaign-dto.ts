export type SendType = "now" | "scheduled" | "draft";

export type CreateCampaignDto = {
  name: string;
  contactIds: string[];
  templateId: string;
  statusId?: string;
  scheduleAt?: string;
  idempotencyKey: string;
};
