import { NextRequest, NextResponse } from "next/server";

import { NOTION_TOKEN_COOKIE_NAME } from "@/app/constants";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { code } = (await req.json()) as { code: string };

  const encodedCredentials = Buffer.from(
    `${process.env.NOTION_OAUTH_CLIENT_ID}:${process.env.NOTION_OAUTH_CLIENT_SECRET}`,
  ).toString("base64");

  const { access_token } = (await fetch(
    process.env.NOTION_API_TOKEN_URL ?? "",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic "${encodedCredentials}"`,
      },
      body: JSON.stringify({
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NOTION_REDIRECT_URI}`,
      }),
    },
  ).then((res) => res.json())) as { access_token: string };

  return NextResponse.json(
    {},
    {
      headers: {
        "Set-Cookie": `${NOTION_TOKEN_COOKIE_NAME}=${access_token}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=2592000`,
      },
    },
  );
};
