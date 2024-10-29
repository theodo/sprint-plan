"use client";

import { useState } from "react";

import { ApplicableFilters } from "@components/notion/filters/ApplicableFilters";
import { AppliedFilters } from "@components/notion/filters/AppliedFilters";

import { NotionProperty } from "./types";

type Filter = {
  property: string;
  values: string[];
};

export const DatabaseFilter: React.FC<{
  properties: NotionProperty[];
}> = ({ properties }) => {
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);

  const applyFilter = (property: string, values: string[]) => {
    if (appliedFilters.some((_af) => _af.property === property)) {
      setAppliedFilters(
        appliedFilters.map((filter) =>
          filter.property === property ? { property, values } : filter,
        ),
      );

      return;
    }
    setAppliedFilters([...appliedFilters, { property, values }]);
  };

  const removeFilter = (property: string) => {
    setAppliedFilters(
      appliedFilters.filter((filter) => filter.property !== property),
    );
  };

  const applicableFilters = properties.map((property) => ({
    property: property.name,
    type: property.type,
    possibleValues: property.possibleValues,
  }));

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <AppliedFilters
        appliedFilters={appliedFilters}
        removeFilter={removeFilter}
      />
      <ApplicableFilters
        applicableFilters={applicableFilters}
        appliedFilters={appliedFilters}
        updateAppliedFilters={applyFilter}
      />
    </div>
  );
};
