import { create } from "zustand";

type CampaignStore = {
  selectedCampaignId: string | null;
  searchTerm: string;
  setSelectedCampaignId: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
};

export const useCampaignStore = create<CampaignStore>((set) => ({
  selectedCampaignId: null,
  searchTerm: "",
  setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),
  setSearchTerm: (term) => set({ searchTerm: term }),
}));
