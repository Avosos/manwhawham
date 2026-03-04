"use client";

import { useMangaStore } from "@/stores/manga-store";
import { Monitor, BookOpen, Palette, Globe, Eye } from "lucide-react";

export default function SettingsView() {
  const settings = useMangaStore((s) => s.settings);
  const updateSettings = useMangaStore((s) => s.updateSettings);

  return (
    <div className="animate-fadeIn" style={{ padding: "24px 32px", maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 24 }}>Settings</h2>

      {/* Appearance */}
      <SettingsSection icon={<Palette size={16} />} title="Appearance">
        <SettingsRow label="Theme">
          <select
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value as "dark" | "grey" | "light" })}
            className="input"
            style={{ width: 160 }}
          >
            <option value="dark">Dark</option>
            <option value="grey">Grey</option>
            <option value="light">Light</option>
          </select>
        </SettingsRow>

        <SettingsRow label="Accent Color">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {["#7c5cfc", "#e879f9", "#f87171", "#4ade80", "#60a5fa", "#fbbf24"].map((color) => (
              <button
                key={color}
                onClick={() => updateSettings({ accentColor: color })}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: color,
                  border: settings.accentColor === color ? "2px solid var(--text-primary)" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
              />
            ))}
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => updateSettings({ accentColor: e.target.value })}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: "transparent",
              }}
            />
          </div>
        </SettingsRow>
      </SettingsSection>

      {/* Reader */}
      <SettingsSection icon={<BookOpen size={16} />} title="Reader">
        <SettingsRow label="Reading Mode">
          <select
            value={settings.readerMode}
            onChange={(e) => updateSettings({ readerMode: e.target.value as "vertical" | "paged" })}
            className="input"
            style={{ width: 160 }}
          >
            <option value="vertical">Vertical Scroll</option>
            <option value="paged">Paged</option>
          </select>
        </SettingsRow>

        <SettingsRow label="Image Fit">
          <select
            value={settings.readerFit}
            onChange={(e) => updateSettings({ readerFit: e.target.value as "width" | "height" | "original" })}
            className="input"
            style={{ width: 160 }}
          >
            <option value="width">Fit Width</option>
            <option value="height">Fit Height</option>
            <option value="original">Original Size</option>
          </select>
        </SettingsRow>

        <SettingsRow label="Reading Direction">
          <select
            value={settings.readerDirection}
            onChange={(e) => updateSettings({ readerDirection: e.target.value as "ltr" | "rtl" })}
            className="input"
            style={{ width: 160 }}
          >
            <option value="ltr">Left to Right</option>
            <option value="rtl">Right to Left</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      {/* Image Quality */}
      <SettingsSection icon={<Monitor size={16} />} title="Performance">
        <SettingsRow label="Image Quality">
          <select
            value={settings.imageQuality}
            onChange={(e) => updateSettings({ imageQuality: e.target.value as "data" | "dataSaver" })}
            className="input"
            style={{ width: 160 }}
          >
            <option value="data">High Quality</option>
            <option value="dataSaver">Data Saver</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      {/* Language */}
      <SettingsSection icon={<Globe size={16} />} title="Content">
        <SettingsRow label="Preferred Language">
          <select
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className="input"
            style={{ width: 160 }}
          >
            <option value="en">English</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="zh">Chinese</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="es">Spanish</option>
            <option value="pt-br">Portuguese (BR)</option>
            <option value="it">Italian</option>
            <option value="ru">Russian</option>
            <option value="pl">Polish</option>
          </select>
        </SettingsRow>

        <SettingsRow label="Show NSFW Content">
          <ToggleSwitch
            value={settings.showNSFW}
            onChange={(val) => updateSettings({ showNSFW: val })}
          />
        </SettingsRow>
      </SettingsSection>

      {/* About */}
      <SettingsSection icon={<Eye size={16} />} title="About">
        <div style={{ padding: "8px 0", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          <strong style={{ color: "var(--text-primary)" }}>ManwhaWham</strong> v0.1.0 alpha<br />
          Part of the <strong style={{ color: "var(--accent)" }}>Avosos</strong> ecosystem<br />
          Powered by MangaDex API
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      marginBottom: 24,
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 16px",
        borderBottom: "1px solid var(--border-subtle)",
        color: "var(--text-primary)",
        fontSize: 14,
        fontWeight: 600,
      }}>
        {icon}
        {title}
      </div>
      <div style={{ padding: "4px 16px" }}>
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: "1px solid var(--border-subtle)",
    }}>
      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
      {children}
    </div>
  );
}

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 42,
        height: 24,
        borderRadius: 12,
        border: "none",
        background: value ? "var(--accent)" : "var(--bg-surface)",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
      }}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "#fff",
        position: "absolute",
        top: 3,
        left: value ? 21 : 3,
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }} />
    </button>
  );
}
