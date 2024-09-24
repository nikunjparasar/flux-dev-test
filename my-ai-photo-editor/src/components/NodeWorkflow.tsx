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
  ProOptions,  // Import ProOptions for removing watermark
} from 'react-flow-renderer';
import { Plus } from 'lucide-react';

// Example statuses and colors
const statuses = {
  queued: 'bg-yellow-400',
  running: 'bg-blue-400',
  finished: 'bg-green-400',
  error: 'bg-red-400',
};

interface GlassNodeData {
  label: string;
  status: keyof typeof statuses;
}

// Initial node and edge data
const initialNodes: Node<GlassNodeData>[] = [
  { id: '1', data: { label: 'Input', status: 'queued' }, position: { x: 50, y: 50 }, type: 'glassNode' },
  { id: '2', data: { label: 'Process', status: 'running' }, position: { x: 200, y: 50 }, type: 'glassNode' },
  { id: '3', data: { label: 'Output', status: 'finished' }, position: { x: 350, y: 50 }, type: 'glassNode' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'default', animated: true },
  { id: 'e2-3', source: '2', target: '3', type: 'default', animated: true },
];

// Custom node component with longer shape and status
const GlassNode = ({ data }: { data: GlassNodeData }) => {
  return (
    <div className="w-64 p-4 bg-white bg-opacity-5 backdrop-blur-lg rounded-lg shadow-lg border border-white border-opacity-10 text-white">
      <Handle type="target" position={Position.Left} className="bg-blue-500 w-2 h-2" /> {/* Left handle */}
      <div className="flex items-center space-x-2">
        {/* Status indicator dot */}
        <span className={`w-3 h-3 rounded-full ${statuses[data.status]}`}></span>
        {/* Main label */}
        <div className="text-lg font-semibold">{data.label}</div>
      </div>
      {/* Smaller status text */}
      <div className="text-sm text-gray-300 mt-1">{data.status.charAt(0).toUpperCase() + data.status.slice(1)}</div>
      <Handle type="source" position={Position.Right} className="bg-blue-500 w-2 h-2" /> {/* Right handle */}
    </div>
  );
};

// Node types definition
const nodeTypes = {
  glassNode: GlassNode,
};


const NodeWorkflow: React.FC = () => {
  const [nodes, setNodes] = useState<Node<GlassNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // Function to add new nodes
  const addNode = () => {
    const newNode: Node<GlassNodeData> = {
      id: (nodes.length + 1).toString(),
      data: { label: 'Process', status: 'queued' },  // Ensure status matches the keyof typeof statuses
      position: { x: Math.random() * 300 + 50, y: Math.random() * 100 + 50 },
      type: 'glassNode',
    };
    setNodes((nds) => [...nds, newNode]);  // Properly set the node type
  };

  // Handlers for node and edge changes
  const onNodesChange = (changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange = (changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const onConnect = (params: Connection | Edge) => {
    setEdges((eds) => addEdge(params, eds));
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
        nodeTypes={nodeTypes}  // Use the custom node types
        defaultEdgeOptions={{ animated: true }}
      >
        {/* Dark styled MiniMap */}
        <MiniMap
          nodeColor={() => '#ffffff'} // White nodes on the minimap
          style={{
            backgroundColor: '#1a202c', // Dark background for the minimap
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
