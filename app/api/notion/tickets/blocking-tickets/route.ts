import { isFullPage } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";

import { NOTION_BLOCKING_RELATION_PROPERTY_NAME } from "@/app/constants";
import { getClient } from "@/lib/notion/client";

type TicketsRequestBody = {
  ticketId: string;
  blockingTicketId: string;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  return processRequest(req, "POST");
};

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
  return processRequest(req, "DELETE");
};

const processRequest = async (
  req: NextRequest,
  action: "POST" | "DELETE",
): Promise<NextResponse> => {
  const notionClient = await getClient();

  if (notionClient === null) {
    return NextResponse.json(
      { error: "Notion token not found" },
      { status: 401 },
    );
  }

  const { ticketId, blockingTicketId } =
    (await req.json()) as TicketsRequestBody;

  const ticket = await notionClient.pages.retrieve({
    page_id: ticketId,
  });

  if (!isFullPage(ticket)) {
    return NextResponse.json(
      { success: false, error: "Ticket not found" },
      { status: 404 },
    );
  }

  const blockingTickets =
    (
      ticket.properties[NOTION_BLOCKING_RELATION_PROPERTY_NAME] as {
        type: "relation";
        relation?: { id: string }[];
      }
    ).relation ?? [];

  switch (action) {
    case "POST":
      await notionClient.pages.update({
        page_id: ticketId,
        properties: {
          [NOTION_BLOCKING_RELATION_PROPERTY_NAME]: {
            relation: [
              ...blockingTickets,
              {
                id: blockingTicketId,
              },
            ],
          },
        },
      });
      break;
    case "DELETE":
      await notionClient.pages.update({
        page_id: ticketId,
        properties: {
          [NOTION_BLOCKING_RELATION_PROPERTY_NAME]: {
            relation: [
              ...blockingTickets.filter(
                (_ticket) => _ticket.id !== blockingTicketId,
              ),
            ],
          },
        },
      });
      break;
  }

  return NextResponse.json({ success: true });
};
