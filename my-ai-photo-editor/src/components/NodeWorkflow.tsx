// src/components/NodeWorkflow.tsx
import React, { useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Connection,
  Handle,
  Position,
} from 'react-flow-renderer';
import { Plus } from 'lucide-react';

interface DiffusionNodeData {
  label: string;
  type: string;
  params?: any;
}

const nodeTypes = {
  diffusionNode: ({ data }: { data: DiffusionNodeData }) => (
    <div className="w-64 p-4 bg-gray-800 rounded shadow text-white">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-blue-500" />
      <div className="text-lg font-bold">{data.label}</div>
      <div className="text-sm italic">{data.type}</div>
      {/* Display parameters */}
      {data.params && (
        <div className="mt-2">
          {Object.keys(data.params).map((key) => (
            <div key={key} className="text-xs">
              {key}: {data.params[key]}
            </div>
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-500" />
    </div>
  ),
};

const initialNodes: Node<DiffusionNodeData>[] = [
  {
    id: '1',
    type: 'diffusionNode',
    data: { label: 'Input Image', type: 'Input' },
    position: { x: 50, y: 50 },
  },
];

const initialEdges: Edge[] = [];

const NodeWorkflow: React.FC = () => {
  const [nodes, setNodes] = useState<Node<DiffusionNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const addNode = () => {
    const nodeType = prompt('Enter node type (e.g., Diffusion, ControlNet, Output):');
    if (!nodeType) return;

    const newNode: Node<DiffusionNodeData> = {
      id: (nodes.length + 1).toString(),
      type: 'diffusionNode',
      data: { label: `${nodeType} Node`, type: nodeType },
      position: { x: Math.random() * 300 + 50, y: Math.random() * 100 + 50 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Handlers for node and edge changes
  const onNodesChange = (changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange = (changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const onConnect = (params: Connection | Edge) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  };

  return (
    <div className="relative w-full h-full bg-gray-900 bg-opacity-50 rounded-lg overflow-hidden">
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={addNode}
          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ animated: true }}
      >
        <MiniMap
          nodeColor={() => '#ffffff'}
          style={{
            backgroundColor: '#1a202c',
          }}
          nodeStrokeWidth={2}
        />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default NodeWorkflow;
