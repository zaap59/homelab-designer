# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # TypeScript type-check + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

No test suite is configured.

## Architecture

**Homelab Designer** is a browser-only network diagram editor. Users drag network/infrastructure components onto a canvas, connect them with typed edges, and edit their properties in a right-side panel. Diagrams auto-save to `localStorage` and can be exported/imported as `.hlab.json` files or as PNG.

### Tech stack

- **React Flow (`@xyflow/react`)** — canvas, nodes, edges, handles
- **Zustand** — single global store (`src/store/useStore.ts`)
- **Tailwind CSS v4** — utility classes; design tokens in `src/styles/tokens.css`
- **lucide-react** — icons; **html-to-image** — PNG export

### Layout (`src/App.tsx`)

```
Toolbar (top)
├── Sidebar (left)   — draggable node palette grouped by category
├── Canvas (center)  — React Flow instance
└── PropertiesPanel / EdgePropertiesPanel (right, conditional)
```

### State (`src/store/useStore.ts`)

Single Zustand store holds nodes, edges, selection, clipboard, undo/redo history (50-step), snap-to-grid, theme, and project name. All mutations go through the store. A `checkpoint()` call must precede any destructive/structural change to enable undo.

### Types (`src/types/index.ts`)

Central source of truth for:
- `NodeType` union — `router | switch | server | vm | container | firewall | nas | cloud | isp | apwifi | group | camera`
- `EdgeType` union — `ethernet | fiber | wifi | vpn | vlan`
- Per-node data interfaces (e.g. `RouterData`, `SwitchData`, …)
- `BaseNodeData` — union of all node fields used by the store
- `EDGE_META` — rendering config per edge type (color, dash pattern, width)
- `NODE_META` — label, color, description per node type
- `SIDEBAR_SECTIONS` — sidebar groupings

### Nodes (`src/components/nodes/`)

- **`NodeBase.tsx`** — shared wrapper rendered by every node. Provides: accent strip, header (icon + label + status dot), inline label edit (double-click), hover action bar (rename/delete), and default 4 connection handles (top/bottom/left/right). Pass `customHandles` prop to suppress defaults and supply `handles` prop instead.
- **`shared/index.tsx`** — sub-primitives: `NodeField`, `NodeBody`, `NodeDivider`, `NodeTag`, `NodeTags`, design token object `T`, `STATUS_STYLE`.
- Individual node files compose `NodeBase` with their own icon, fields, and custom handles where needed (e.g. `SwitchNode` renders per-port handles).
- `index.ts` exports the `nodeTypes` map consumed by React Flow.

### Edges (`src/components/edges/`)

- **`HLabEdge.tsx`** — single custom edge type `hlab`. Reads `edgeType` from edge data to apply `EDGE_META` styling (color, dash, width) and optional directional arrow marker.
- `index.ts` exports the `edgeTypes` map.

### Properties panels (`src/components/properties/`)

- `PropertiesPanel.tsx` — renders fields for the selected node; switches on `nodeType` to show type-specific inputs.
- `EdgePropertiesPanel.tsx` — renders fields for the selected edge (type selector, label, bandwidth, etc.).

### Persistence

Diagrams are saved to `localStorage` key `homelab-designer:diagram` as `DiagramState` JSON (version `1.1.0`). Auto-save runs every 30 s and on `beforeunload`. Export produces a `<slug>.hlab.json` file.

## Conventions

- Path alias `@/` maps to `src/`.
- CSS classes follow a `hlab-` prefix for component-specific styles defined in `src/index.css`.
- All new node types must be: added to `NodeType`, given metadata in `NODE_META` and a default label in the store's `DEFAULT_LABELS`, added to `SIDEBAR_SECTIONS`, implemented as a component extending `NodeBase`, and registered in `src/components/nodes/index.ts`.
