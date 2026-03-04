import { useState } from "react"
import { Search, ChevronRight, Cpu, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import * as Tooltip from '@radix-ui/react-tooltip'
import { SIDEBAR_SECTIONS, NODE_META } from "@/types"
import type { NodeType, SidebarSection } from "@/types"
import { useStore } from "@/store/useStore"
import { cn } from "@/utils/cn"

// ─── Node icons (inline SVG, same as NodeBase uses) ───────────────────────────

const NodeIcon = ({ type, color }: { type: NodeType; color: string }) => {
  switch (type) {
    case "router": return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    )
    case "switch": return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="8" width="20" height="8" rx="2" />
        <line x1="6" y1="12" x2="6" y2="12.01" strokeWidth="3" />
        <line x1="10" y1="12" x2="10" y2="12.01" strokeWidth="3" />
        <line x1="14" y1="12" x2="14" y2="12.01" strokeWidth="3" />
        <line x1="18" y1="12" x2="18" y2="12.01" strokeWidth="3" />
      </svg>
    )
    case "server": return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" />
        <circle cx="6" cy="6" r="1" fill={color} stroke="none" /><circle cx="6" cy="18" r="1" fill={color} stroke="none" />
      </svg>
    )
    case "vm": return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    )
    case "container": return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12.5c0 .3-.2.7-.6.9-1.4.8-5 2.6-8.4 2.6S5 14.2 3.6 13.4C3.2 13.2 3 12.8 3 12.5V8l9-4 10 4v4.5Z" />
      </svg>
    )
    case "firewall": return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4 6v6c0 5.5 3.4 10.7 8 12 4.6-1.3 8-6.5 8-12V6L12 2Z" />
        <path d="M9 12l2 2 4-4" strokeWidth="2" />
      </svg>
    )
    case "nas": return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="4" rx="1" /><rect x="2" y="10" width="20" height="4" rx="1" /><rect x="2" y="16" width="20" height="4" rx="1" />
        <circle cx="18" cy="6" r="0.8" fill={color} stroke="none" /><circle cx="18" cy="12" r="0.8" fill={color} stroke="none" />
      </svg>
    )
    case "cloud": return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z" />
      </svg>
    )
    case "isp": return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )
    case "apwifi": return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <circle cx="12" cy="20" r="1" fill={color} stroke="none" />
      </svg>
    )
  }
}

// ─── PaletteItemRow ───────────────────────────────────────────────────────────

function PaletteItemRow({ type }: { type: NodeType }) {
  const meta = NODE_META[type]

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/homelab-node-type", type)
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <Tooltip.Root delayDuration={400}>
      <Tooltip.Trigger asChild>
        <div
          draggable
          onDragStart={onDragStart}
          className="flex items-center gap-2.5 px-2 py-2 rounded cursor-grab active:cursor-grabbing
            hover:bg-[#1c2128] transition-colors select-none group"
        >
          <div
            className="flex items-center justify-center w-7 h-7 rounded shrink-0"
            style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}
          >
            <NodeIcon type={type} color={meta.color} />
          </div>
          <span className="text-[13px] text-[#8b949e] group-hover:text-[#c9d1d9] transition-colors">
            {meta.label}
          </span>
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <svg width="7" height="10" viewBox="0 0 7 10" fill="#484f58">
              <circle cx="1.5" cy="1.5" r="1" /><circle cx="5.5" cy="1.5" r="1" />
              <circle cx="1.5" cy="5" r="1" /><circle cx="5.5" cy="5" r="1" />
              <circle cx="1.5" cy="8.5" r="1" /><circle cx="5.5" cy="8.5" r="1" />
            </svg>
          </div>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={10}
          style={{
            background: '#161b22',
            border: `1px solid ${meta.color}40`,
            borderRadius: 6,
            padding: '7px 11px',
            fontFamily: '"JetBrains Mono", monospace',
            maxWidth: 220,
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: meta.color, marginBottom: 3 }}>
            {meta.label}
          </div>
          <div style={{ fontSize: 11, color: '#8b949e', lineHeight: 1.5 }}>
            {meta.description}
          </div>
          <Tooltip.Arrow style={{ fill: '#30363d' }} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

// ─── SectionBlock ─────────────────────────────────────────────────────────────

function SectionBlock({ section, query }: { section: SidebarSection; query: string }) {
  const [open, setOpen] = useState(true)
  const filtered = section.types.filter((t) =>
    NODE_META[t].label.toLowerCase().includes(query.toLowerCase()) ||
    NODE_META[t].description.toLowerCase().includes(query.toLowerCase()),
  )
  if (query && filtered.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 w-full px-1 py-1 text-left group"
      >
        <ChevronRight
          size={12}
          className={cn(
            "text-[#484f58] transition-transform duration-150",
            open && "rotate-90",
          )}
        />
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: section.color }} />
        <span className="text-[11px] font-semibold text-[#484f58] uppercase tracking-widest group-hover:text-[#8b949e] transition-colors">
          {section.label}
        </span>
        <span className="ml-auto text-[11px] text-[#30363d]">{filtered.length}</span>
      </button>

      {open && (
        <div className="ml-1 pl-2 border-l border-[#21262d] space-y-0.5 mb-1">
          {filtered.map((type) => (
            <PaletteItemRow key={type} type={type} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export function Sidebar() {
  const [query, setQuery] = useState("")
  const [collapsed, setCollapsed] = useState(false)
  const nodeCount = useStore((s) => s.nodes.length)
  const edgeCount = useStore((s) => s.edges.length)
  const diagramName = useStore((s) => s.diagramName)
  const setDiagramName = useStore((s) => s.setDiagramName)

  return (
    <Tooltip.Provider>
      <aside
        className="flex flex-col shrink-0 h-full border-r border-[#21262d] overflow-hidden transition-all duration-200"
        style={{ background: "#0d1117", width: collapsed ? 42 : 260 }}
      >
        {/* Collapsed state: just the toggle button */}
        {collapsed ? (
          <div className="flex flex-col items-center pt-3 gap-3">
            <button
              onClick={() => setCollapsed(false)}
              title="Ouvrir la sidebar"
              className="flex items-center justify-center w-7 h-7 rounded border border-[#30363d]
                text-[#484f58] hover:text-[#00e5ff] hover:border-[#00e5ff] transition-colors"
            >
              <PanelLeftOpen size={14} />
            </button>
          </div>
        ) : (
          <>
        {/* Logo */}
        <div className="px-4 pt-4 pb-3 border-b border-[#21262d]">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-[#00e5ff]/10 border border-[#00e5ff]/25">
              <Cpu size={16} className="text-[#00e5ff]" />
            </div>
            <div className="leading-none flex-1">
              <div className="text-[13px] font-bold text-[#00e5ff] tracking-tight">HomeLab</div>
              <div className="text-[10px] text-[#30363d] uppercase tracking-widest">Designer</div>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              title="Réduire la sidebar"
              className="text-[#30363d] hover:text-[#8b949e] transition-colors"
            >
              <PanelLeftClose size={14} />
            </button>
          </div>

          <input
            value={diagramName}
            onChange={(e) => setDiagramName(e.target.value)}
            placeholder="Diagram name…"
            className="w-full bg-[#161b22] border border-[#30363d] rounded text-[12px]
              text-[#8b949e] px-2.5 py-2 outline-none focus:border-[#00e5ff]
              focus:text-[#e6edf3] transition-colors"
            style={{ fontFamily: "inherit" }}
          />
        </div>

        {/* Search */}
        <div className="px-4 py-2.5 border-b border-[#21262d]">
          <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded px-2.5 py-2
            focus-within:border-[#00e5ff] transition-colors">
            <Search size={13} className="text-[#484f58] shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrer les composants…"
              className="flex-1 bg-transparent text-[12px] text-[#c9d1d9] outline-none placeholder:text-[#484f58]"
              style={{ fontFamily: "inherit" }}
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-[#484f58] hover:text-[#8b949e]">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><path d="M6.5 1.5l-5 5M1.5 1.5l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-2.5 space-y-1">
          {SIDEBAR_SECTIONS.map((s) => (
            <SectionBlock key={s.id} section={s} query={query} />
          ))}
        </div>

        {/* Tips */}
        {!query && (
          <div className="px-4 pt-2.5 pb-2.5 border-t border-[#21262d]">
            <div className="text-[10px] text-[#30363d] leading-relaxed space-y-0.5">
              <div>› Glisser pour ajouter</div>
              <div>› Double-clic pour renommer</div>
              <div>› Handles = connexions</div>
            </div>
          </div>
        )}

        {/* Footer stats */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#21262d]">
          <span className="text-[10px] uppercase tracking-widest text-[#30363d]">canvas</span>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#484f58] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3fb950] inline-block" />
              {nodeCount}N
            </span>
            <span className="text-[10px] text-[#484f58] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] inline-block" />
              {edgeCount}E
            </span>
          </div>
        </div>
          </>
        )}
      </aside>
    </Tooltip.Provider>
  )
}
