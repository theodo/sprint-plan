"use client";

import {
  addEdge,
  Controls,
  OnConnect,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback } from "react";

export type Ticket = {
  id: string;
  title: string;
  blockedBy: Ticket[];
};

export const DependencyGraph: React.FC<{
  tickets: Ticket[];
}> = ({ tickets }) => {
  const initialNodes = tickets.map((ticket, index) => ({
    id: ticket.id,
    position: { x: 0, y: index * 100 },
    data: { label: ticket.title },
  }));

  const initialEdges = tickets.flatMap((targetTicket) => {
    return targetTicket.blockedBy.map((sourceTicket) => ({
      id: `e${sourceTicket.id}-${targetTicket.id}`,
      source: sourceTicket.id,
      target: targetTicket.id,
    }));
  });

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback<OnConnect>(
    (params) => {
      setEdges((_edges) => addEdge(params, _edges));
    },
    [setEdges],
  );

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
      </ReactFlow>
    </>
  );
};
