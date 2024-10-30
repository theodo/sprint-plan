import { isFullPage } from "@notionhq/client";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { Ticket } from "@components/blocks/DependencyGraph";

export const parseDatabaseQuery = (
  queryResonse: QueryDatabaseResponse,
): Ticket[] => {
  return queryResonse.results.filter(isFullPage).map((page) => {
    return {
      id: page.id,
      title: getTitle(page.properties),
      blockedBy: [],
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
