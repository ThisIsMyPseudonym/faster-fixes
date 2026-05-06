import { auth } from "@/server/auth";
import { getLinearOAuthRedirectUri } from "@/server/linear/linear-client";
import {
  LINEAR_OAUTH_STATE_COOKIE,
  LINEAR_OAUTH_STATE_COOKIE_MAX_AGE_S,
} from "@/server/linear/oauth-state-cookie";
import { randomBytes } from "crypto";
import { type NextRequest, NextResponse } from "next/server";

const LINEAR_OAUTH_AUTHORIZE_URL = "https://linear.app/oauth/authorize";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.BETTER_AUTH_URL ?? process.env.BASE_URL!;
  const integrationsUrl = `${baseUrl}/integrations`;

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.redirect(
      `${baseUrl}/login?nextUrl=${encodeURIComponent(`${baseUrl}/api/linear/install`)}`,
    );
  }

  const activeOrganization = await auth.api.getFullOrganization({
    headers: req.headers,
  });
  if (!activeOrganization) {
    return NextResponse.redirect(`${integrationsUrl}?error=no_active_org`);
  }

  const clientId = process.env.LINEAR_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(
      `${integrationsUrl}?error=linear_not_configured`,
    );
  }

  const state = randomBytes(32).toString("hex");
  const redirectUri = getLinearOAuthRedirectUri();

  const authorizeUrl = new URL(LINEAR_OAUTH_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "read,write");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("actor", "app");

  const response = NextResponse.redirect(authorizeUrl.toString());
  response.cookies.set(LINEAR_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: LINEAR_OAUTH_STATE_COOKIE_MAX_AGE_S,
  });
  return response;
}
