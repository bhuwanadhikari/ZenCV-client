import { create } from "zustand";

export type PopupTab = "cover-letter" | "cv" | "job-description" | "setting";

type PopupState = {
  activeTab: PopupTab;
  setActiveTab: (tab: PopupTab) => void;
};

export const usePopupStore = create<PopupState>((set) => ({
  activeTab: "job-description",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
