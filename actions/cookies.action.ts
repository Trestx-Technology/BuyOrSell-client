"use server";

import { cookies } from "next/headers";
import { AUTH_TOKEN_NAMES } from "@/constants/auth.constants";

const TOKEN_NAME = AUTH_TOKEN_NAMES.ACCESS_TOKEN;

export const setCookies = async (token: string) => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get(TOKEN_NAME);
  const maxAge = Number(process.env.COOKIE_MAX_AGE!);
  // #region agent log
  // Server action - log via fetch (will be captured by logging system)
  fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cookies.action.ts:7',message:'setCookies entry',data:{hasExistingCookie:!!accessToken,maxAge,isNaN:isNaN(maxAge)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  // Always update cookie to refresh expiration, not just when missing
  cookiesStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: maxAge || 86400, // Default to 24 hours if not set
    path: "/",
  });
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cookies.action.ts:18',message:'setCookies updated',data:{maxAge:maxAge||86400},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
};

export const removeCookies = async () => {
  const cookiesStore = await cookies();
  cookiesStore.delete(TOKEN_NAME);
};
