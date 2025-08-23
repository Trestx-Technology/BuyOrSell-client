"use client";

import { cn } from "@/lib/utils";
import {
  CredentialResponse,
  GoogleLogin,
  useGoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import { ReactNode, useState } from "react";

/* ------------------------------------------------------------------ */
/* ----------------------  Types & Interfaces  ----------------------*/
/* ------------------------------------------------------------------ */

/** What Google actually puts in the ID-token payload */
interface GoogleIdTokenPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture?: string;
  iat: number;
  exp: number;
  locale?: string;
  hd?: string; // hosted domain
}

/** Processed user data returned to parent component */
export interface GoogleUserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  picture?: string;
  emailVerified: boolean;
  locale?: string;
  hostedDomain?: string;
  rawToken: string;
}

/** Render prop function parameters */
interface RenderPropParams {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

/** Component props */
interface GoogleLoginButtonProps {
  // Callback props
  onSuccess: (userData: GoogleUserData) => void | Promise<void>;
  onError?: (error: string) => void;

  // Render prop for custom button
  render?: (params: RenderPropParams) => ReactNode;

  // Google Login button customization (only applies when render prop is not used)
  width?: number;
  size?: "large" | "medium" | "small";
  shape?: "rectangular" | "pill" | "circle" | "square";
  theme?: "outline" | "filled_blue" | "filled_black";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  logo_alignment?: "left" | "center";

  // One-tap configuration
  enableOneTap?: boolean;
  oneTapAutoSelect?: boolean;
  oneTapCancelOnTapOutside?: boolean;

  // Additional props
  className?: string;
  disabled?: boolean;
}

/* ------------------------------------------------------------------ */
/* -------------------------  Component  -----------------------------*/
/* ------------------------------------------------------------------ */

export function GoogleLoginButton({
  onSuccess,
  onError,
  render,
  width = 200,
  size = "large",
  shape = "rectangular",
  theme = "outline",
  text = "continue_with",
  logo_alignment = "left",
  enableOneTap = true,
  oneTapAutoSelect = true,
  oneTapCancelOnTapOutside = true,
  className,
  disabled = false,
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  /* -------------  JWT decode helper (returns strongly typed) ------------- */
  const decodeJWT = (token: string): GoogleIdTokenPayload | null => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT structure");
      }

      const payload = parts[1];
      const paddedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = atob(paddedPayload);

      return JSON.parse(decodeURIComponent(escape(jsonPayload)));
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  /* ------------------  Process Google credential  ------------------ */
  const processGoogleCredential = (
    decoded: GoogleIdTokenPayload,
    rawToken: string
  ): GoogleUserData => {
    return {
      id: decoded.sub,
      email: decoded.email,
      firstName: decoded.given_name || "",
      lastName: decoded.family_name || "",
      fullName:
        decoded.name || `${decoded.given_name} ${decoded.family_name}`.trim(),
      picture: decoded.picture,
      emailVerified: decoded.email_verified,
      locale: decoded.locale,
      hostedDomain: decoded.hd,
      rawToken,
    };
  };

  /* ------------------  Shared handler for One-Tap & button  ------------------ */
  const handleCredentialResponse = async (
    res: CredentialResponse
  ): Promise<void> => {
    try {
      setIsLoading(true);

      if (!res.credential) {
        throw new Error("No credential received from Google");
      }

      const decoded = decodeJWT(res.credential);
      if (!decoded) {
        throw new Error("Failed to decode Google credential");
      }

      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        throw new Error("Google credential has expired");
      }

      const userData = processGoogleCredential(decoded, res.credential);
      await onSuccess(userData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Google Login Error:", errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------  Custom button login handler  ------------------ */
  const customLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);

        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
        );
        const userInfo = await userInfoResponse.json();

        if (!userInfoResponse.ok) {
          throw new Error("Failed to fetch user information");
        }

        const userData: GoogleUserData = {
          id: userInfo.id,
          email: userInfo.email,
          firstName: userInfo.given_name || "",
          lastName: userInfo.family_name || "",
          fullName:
            userInfo.name ||
            `${userInfo.given_name} ${userInfo.family_name}`.trim(),
          picture: userInfo.picture,
          emailVerified: userInfo.verified_email || false,
          locale: userInfo.locale,
          hostedDomain: userInfo.hd,
          rawToken: tokenResponse.access_token,
        };

        await onSuccess(userData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Custom login failed";
        console.error("Custom Google Login Error:", errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setIsLoading(false);
      const errorMsg = "Custom Google Login failed";
      onError?.(errorMsg);
    },
  });

  /* ------------------------  One-Tap hook  ------------------------ */
  useGoogleOneTapLogin({
    onSuccess: handleCredentialResponse,
    onError: () => {
      const errorMsg = "Google One-Tap authentication failed";
      onError?.(errorMsg);
    },
    auto_select: enableOneTap ? oneTapAutoSelect : false,
    cancel_on_tap_outside: enableOneTap ? oneTapCancelOnTapOutside : false,
    disabled: !enableOneTap || disabled,
  });

  /* ---------------------  Error handler for default button  --------------------- */
  const handleButtonError = () => {
    const errorMsg = "Google Login button authentication failed";
    onError?.(errorMsg);
  };

  /* ---------------------  Custom button click handler  --------------------- */
  const handleCustomButtonClick = () => {
    if (!disabled && !isLoading) {
      customLogin();
    }
  };

  /* ---------------------  Render custom button using render prop  --------------------- */
  if (render) {
    return (
      <div className={cn(className, "w-full")}>
        {render({
          onClick: handleCustomButtonClick,
          disabled: disabled || isLoading,
          isLoading,
        })}
      </div>
    );
  }

  /* ---------------------  Render default Google button  --------------------- */
  return (
    <div className={className}>
      <GoogleLogin
        width={Math.min(width, 400)}
        size={size}
        shape={shape}
        theme={theme}
        text={text}
        logo_alignment={logo_alignment}
        context="signin"
        ux_mode="popup"
        use_fedcm_for_button
        onSuccess={handleCredentialResponse}
        onError={handleButtonError}
      />
    </div>
  );
}
