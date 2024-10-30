"use client";
import { useEffect, useState } from "react";

import { DatabaseFilter } from "./DatabaseFilter";
import { DatabaseSelect } from "./DatabaseSelect";
import { TicketsDependecyGraph } from "./TicketsDependencyGraph";
import { Filter, NotionDatabase, NotionProperty } from "./types";

export const PageContent: React.FC<{
  databases: NotionDatabase[];
}> = ({ databases }) => {
  const databaseOptions = databases.map((_database) => ({
    id: _database.id,
    name: _database.name,
  }));

  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | null>(
    databaseOptions[0]?.id ?? null,
  );
  const [filterOptions, setFilterOptions] = useState<NotionProperty[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);

  // Reset applied and available filters when database changes
  useEffect(() => {
    setAppliedFilters([]);
    if (selectedDatabaseId === null) {
      setFilterOptions([]);

      return;
    }

    setFilterOptions(
      databases.find((db) => db.id === selectedDatabaseId)?.properties ?? [],
    );
  }, [databases, selectedDatabaseId]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <DatabaseSelect
              options={databaseOptions}
              onSelect={(value) => setSelectedDatabaseId(value)}
            />
            <DatabaseFilter
              properties={filterOptions}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
            />
          </div>
        </div>
      </header>
      <main className="flex-grow bg-gray-100 p-4">
        <TicketsDependecyGraph
          databaseId={selectedDatabaseId}
          appliedFilters={appliedFilters}
        />
      </main>
    </div>
  );
};
