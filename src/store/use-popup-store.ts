import { create } from "zustand";
import { getCurrentUser } from "@/lib/auth";
import { getStoredAuthSessionAsync, type AuthUser } from "@/lib/auth-storage";

export type PopupTab = "cover-letter" | "cv" | "job-description" | "setting";
export type JobDescriptionStateStatus = "idle" | "loading" | "ready" | "error";
export type AuthStateStatus = "signed-out" | "signed-in" | "loading" | "error";

type PopupState = {
  activeTab: PopupTab;
  authToken: string;
  authUser: AuthUser | null;
  authStatus: AuthStateStatus;
  authError: string;
  jobDescription: string;
  jobDescriptionStatus: JobDescriptionStateStatus;
  jobDescriptionError: string;
  jobPageTitle: string;
  jobPageUrl: string;
  setActiveTab: (tab: PopupTab) => void;
  hydrateAuthSession: () => Promise<void>;
  setAuthLoading: () => void;
  setAuthReady: (payload: { token: string; user: AuthUser }) => void;
  setAuthSignedOut: () => void;
  setAuthError: (errorMessage: string) => void;
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
  activeTab: "setting",
  authToken: "",
  authUser: null,
  authStatus: "signed-out",
  authError: "",
  jobDescription: "",
  jobDescriptionStatus: "idle",
  jobDescriptionError: "",
  jobPageTitle: "",
  jobPageUrl: "",
  setActiveTab: (tab) => set({ activeTab: tab }),
  hydrateAuthSession: async () => {
    const { token, user } = await getStoredAuthSessionAsync();

    if (token && !user) {
      try {
        const refreshedUser = await getCurrentUser();

        set({
          authToken: token,
          authUser: refreshedUser,
          authStatus: "signed-in",
          authError: "",
        });
        return;
      } catch {
        set({
          authToken: "",
          authUser: null,
          authStatus: "signed-out",
          authError: "",
        });
        return;
      }
    }

    set({
      authToken: token,
      authUser: user,
      authStatus: token ? "signed-in" : "signed-out",
      authError: "",
    });
  },
  setAuthLoading: () =>
    set({
      authStatus: "loading",
      authError: "",
    }),
  setAuthReady: ({ token, user }) =>
    set({
      authToken: token,
      authUser: user,
      authStatus: "signed-in",
      authError: "",
    }),
  setAuthSignedOut: () =>
    set({
      authToken: "",
      authUser: null,
      authStatus: "signed-out",
      authError: "",
    }),
  setAuthError: (errorMessage) =>
    set({
      authToken: "",
      authUser: null,
      authStatus: "error",
      authError: errorMessage,
    }),
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
