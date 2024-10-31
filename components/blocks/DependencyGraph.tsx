"use client";
import {
  addEdge,
  Controls,
  Edge,
  Node,
  OnConnect,
  OnEdgesDelete,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";
import "@xyflow/react/dist/style.css";

import { Button } from "@components/ui/button";

import { addBlockingTicket, removeBlockingTicket } from "./services";
import { getLayoutedElements } from "./utils";

export type Ticket = {
  id: string;
  title: string;
  blockedBy: Ticket[];
};

const LayoutFlow: React.FC<{
  initialNodes: Node[];
  initialEdges: Edge[];
}> = ({ initialNodes, initialEdges }) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const autoLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges);
    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(async () => {
      await fitView();
    });
  }, [nodes, edges, setNodes, setEdges, fitView]);

  const onConnect = useCallback<OnConnect>(
    async (params) => {
      setEdges((_edges) => addEdge(params, _edges));
      await addBlockingTicket(params.target, params.source);
    },
    [setEdges],
  );

  const onEdgesDelete = useCallback<OnEdgesDelete>((params) => {
    params.forEach(async (edge) => {
      await removeBlockingTicket(edge.target, edge.source);
    });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgesDelete={onEdgesDelete}
      fitView
    >
      <Panel position="top-right" className="flex gap-2">
        <Button onClick={autoLayout}>Auto layout</Button>
      </Panel>
      <Controls />
    </ReactFlow>
  );
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

  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <LayoutFlow initialNodes={initialNodes} initialEdges={initialEdges} />
      </ReactFlowProvider>
    </div>
  );
};
