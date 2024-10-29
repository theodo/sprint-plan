"use client";
import { useEffect, useState } from "react";

import { DatabaseFilter } from "./DatabaseFilter";
import { DatabaseSelect } from "./DatabaseSelect";
import { Filter, NotionDatabase, NotionProperty } from "./types";

export const PageContent: React.FC<{
  databases: NotionDatabase[];
}> = ({ databases }) => {
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | null>(
    null,
  );
  const [filterOptions, setFilterOptions] = useState<NotionProperty[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);

  useEffect(() => {
    if (selectedDatabaseId === null) {
      setFilterOptions([]);

      return;
    }

    setFilterOptions(
      databases.find((db) => db.id === selectedDatabaseId)?.properties ?? [],
    );
    setAppliedFilters([]);
  }, [databases, selectedDatabaseId]);

  const databaseOptions = databases.map((_database) => ({
    id: _database.id,
    name: _database.name,
  }));

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
        <div className="container mx-auto">
          <div className="bg-white border rounded-lg shadow-sm h-[calc(100vh-12rem)] flex items-center justify-center text-gray-500">
            Canvas Area (Empty for now)
          </div>
        </div>
      </main>
    </div>
  );
};
