import { Client } from "@notionhq/client";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { NextRequest, NextResponse } from "next/server";

import { Filter } from "@/app/notion/list/types";
import { getClient } from "@/lib/notion/client";

import { buildFilter } from "./utils/filter";
import { parseDatabaseQuery } from "./utils/processing";

type TicketsRequestBody = {
  databaseId: string;
  appliedFilters: Filter[];
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const notionClient = await getClient();

  if (notionClient === null) {
    return NextResponse.json(
      { error: "Notion token not found" },
      { status: 401 },
    );
  }

  const { databaseId, appliedFilters } =
    (await req.json()) as TicketsRequestBody;

  const filter = buildFilter(appliedFilters);

  const queryResult = await queryDatabase(notionClient, databaseId, filter);

  const tickets = await parseDatabaseQuery(databaseId, queryResult);

  return NextResponse.json(tickets);
};

const queryDatabase = async (
  notionClient: Client,
  databaseId: string,
  filter: QueryDatabaseParameters["filter"] | null,
) => {
  if (filter === null)
    return await notionClient.databases.query({
      database_id: databaseId,
    });

  return await notionClient.databases.query({
    database_id: databaseId,
    filter,
  });
};
