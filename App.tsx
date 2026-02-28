
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TabType, JobApplication, Recommendation } from './types';
import AgentFlow from './components/AgentFlow';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import { 
  CursorPointer as SelectCursor, 
  Plus, 
  ShareAndroid, 
  Rocket, 
  InfoCircle, 
  StatsUpSquare 
} from 'iconoir-react';

const MOCK_HISTORY: JobApplication[] = [
  { id: '1', company: 'Linear', role: 'Product Designer', timestamp: '2h ago', status: 'SENT' as any },
  { id: '2', company: 'Vercel', role: 'Design Engineer', timestamp: '1d ago', status: 'VIEWED' as any },
  { id: '3', company: 'Stripe', role: 'UX Writer', timestamp: '3d ago', status: 'REJECTED' as any },
];

const RulerZoom: React.FC = () => {
  const { setViewport, getViewport } = useReactFlow();
  const [scrollOffset, setScrollOffset] = useState(0);
  const isDragging = useRef(false);
  const lastY = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastY.current = e.clientY;
    document.body.style.cursor = 'ns-resize';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaY = e.clientY - lastY.current;
      if (Math.abs(deltaY) < 1) return;

      const viewport = getViewport();
      const zoomFactor = 1 - deltaY * 0.005;
      
      setViewport({
        ...viewport,
        zoom: Math.min(Math.max(viewport.zoom * zoomFactor, 0.1), 4)
      }, { duration: 0 });

      setScrollOffset(prev => prev + deltaY);
      lastY.current = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [getViewport, setViewport]);

  const UNIT = 13; // 12px gap + 1px line
  const PATTERN_SIZE = UNIT * 5; // 5 lines per major tick

  return (
    <div 
      onMouseDown={handleMouseDown}
      className="flex-1 flex flex-col mt-auto mb-4 cursor-ns-resize group relative overflow-hidden w-full items-center select-none"
    >
      <div 
        className="flex flex-col gap-[12px] items-center"
        style={{ 
          transform: `translateY(${scrollOffset % PATTERN_SIZE}px)`,
          marginTop: `-${PATTERN_SIZE * 2}px` // Buffer to hide the jump
        }}
      >
        {[...Array(40)].map((_, i) => {
          const isMajor = i % 5 === 0;
          return (
            <div 
              key={i} 
              className={`h-[1px] transition-all duration-300 ${
                isMajor 
                  ? 'w-4 bg-text-secondary group-hover:bg-white group-active:bg-white' 
                  : 'w-2 bg-text-secondary/30 group-hover:bg-white/40 group-active:bg-white/60'
              }`} 
            />
          );
        })}
      </div>
      
      {/* Visual Indicator Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-bg-panel via-transparent to-bg-panel opacity-90" />
      
      {/* Center highlight line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-[2px] bg-white/20 blur-[1px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-px bg-white pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
    </div>
  );
};

const AppContent: React.FC = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [temp, setTemp] = useState(0.2);
  const { getZoom } = useReactFlow();

  return (
    <div className="h-screen w-screen flex flex-col bg-bg-canvas text-text-primary">
      {/* Header */}
      <header className="h-14 bg-bg-panel border-b border-border-subtle flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-6">
          <div className="font-serif italic text-lg tracking-tight">Spec Flow</div>
          <div className="flex gap-2 text-text-tertiary text-xs mono opacity-70">
            <span>/</span>
            <span>Agents</span>
            <span>/</span>
            <span className="text-text-secondary">InstantApply AI</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-input rounded-full transition-all">
            Share
          </button>
          <button className="px-4 py-2 text-xs bg-[#222] border border-[#333] hover:bg-[#333] hover:border-[#444] rounded-full font-medium transition-all">
            Deploy Agent
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Ruler Rail */}
        <div className="w-14 bg-bg-panel border-r border-border-subtle flex flex-col items-center py-6 gap-6 z-5 shrink-0">
          <button 
            onClick={() => setActiveTool('select')}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${activeTool === 'select' ? 'text-text-primary bg-[#1a1a1a] shadow-[0_0_0_1px_#2a2a2a]' : 'text-text-tertiary hover:text-text-primary'}`}
          >
            <SelectCursor className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTool('add')}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${activeTool === 'add' ? 'text-text-primary bg-[#1a1a1a] shadow-[0_0_0_1px_#2a2a2a]' : 'text-text-tertiary hover:text-text-primary'}`}
          >
            <Plus className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTool('connect')}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${activeTool === 'connect' ? 'text-text-primary bg-[#1a1a1a] shadow-[0_0_0_1px_#2a2a2a]' : 'text-text-tertiary hover:text-text-primary'}`}
          >
            <ShareAndroid className="w-5 h-5" />
          </button>

          <RulerZoom />
        </div>

        {/* Canvas Area */}
        <main className="flex-1 relative bg-bg-canvas overflow-hidden">
          <AgentFlow />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] text-text-tertiary tracking-[3px] uppercase pointer-events-none opacity-30 -mr-3.5">
            CANVAS
          </div>
        </main>

        {/* Properties Panel */}
        <aside className="w-80 bg-bg-panel border-l border-border-subtle flex flex-col z-5 shrink-0">
          <div className="h-16 flex items-center px-6 border-b border-border-subtle font-serif italic text-xl">
            Properties
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-border-subtle">
              <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mb-4">Node Configuration</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] text-text-secondary mb-1.5">Agent Name</label>
                  <input 
                    type="text" 
                    defaultValue="InstantApply AI" 
                    className="w-full bg-bg-input border border-border-subtle text-text-primary px-3 py-2.5 text-xs rounded-lg outline-none focus:border-border-active transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-secondary mb-1.5">Description</label>
                  <textarea 
                    rows={3} 
                    defaultValue="Analyzes job descriptions and tailors application materials automatically."
                    className="w-full bg-bg-input border border-border-subtle text-text-primary px-3 py-2.5 text-xs rounded-lg outline-none focus:border-border-active transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-border-subtle">
              <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mb-4">Model Parameters</div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] text-text-secondary mb-1.5">Model</label>
                  <select className="w-full bg-bg-input border border-border-subtle text-text-primary px-3 py-2.5 text-xs rounded-lg outline-none focus:border-border-active transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%228%22_height=%228%22_viewBox=%220_0_8_8%22%3E%3Cpath_fill=%22%23666%22_d=%22M0_2l4_4_4-4z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_12px_center]">
                    <option>Gemini 1.5 Flash</option>
                    <option>Gemini 1.5 Pro</option>
                    <option>GPT-4o</option>
                  </select>
                </div>
                
                {/* Minimalistic Volume Knob Style Slider */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex justify-between w-full">
                    <label className="text-[11px] text-text-secondary">Temperature</label>
                    <span className="font-serif italic text-lg text-text-primary">{temp.toFixed(1)}</span>
                  </div>
                  
                  <div className="relative w-32 h-32 group">
                    {/* Knob Background */}
                    <div className="absolute inset-0 rounded-full bg-bg-input border-2 border-border-subtle shadow-inner" />
                    
                    {/* Tick Marks */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="1 5"
                        className="text-text-tertiary opacity-30"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${temp * 188.4} 251.2`}
                        strokeLinecap="round"
                        className="text-text-primary transition-all duration-300"
                        style={{ strokeDasharray: `${temp * 251.2 * 0.75}, 251.2`, transformOrigin: 'center', transform: 'rotate(135deg)' }}
                      />
                    </svg>
                    
                    {/* Knob Handle */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                      style={{ transform: `rotate(${(temp * 270) - 135}deg)` }}
                    >
                      <div className="w-1.5 h-6 bg-text-primary rounded-full -translate-y-8 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                    </div>

                    {/* Hidden Input for Control */}
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={temp}
                      onChange={(e) => setTemp(parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  </div>
                  <p className="text-[9px] text-text-tertiary uppercase tracking-widest font-mono">Drag to adjust</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mb-4">Outputs</div>
              <div className="mono text-text-secondary text-[10px] leading-relaxed">
                {`{`} <br />
                &nbsp;&nbsp;"sentiment": "positive", <br />
                &nbsp;&nbsp;"urgency": "high", <br />
                &nbsp;&nbsp;"category": "billing" <br />
                {`}`}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Status Bar */}
      <footer className="h-8 bg-bg-panel border-t border-border-subtle flex items-center justify-between px-6 text-[11px] text-text-tertiary mono shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#666] rounded-full" />
          <span>System Operational</span>
        </div>
        <div className="flex gap-4">
          <span>X: 420</span>
          <span className="opacity-20">|</span>
          <span>Y: 180</span>
          <span className="opacity-20">|</span>
          <span>Scale: {Math.round((getZoom() || 1) * 100)}%</span>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
};

export default App;
