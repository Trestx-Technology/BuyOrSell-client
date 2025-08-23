"use server";

import { cookies } from "next/headers";

const TOKEN_NAME = "dealdome_access_token";

export const setCookies = async (token: string) => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get(TOKEN_NAME);
  if (!accessToken) {
    cookiesStore.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: Number(process.env.COOKIE_MAX_AGE!),
      path: "/",
    });
  }
};

export const removeCookies = async () => {
  const cookiesStore = await cookies();
  cookiesStore.delete(TOKEN_NAME);
};
