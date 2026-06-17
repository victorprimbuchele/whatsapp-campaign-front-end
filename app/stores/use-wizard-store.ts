import { create } from "zustand";
import { SendType } from "../types/create-campaign-dto";

export type WizardState = {
  currentStep: number;
  name: string;
  selectedContactIds: string[];
  templateId: string;
  sendType: SendType;
  scheduledAt: string;
};

type WizardStore = WizardState & {
  nextStep: () => void;
  prevStep: () => void;
  setField: <K extends keyof WizardState>(field: K, value: WizardState[K]) => void;
  reset: () => void;
};

const initialState: WizardState = {
  currentStep: 1,
  name: "",
  selectedContactIds: [],
  templateId: "",
  sendType: "now",
  scheduledAt: "",
};

export const useWizardStore = create<WizardStore>((set) => ({
  ...initialState,
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 5) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  setField: (field, value) => set({ [field]: value }),
  reset: () => set(initialState),
}));
