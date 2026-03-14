import { create } from "zustand";

export type PopupTab = "cover-letter" | "cv" | "setting";

type PopupState = {
  activeTab: PopupTab;
  setActiveTab: (tab: PopupTab) => void;
};

export const usePopupStore = create<PopupState>((set) => ({
  activeTab: "cover-letter",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
