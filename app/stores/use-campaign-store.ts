import { CURRENT_USER_ID } from "@/constants/auth";
import { create } from "zustand";
import { Campaign } from "../types/campaign";

type CampaignStore = {
  campaign: Campaign | null;
  setCampaign: (campaign: Campaign) => void;
  getCampaign: () => Campaign | null;
};

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaign: null,
  setCampaign: (campaign: Campaign) => set({ campaign }),
  getCampaign: () => get().campaign,
}));
