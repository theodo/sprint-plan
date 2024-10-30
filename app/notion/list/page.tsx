import { isFullDatabase } from "@notionhq/client";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NextPage } from "next";

import { getClient } from "@/lib/notion/client";

import { PageContent } from "./PageContent";

const ListDatabases: NextPage = async () => {
  const notionClient = await getClient();

  if (notionClient === null) {
    return <div>Notion token not found</div>;
  }
  const databases = await notionClient
    .search({
      query: "",
      filter: {
        property: "object",
        value: "database",
      },
    })
    .then((response) => response.results.filter(isFullDatabase))
    .then((_databases) =>
      _databases.map((_database) => ({
        id: _database.id,
        name: _database.title[0].plain_text,
        properties: processProperties(_database.properties),
      })),
    );

  return <PageContent databases={databases} />;
};

const onlySelectOrMultiSelect = (
  property: DatabaseObjectResponse["properties"][string],
) => {
  return ["select", "multi_select"].includes(property.type);
};

const getOptions = (property: DatabaseObjectResponse["properties"][string]) => {
  switch (property.type) {
    case "select":
      return property.select.options.map((option) => option.name);
    case "multi_select":
      return property.multi_select.options.map((option) => option.name);
    default:
      return [];
  }
};

const processProperties = (
  properties: DatabaseObjectResponse["properties"],
) => {
  return Object.entries(properties)
    .filter(([, value]) => onlySelectOrMultiSelect(value))
    .map(([key, value]) => {
      return {
        name: key,
        type: value.type as "select" | "multi_select",
        possibleValues: getOptions(value),
      };
    });
};

export default ListDatabases;
