"use server";

import { cookies } from "next/headers";
import { AUTH_TOKEN_NAMES } from "@/constants/auth.constants";

const TOKEN_NAME = AUTH_TOKEN_NAMES.ACCESS_TOKEN;

export const setCookies = async (token: string) => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get(TOKEN_NAME);
  const maxAge = Number(process.env.COOKIE_MAX_AGE!);
  // Always update cookie to refresh expiration, not just when missing
  cookiesStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: maxAge || 86400, // Default to 24 hours if not set
    path: "/",
  });
};

export const removeCookies = async () => {
  const cookiesStore = await cookies();
  cookiesStore.delete(TOKEN_NAME);
};
