"use client";

import { useEffect, useState } from "react";

import { DependencyGraph, Ticket } from "@components/blocks/DependencyGraph";

import { Filter } from "./types";

type TicketsDependecyGraphProps = {
  databaseId: string | null;
  appliedFilters: Filter[];
};

export const TicketsDependecyGraph: React.FC<TicketsDependecyGraphProps> = ({
  databaseId,
  appliedFilters,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (databaseId === null || appliedFilters.length === 0) {
      setTickets([]);

      return;
    }
    const fetchTickets = async () => {
      const _tickets = (await fetch("/api/notion/tickets", {
        method: "POST",
        body: JSON.stringify({ databaseId, appliedFilters }),
      }).then((res) => res.json())) as Ticket[];

      setTickets(_tickets);
    };

    void fetchTickets();
  }, [databaseId, appliedFilters]);

  return (
    <div className="container mx-auto">
      <div className="bg-white border rounded-lg shadow-sm h-[calc(100vh-12rem)] flex items-center justify-center text-gray-500">
        <DependencyGraph tickets={tickets} />
      </div>
    </div>
  );
};
