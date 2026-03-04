"use client";

import { useState } from "react";
import { Home, Search, BookOpen, Clock, Download, Settings } from "lucide-react";
import { useMangaStore } from "@/stores/manga-store";
import type { NavView } from "@/types";

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: <Home size={18} /> },
  { id: "browse", label: "Browse", icon: <Search size={18} /> },
  { id: "library", label: "Library", icon: <BookOpen size={18} /> },
  { id: "history", label: "History", icon: <Clock size={18} /> },
  { id: "downloads", label: "Downloads", icon: <Download size={18} /> },
];

const BOTTOM_ITEMS: NavItem[] = [
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function Sidebar() {
  const currentView = useMangaStore((s) => s.currentView);
  const setView = useMangaStore((s) => s.setView);
  const library = useMangaStore((s) => s.library);

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, padding: "4px 12px 8px", userSelect: "none" }}>
          Navigation
        </div>
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={currentView === item.id}
            onClick={() => setView(item.id)}
            badge={item.id === "library" && library.length > 0 ? library.length : undefined}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "8px 8px 14px", borderTop: "1px solid var(--border-subtle)" }}>
        {BOTTOM_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={currentView === item.id}
            onClick={() => setView(item.id)}
          />
        ))}
        <div style={{
          marginTop: 10,
          padding: "0 12px",
          fontSize: 10,
          color: "var(--text-dim)",
          userSelect: "none",
        }}>
          v0.1.0 · alpha
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  item,
  active,
  onClick,
  badge,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "9px 12px",
        borderRadius: "var(--radius-sm)",
        background: active ? "var(--accent-muted)" : hovered ? "var(--bg-hover)" : "transparent",
        color: active ? "var(--accent-hover)" : hovered ? "var(--text-primary)" : "var(--text-secondary)",
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        textAlign: "left",
        transition: "all 0.12s ease",
        position: "relative",
      }}
    >
      {active && (
        <div style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: 3,
          height: 18,
          borderRadius: 2,
          background: "var(--accent)",
        }} />
      )}
      {item.icon}
      <span style={{ flex: 1 }}>{item.label}</span>
      {badge !== undefined && (
        <span style={{
          background: "var(--success)",
          color: "#000",
          fontSize: 10,
          fontWeight: 700,
          padding: "1px 6px",
          borderRadius: 999,
          minWidth: 18,
          textAlign: "center",
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}
