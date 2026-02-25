import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge, 
  Handle, 
  Position,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  Panel,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import { Plus, Target, Zap, Brain, Activity, Code, User } from 'lucide-react';
import SkillSearchModal from './SkillSearchModal';

const CustomNode = ({ data, selected, id }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(data.value);
  const { setNodes } = useReactFlow();
  const inputRef = useRef<HTMLInputElement>(null);

  const onDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsEditing(false);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, value },
          };
        }
        return node;
      })
    );
  }, [id, value, setNodes]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onBlur();
    }
  }, [onBlur]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div 
      onDoubleClick={onDoubleClick}
      className={`px-4 py-3 rounded-2xl shadow-sm border transition-all duration-200 min-w-[140px] ${
        selected ? 'border-black ring-2 ring-black/5 bg-white' : 'border-black/10 bg-white/80 backdrop-blur-sm'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-black !w-2 !h-2" />
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{data.label}</span>
        {isEditing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className="text-xs font-bold text-black bg-transparent border-none outline-none p-0 w-full"
          />
        ) : (
          <span className="text-xs font-bold text-black">{data.value}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-black !w-2 !h-2" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: 'core',
    type: 'custom',
    position: { x: 400, y: 100 },
    data: { label: 'Agent Core', value: 'IAAI' },
  },
  {
    id: 'goal-1',
    type: 'custom',
    position: { x: 200, y: 250 },
    data: { label: 'Primary Goal', value: 'Career Growth' },
  },
  {
    id: 'attitude-1',
    type: 'custom',
    position: { x: 400, y: 250 },
    data: { label: 'Agent Attitude', value: 'Professional' },
  },
  {
    id: 'strategy-1',
    type: 'custom',
    position: { x: 600, y: 250 },
    data: { label: 'Search Strategy', value: 'Tailored Only' },
  },
  {
    id: 'action-1',
    type: 'custom',
    position: { x: 400, y: 400 },
    data: { label: 'Active State', value: 'Monitoring Jobs' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'core', target: 'goal-1', animated: true },
  { id: 'e1-3', source: 'core', target: 'attitude-1', animated: true },
  { id: 'e1-4', source: 'core', target: 'strategy-1', animated: true },
  { id: 'e3-5', source: 'attitude-1', target: 'action-1', animated: true },
];

const ContextMenu = ({ x, y, onClose, onAddNode }: any) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as any)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const options = [
    { label: 'Agent Name', value: 'IAAI', icon: <User size={14} />, isCore: true },
    { label: 'Skills', value: 'skills.sh', icon: <Code size={14} /> },
    { label: 'Goal', value: 'New Goal', icon: <Target size={14} /> },
    { label: 'Attitude', value: 'Friendly', icon: <Brain size={14} /> },
    { label: 'Strategy', value: 'Aggressive', icon: <Zap size={14} /> },
    { label: 'Action', value: 'Auto-Drafting', icon: <Activity size={14} /> },
  ];

  return (
    <div 
      ref={menuRef}
      className="fixed z-[100] bg-white border border-black/5 shadow-xl rounded-2xl p-2 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
      style={{ top: y, left: x }}
    >
      <div className="px-3 py-2 border-bottom border-black/5 mb-1">
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Agent Config</span>
      </div>
      {options.map((opt) => (
        <button
          key={opt.label}
          onClick={() => onAddNode(opt.label, opt.value, opt.isCore)}
          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors text-left group"
        >
          <div className="text-gray-400 group-hover:text-black transition-colors">
            {opt.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-gray-400 uppercase leading-none mb-0.5">{opt.label}</span>
            <span className="text-xs font-bold text-black">{opt.value}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

const FlowContent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [menu, setMenu] = useState<{ x: number, y: number } | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [pendingSkillPosition, setPendingSkillPosition] = useState<{ x: number, y: number } | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setMenu({ x: event.clientX, y: event.clientY });
    },
    []
  );

  const onAddNode = useCallback(
    (label: string, value: string, isCore?: boolean) => {
      if (!menu) return;

      if (label === 'Skills') {
        setPendingSkillPosition({ x: menu.x, y: menu.y });
        setIsSkillModalOpen(true);
        setMenu(null);
        return;
      }

      if (isCore) {
        // Update existing core node if it exists
        setNodes((nds) => {
          const coreNode = nds.find(n => n.id === 'core');
          if (coreNode) {
            return nds.map(n => n.id === 'core' ? { ...n, data: { ...n.data, value } } : n);
          }
          // If core node was deleted, recreate it at click position
          const position = screenToFlowPosition({ x: menu.x, y: menu.y });
          return nds.concat({
            id: 'core',
            type: 'custom',
            position,
            data: { label: 'Agent Core', value },
          });
        });
        setMenu(null);
        return;
      }

      const position = screenToFlowPosition({
        x: menu.x,
        y: menu.y,
      });

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'custom',
        position,
        data: { label, value },
      };

      setNodes((nds) => nds.concat(newNode));
      setMenu(null);
    },
    [menu, screenToFlowPosition, setNodes]
  );

  const handleSelectSkill = (skillName: string) => {
    if (!pendingSkillPosition) return;

    const position = screenToFlowPosition(pendingSkillPosition);
    const newNode: Node = {
      id: `skill-${Date.now()}`,
      type: 'custom',
      position,
      data: { label: 'Skill', value: skillName },
    };

    setNodes((nds) => nds.concat(newNode));
    setPendingSkillPosition(null);
  };

  return (
    <div className="w-full h-full bg-[#F2F2F2]" onContextMenu={onPaneContextMenu}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        onPaneClick={() => setMenu(null)}
      >
        <Background color="#000" gap={20} size={1} opacity={0.05} />
        <Controls showInteractive={false} className="!bg-white !border-black/5 !shadow-sm !rounded-xl overflow-hidden" />
        <Panel position="top-left" className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-black/5 shadow-sm m-4">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-1">Agent Configuration</h3>
          <p className="text-[10px] text-gray-500 font-mono">Right-click to add nodes • Connect to define behavior</p>
        </Panel>
      </ReactFlow>
      {menu && (
        <ContextMenu 
          x={menu.x} 
          y={menu.y} 
          onClose={() => setMenu(null)} 
          onAddNode={onAddNode} 
        />
      )}
      <SkillSearchModal 
        isOpen={isSkillModalOpen} 
        onClose={() => setIsSkillModalOpen(false)} 
        onSelectSkill={handleSelectSkill}
      />
    </div>
  );
};

const AgentFlow = () => {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
};

export default AgentFlow;
