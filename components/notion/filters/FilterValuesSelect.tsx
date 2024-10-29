"use client";
import { Check, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";

export const FilterValuesSelect: React.FC<{
  property: string;
  options: string[];
  appliedFilters: string[];
  updateAppliedFilters: (values: string[]) => void;
  children: React.ReactNode;
}> = ({ options, appliedFilters, updateAppliedFilters, children }) => {
  const [open, setOpen] = useState(false);

  const toggleValue = (item: string) => {
    if (appliedFilters.indexOf(item) === -1) {
      updateAppliedFilters([...appliedFilters, item]);

      return;
    }

    updateAppliedFilters(appliedFilters.filter((filter) => filter !== item));
  };

  const removeItem = (item: string) => {
    updateAppliedFilters(appliedFilters.filter((filter) => filter !== item));
  };

  const handleToggleDialog = (_open: boolean) => {
    setOpen(_open);
  };

  return (
    <Dialog open={open} onOpenChange={handleToggleDialog}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Items</DialogTitle>
          <DialogDescription>
            Choose multiple items from the list below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2 py-4">
          {appliedFilters.map((item) => (
            <Badge key={item} variant="secondary" className="text-sm">
              {item}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-4 w-4 p-0"
                onClick={() => removeItem(item)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search items..." />
          <CommandEmpty>No items found.</CommandEmpty>
          <CommandGroup>
            {options.map((item) => (
              <CommandItem key={item} onSelect={() => toggleValue(item)}>
                <Check
                  className={`mr-2 h-4 w-4 ${
                    appliedFilters.indexOf(item) > -1
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
        <DialogFooter>
          <Button onClick={() => handleToggleDialog(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
