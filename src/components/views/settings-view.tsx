"use client";

import { useMangaStore } from "@/stores/manga-store";
import { Monitor, BookOpen, Palette, Globe, Eye, Languages } from "lucide-react";
import { getTranslations, LANGUAGES } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export default function SettingsView() {
  const settings = useMangaStore((s) => s.settings);
  const updateSettings = useMangaStore((s) => s.updateSettings);
  const t = getTranslations(settings.uiLanguage as Language);

  return (
    <div className="animate-fadeIn" style={{ padding: "24px 32px", maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 24 }}>{t.settings.title}</h2>

      {/* Language */}
      <SettingsSection icon={<Languages size={16} />} title={t.settings.language}>
        <SettingsRow label={t.settings.languageDesc}>
          <select
            value={settings.uiLanguage}
            onChange={(e) => updateSettings({ uiLanguage: e.target.value as "en" | "de" })}
            className="input"
            style={{ width: 160 }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </SettingsRow>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection icon={<Palette size={16} />} title={t.settings.appearance}>
        <SettingsRow label={t.settings.theme}>
          <select
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value as "dark" | "grey" | "light" })}
            className="input"
            style={{ width: 160 }}
          >
            <option value="dark">{t.settings.dark}</option>
            <option value="grey">{t.settings.grey}</option>
            <option value="light">{t.settings.light}</option>
          </select>
        </SettingsRow>

        <SettingsRow label={t.settings.accentColor}>
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
      <SettingsSection icon={<BookOpen size={16} />} title={t.settings.readerSection}>
        <SettingsRow label={t.settings.readingMode}>
          <select
            value={settings.readerMode}
            onChange={(e) => updateSettings({ readerMode: e.target.value as "vertical" | "paged" })}
            className="input"
            style={{ width: 160 }}
          >
            <option value="vertical">{t.settings.verticalScroll}</option>
            <option value="paged">{t.settings.pagedMode}</option>
          </select>
        </SettingsRow>

        <SettingsRow label={t.settings.imageFit}>
          <select
            value={settings.readerFit}
            onChange={(e) => updateSettings({ readerFit: e.target.value as "width" | "height" | "original" })}
            className="input"
            style={{ width: 160 }}
          >
            <option value="width">{t.settings.fitWidth}</option>
            <option value="height">{t.settings.fitHeight}</option>
            <option value="original">{t.settings.originalSize}</option>
          </select>
        </SettingsRow>

        <SettingsRow label={t.settings.readingDirection}>
          <select
            value={settings.readerDirection}
            onChange={(e) => updateSettings({ readerDirection: e.target.value as "ltr" | "rtl" })}
            className="input"
            style={{ width: 160 }}
          >
            <option value="ltr">{t.settings.leftToRight}</option>
            <option value="rtl">{t.settings.rightToLeft}</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      {/* Image Quality */}
      <SettingsSection icon={<Monitor size={16} />} title={t.settings.performance}>
        <SettingsRow label={t.settings.imageQuality}>
          <select
            value={settings.imageQuality}
            onChange={(e) => updateSettings({ imageQuality: e.target.value as "data" | "dataSaver" })}
            className="input"
            style={{ width: 160 }}
          >
            <option value="data">{t.settings.highQuality}</option>
            <option value="dataSaver">{t.settings.dataSaver}</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      {/* Language */}
      <SettingsSection icon={<Globe size={16} />} title={t.settings.content}>
        <SettingsRow label={t.settings.preferredLanguage}>
          <select
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className="input"
            style={{ width: 160 }}
          >
            <option value="en">{t.contentLanguages.english}</option>
            <option value="ja">{t.contentLanguages.japanese}</option>
            <option value="ko">{t.contentLanguages.korean}</option>
            <option value="zh">{t.contentLanguages.chinese}</option>
            <option value="fr">{t.contentLanguages.french}</option>
            <option value="de">{t.contentLanguages.german}</option>
            <option value="es">{t.contentLanguages.spanish}</option>
            <option value="pt-br">{t.contentLanguages.portugueseBr}</option>
            <option value="it">{t.contentLanguages.italian}</option>
            <option value="ru">{t.contentLanguages.russian}</option>
            <option value="pl">{t.contentLanguages.polish}</option>
          </select>
        </SettingsRow>

        <SettingsRow label={t.settings.showNSFW}>
          <ToggleSwitch
            value={settings.showNSFW}
            onChange={(val) => updateSettings({ showNSFW: val })}
          />
        </SettingsRow>
      </SettingsSection>

      {/* About */}
      <SettingsSection icon={<Eye size={16} />} title={t.settings.about}>
        <div style={{ padding: "8px 0", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          <strong style={{ color: "var(--text-primary)" }}>{t.settings.aboutVersion}</strong><br />
          {t.settings.aboutEcosystem}<br />
          {t.settings.aboutPoweredBy}
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
