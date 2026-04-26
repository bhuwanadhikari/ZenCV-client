import type { AuthUser } from "@/lib/auth-storage";

export const AUTH_MESSAGE_TYPE_SIGN_IN_WITH_GOOGLE = "AUTH_SIGN_IN_WITH_GOOGLE";

export type AuthSignInWithGoogleRequest = {
  type: typeof AUTH_MESSAGE_TYPE_SIGN_IN_WITH_GOOGLE;
};

export type AuthSignInWithGoogleResponse =
  | {
      ok: true;
      data: {
        token: string;
        user: AuthUser;
      };
    }
  | {
      ok: false;
      error: string;
    };
