import { create } from "zustand";

export type PopupTab = "cover-letter" | "cv" | "job-description" | "setting";
export type JobDescriptionStateStatus = "idle" | "loading" | "ready" | "error";

type PopupState = {
  activeTab: PopupTab;
  jobDescription: string;
  jobDescriptionStatus: JobDescriptionStateStatus;
  jobDescriptionError: string;
  jobPageTitle: string;
  jobPageUrl: string;
  setActiveTab: (tab: PopupTab) => void;
  setJobDescriptionLoading: () => void;
  setJobDescriptionReady: (payload: {
    jobDescription: string;
    pageTitle: string;
    pageUrl: string;
  }) => void;
  setJobDescriptionError: (errorMessage: string) => void;
  resetJobDescription: () => void;
};

export const usePopupStore = create<PopupState>((set) => ({
  activeTab: "job-description",
  jobDescription: "",
  jobDescriptionStatus: "idle",
  jobDescriptionError: "",
  jobPageTitle: "",
  jobPageUrl: "",
  setActiveTab: (tab) => set({ activeTab: tab }),
  setJobDescriptionLoading: () =>
    set({
      jobDescription: "",
      jobDescriptionStatus: "loading",
      jobDescriptionError: "",
      jobPageTitle: "",
      jobPageUrl: "",
    }),
  setJobDescriptionReady: ({ jobDescription, pageTitle, pageUrl }) =>
    set({
      jobDescription,
      jobDescriptionStatus: "ready",
      jobDescriptionError: "",
      jobPageTitle: pageTitle,
      jobPageUrl: pageUrl,
    }),
  setJobDescriptionError: (errorMessage) =>
    set({
      jobDescription: "",
      jobDescriptionStatus: "error",
      jobDescriptionError: errorMessage,
      jobPageTitle: "",
      jobPageUrl: "",
    }),
  resetJobDescription: () =>
    set({
      jobDescription: "",
      jobDescriptionStatus: "idle",
      jobDescriptionError: "",
      jobPageTitle: "",
      jobPageUrl: "",
    }),
}));
