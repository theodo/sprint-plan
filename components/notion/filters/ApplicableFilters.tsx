"use client";
import { Plus } from "lucide-react";
import { useState } from "react";

import { SupportedTypes } from "@/app/notion/list/types";
import { Button } from "@components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";

import { FilterValuesSelect } from "./FilterValuesSelect";

type ApplicableFilter = {
  property: string;
  type: SupportedTypes;
  possibleValues: string[];
};

type AppliedFilter = {
  property: string;
  values: string[];
};

export const ApplicableFilters: React.FC<{
  applicableFilters: ApplicableFilter[];
  appliedFilters: AppliedFilter[];
  updateAppliedFilters: (property: string, values: string[]) => void;
}> = ({ applicableFilters, appliedFilters, updateAppliedFilters }) => {
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Plus className="mr-2 h-4 w-4" />
          Add filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search properties..." />
          <CommandEmpty>No property found.</CommandEmpty>
          <CommandGroup>
            {applicableFilters.map((filter) => (
              <CommandItem key={filter.property}>
                <FilterValuesSelect
                  key={filter.property}
                  property={filter.property}
                  options={filter.possibleValues}
                  appliedFilters={
                    appliedFilters.find(
                      (_af) => _af.property === filter.property,
                    )?.values ?? []
                  }
                  updateAppliedFilters={(values) =>
                    updateAppliedFilters(filter.property, values)
                  }
                >
                  {filter.property}
                </FilterValuesSelect>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
