import { X } from "lucide-react";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";

type AppliedFilter = {
  property: string;
  values: string[];
};

export const AppliedFilters: React.FC<{
  appliedFilters: AppliedFilter[];
  removeFilter: (property: string) => void;
}> = ({ appliedFilters, removeFilter }) => {
  return (
    <>
      {appliedFilters.map((filter) => (
        <Badge key={filter.property} variant="secondary" className="text-sm">
          {filter.property}: {filter.values.join(", ")}
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 h-4 w-4 p-0"
            onClick={() => removeFilter(filter.property)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </>
  );
};
