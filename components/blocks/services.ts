export const addBlockingTicket = async (
  ticketId: string,
  blockingTicketId: string,
): Promise<void> => {
  await fetch("/api/notion/tickets/blocking-tickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ticketId, blockingTicketId }),
  });
};

export const removeBlockingTicket = async (
  ticketId: string,
  blockingTicketId: string,
): Promise<void> => {
  await fetch("/api/notion/tickets/blocking-tickets", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ticketId, blockingTicketId }),
  });
};
