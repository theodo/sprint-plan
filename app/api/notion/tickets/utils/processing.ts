import { isFullPage } from "@notionhq/client";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { NOTION_BLOCKING_RELATION_PROPERTY_NAME } from "@/app/constants";
import { getClient } from "@/lib/notion/client";
import { Ticket } from "@components/blocks/DependencyGraph";

export const parseDatabaseQuery = async (
  databaseId: string,
  queryResonse: QueryDatabaseResponse,
): Promise<Ticket[]> => {
  if (!(await hasBlockingTicketsProperty(databaseId))) {
    await createBlockingTicketsProperty(databaseId);
  }

  const tickets = queryResonse.results.filter(isFullPage).map((page) => {
    return {
      id: page.id,
      title: getTitle(page.properties),
      blockedBy: [],
    };
  });

  return queryResonse.results.filter(isFullPage).map((page, index) => {
    const blockingTickets = getBlockingTickets(page.properties);

    return {
      ...tickets[index],
      blockedBy: blockingTickets
        .map((id) => {
          const blockingTicket = tickets.find((ticket) => ticket.id === id);

          if (blockingTicket !== undefined) {
            return {
              ...blockingTicket,
              blockedBy: [], // Avoid circular dependencies
            };
          }

          return undefined;
        })
        .filter((ticket) => ticket !== undefined),
    };
  });
};

const getTitle = (properties: PageObjectResponse["properties"]): string => {
  const taskTitle = Object.entries(properties)
    .filter(([, value]) => value.type === "title")
    .at(0)
    ?.at(1);

  if (taskTitle === undefined) {
    return "";
  }

  return (taskTitle as { title: { plain_text: string }[] }).title[0].plain_text;
};

const getBlockingTickets = (
  properties: PageObjectResponse["properties"],
): string[] => {
  const blockingTickets = Object.entries(properties)
    .filter(
      ([key, value]) =>
        key === NOTION_BLOCKING_RELATION_PROPERTY_NAME &&
        value.type === "relation",
    )
    .at(0)
    ?.at(1);

  if (blockingTickets === undefined) {
    console.warn("Blocking tickets property not found !");

    return [];
  }

  return (blockingTickets as { relation: { id: string }[] }).relation.map(
    (relation) => relation.id,
  );
};

const hasBlockingTicketsProperty = async (
  databaseId: string,
): Promise<boolean> => {
  const notionClient = await getClient();
  const database = await notionClient?.databases.retrieve({
    database_id: databaseId,
  });

  return Object.keys(database?.properties ?? {}).includes(
    NOTION_BLOCKING_RELATION_PROPERTY_NAME,
  );
};

const createBlockingTicketsProperty = async (databaseId: string) => {
  const notionClient = await getClient();
  await notionClient?.databases.update({
    database_id: databaseId,
    properties: {
      [NOTION_BLOCKING_RELATION_PROPERTY_NAME]: {
        type: "relation",
        relation: {
          database_id: databaseId,
          type: "single_property",
          single_property: {},
        },
      },
    },
  });
};
