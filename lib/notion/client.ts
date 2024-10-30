import { Client } from "@notionhq/client";
import { cookies } from "next/headers";

import { NOTION_TOKEN_COOKIE_NAME } from "@/app/constants";

export const getClient = async (): Promise<Client | null> => {
  const notionToken = (await cookies()).get(NOTION_TOKEN_COOKIE_NAME)?.value;
  if (notionToken === undefined) {
    return null;
  }

  return new Client({
    auth: notionToken,
  });
};
