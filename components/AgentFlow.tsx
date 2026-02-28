import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Node, 
  Edge, 
  Handle, 
  Position,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  Panel,
  useReactFlow
} from 'reactflow';
import { 
  Plus, 
  Pin as TargetIcon, 
  Flash as ZapIcon, 
  Brain as BrainIcon, 
  StatsUpSquare as ActivityIcon, 
  Code as CodeIcon, 
  User as UserIcon 
} from 'iconoir-react';
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
      className={`
        bg-bg-node border rounded-2xl w-[260px] shadow-[0_4px_20px_rgba(0,0,0,0.6)] 
        flex flex-col transition-all duration-200 cursor-grab
        ${selected ? 'border-[#666] shadow-[0_0_0_1px_#666,0_8px_30px_rgba(0,0,0,0.8)] z-[100]' : 'border-border-strong hover:border-[#444]'}
      `}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-[10px] !h-[10px] !bg-bg-panel !border-2 !border-text-tertiary !rounded-full !left-[-6px] hover:!bg-text-primary hover:!border-text-primary transition-all" 
      />
      
      <div className="px-4 py-3.5 border-b border-border-subtle flex items-center justify-between">
        <span className="font-medium text-sm text-text-primary tracking-tight">{data.label}</span>
        <span className="text-[9px] text-text-secondary uppercase tracking-[0.1em] bg-bg-input px-1.5 py-0.5 rounded border border-border-subtle">
          {data.type || 'Node'}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-text-secondary">Value</span>
          {isEditing ? (
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              className="text-text-primary bg-transparent border-none outline-none p-0 text-right w-1/2"
            />
          ) : (
            <span className="text-text-primary opacity-90">{data.value}</span>
          )}
        </div>
        
        {data.params && Object.entries(data.params).map(([key, val]: any) => (
          <div key={key} className="flex justify-between items-center text-xs">
            <span className="text-text-secondary capitalize">{key}</span>
            <span className="text-text-primary opacity-90">{val}</span>
          </div>
        ))}

        {data.tags && (
          <div className="mt-2 flex gap-2">
            {data.tags.map((tag: string) => (
              <span key={tag} className="inline-block px-2 py-1 rounded border border-border-subtle text-[10px] text-text-secondary uppercase tracking-wider bg-bg-input">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-[10px] !h-[10px] !bg-bg-panel !border-2 !border-text-tertiary !rounded-full !right-[-6px] hover:!bg-text-primary hover:!border-text-primary transition-all" 
      />
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
    position: { x: 100, y: 100 },
    data: { 
      label: 'Agent Core', 
      value: 'IAAI', 
      type: 'LLM',
      params: { model: 'Gemini 1.5 Flash', temp: '0.2' },
      tags: ['Analyze Sentiment']
    },
  },
  {
    id: 'goal-1',
    type: 'custom',
    position: { x: 450, y: 50 },
    data: { 
      label: 'Primary Goal', 
      value: 'Career Growth', 
      type: 'Trigger',
      params: { confidence: '0.95' },
      tags: ['Inbox']
    },
  },
  {
    id: 'action-1',
    type: 'custom',
    position: { x: 450, y: 250 },
    data: { 
      label: 'Active State', 
      value: 'Monitoring Jobs', 
      type: 'Action',
      params: { system: 'LinkedIn', status: 'Pending' }
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'core', target: 'goal-1', animated: true },
  { id: 'e1-3', source: 'core', target: 'action-1', animated: true },
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
    { label: 'Agent Name', value: 'IAAI', icon: <UserIcon className="w-3.5 h-3.5" />, isCore: true, type: 'LLM' },
    { label: 'Skills', value: 'skills.sh', icon: <CodeIcon className="w-3.5 h-3.5" />, type: 'Action' },
    { label: 'Goal', value: 'New Goal', icon: <TargetIcon className="w-3.5 h-3.5" />, type: 'Trigger' },
    { label: 'Attitude', value: 'Friendly', icon: <BrainIcon className="w-3.5 h-3.5" />, type: 'LLM' },
    { label: 'Strategy', value: 'Aggressive', icon: <ZapIcon className="w-3.5 h-3.5" />, type: 'LLM' },
    { label: 'Action', value: 'Auto-Drafting', icon: <ActivityIcon className="w-3.5 h-3.5" />, type: 'Action' },
  ];

  return (
    <div 
      ref={menuRef}
      className="fixed z-[100] bg-bg-panel border border-border-strong shadow-[0_8px_30px_rgba(0,0,0,0.8)] rounded-2xl p-2 min-w-[180px] animate-in fade-in zoom-in-95 duration-100"
      style={{ top: y, left: x }}
    >
      <div className="px-3 py-2 border-b border-border-subtle mb-1">
        <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Agent Config</span>
      </div>
      {options.map((opt) => (
        <button
          key={opt.label}
          onClick={() => onAddNode(opt.label, opt.value, opt.isCore)}
          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-bg-input rounded-xl transition-colors text-left group"
        >
          <div className="text-text-tertiary group-hover:text-text-primary transition-colors">
            {opt.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-text-tertiary uppercase leading-none mb-1">{opt.label}</span>
            <span className="text-xs font-bold text-text-primary">{opt.value}</span>
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
    <div className="w-full h-full bg-bg-canvas" onContextMenu={onPaneContextMenu}>
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
        <Background 
          color="#FFF" 
          gap={24} 
          size={1} 
          opacity={0.07} 
          variant={undefined as any} // Using radial-gradient via CSS in index.css is better, but this works for dots
        />
        <Panel position="top-left" className="bg-bg-panel/80 backdrop-blur-md p-4 rounded-2xl border border-border-subtle shadow-sm m-4">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-1 text-text-primary">Agent Configuration</h3>
          <p className="text-[10px] text-text-tertiary font-mono">Right-click to add nodes • Connect to define behavior</p>
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
    <FlowContent />
  );
};

export default AgentFlow;
