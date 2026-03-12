"use client";

import { useEffect, useState } from "react";
import { Minus, Square, Copy, X } from "lucide-react";
import { useMangaStore } from "@/stores/manga-store";
import { getTranslations } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export default function Titlebar() {
  const settings = useMangaStore((s) => s.settings);
  const t = getTranslations(settings.uiLanguage as Language);
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    const api = window.electronAPI;
    if (!api) return;
    api.isMaximized().then(setMaximized);
    const unsub = api.onMaximizedChange(setMaximized);
    return unsub;
  }, []);

  const onMinimize = () => window.electronAPI?.minimize();
  const onMaximize = () => window.electronAPI?.maximize();
  const onClose = () => window.electronAPI?.close();

  return (
    <header
      className="titlebar-drag"
      style={{
        height: "var(--titlebar-height)",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 1000,
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 14 }}>
        <ManwhaWhamLogo size={22} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: 0.5 }}>
            {t.titlebar.appName}
          </span>
          <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8 }}>
            {t.titlebar.reader}
          </span>
        </div>
      </div>

      {/* Window Controls */}
      <div className="titlebar-no-drag" style={{ display: "flex", height: "100%" }}>
        <WindowButton onClick={onMinimize} hoverBg="rgba(255,255,255,0.06)">
          <Minus size={16} />
        </WindowButton>
        <WindowButton onClick={onMaximize} hoverBg="rgba(255,255,255,0.06)">
          {maximized ? <Copy size={14} /> : <Square size={14} />}
        </WindowButton>
        <WindowButton onClick={onClose} hoverBg="#e81123" hoverColor="#fff">
          <X size={16} />
        </WindowButton>
      </div>
    </header>
  );
}

function WindowButton({
  children,
  onClick,
  hoverBg,
  hoverColor,
}: {
  children: React.ReactNode;
  onClick: () => void;
  hoverBg: string;
  hoverColor?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 46,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: hovered ? hoverBg : "transparent",
        color: hovered && hoverColor ? hoverColor : "var(--text-secondary)",
        border: "none",
        cursor: "pointer",
        transition: "background 0.1s, color 0.1s",
      }}
    >
      {children}
    </button>
  );
}

function ManwhaWhamLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="mwh-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c5cfc" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#mwh-grad)" />
      {/* Stylized open book / manga pages */}
      <path
        d="M8 10 C8 10 12 8 16 10 C20 8 24 10 24 10 L24 23 C24 23 20 21 16 23 C12 21 8 23 8 23 Z"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <line x1="16" y1="10" x2="16" y2="23" stroke="white" strokeWidth="1.5" />
      {/* Reading lines */}
      <line x1="10" y1="13" x2="14" y2="13" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" />
      <line x1="10" y1="15.5" x2="14" y2="15.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" />
      <line x1="10" y1="18" x2="13" y2="18" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" />
      <line x1="18" y1="13" x2="22" y2="13" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" />
      <line x1="18" y1="15.5" x2="22" y2="15.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" />
      <line x1="18" y1="18" x2="21" y2="18" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
