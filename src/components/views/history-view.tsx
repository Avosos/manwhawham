"use client";

import { useMangaStore } from "@/stores/manga-store";
import { EmptyState } from "@/components/shared/ui";
import { Clock, Trash2 } from "lucide-react";
import { useState } from "react";
import { getTranslations } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import type { Translations } from "@/lib/i18n";

export default function HistoryView() {
  const history = useMangaStore((s) => s.history);
  const clearHistory = useMangaStore((s) => s.clearHistory);
  const openMangaById = useMangaStore((s) => s.openMangaById);
  const settings = useMangaStore((s) => s.settings);
  const t = getTranslations(settings.uiLanguage as Language);
  const [confirmClear, setConfirmClear] = useState(false);

  if (history.length === 0) {
    return (
      <div className="animate-fadeIn" style={{ padding: "24px 32px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 24 }}>{t.history.title}</h2>
        <EmptyState
          icon="🕐"
          title={t.history.empty}
          description={t.history.emptyDesc}
        />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn" style={{ padding: "24px 32px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{t.history.title}</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {t.history.entries.replace("{n}", String(history.length))}
          </p>
        </div>
        {confirmClear ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={() => setConfirmClear(false)}>{t.history.cancel}</button>
            <button
              className="btn-secondary"
              onClick={() => { clearHistory(); setConfirmClear(false); }}
              style={{ color: "var(--error)", borderColor: "var(--error)" }}
            >
              {t.history.clearAll}
            </button>
          </div>
        ) : (
          <button className="btn-ghost" onClick={() => setConfirmClear(true)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Trash2 size={14} />
            {t.history.clear}
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {history.map((entry) => (
          <button
            key={`${entry.mangaId}-${entry.timestamp}`}
            onClick={() => openMangaById(entry.mangaId)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 14px",
              borderRadius: "var(--radius-sm)",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.12s ease",
              color: "var(--text-primary)",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-elevated)";
              e.currentTarget.style.borderColor = "var(--border-default)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg-card)";
              e.currentTarget.style.borderColor = "var(--border-subtle)";
            }}
          >
            <div style={{
              width: 40,
              height: 56,
              borderRadius: 6,
              background: "var(--bg-tertiary)",
              flexShrink: 0,
              overflow: "hidden",
            }}>
              {entry.coverUrl && (
                <img src={entry.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {entry.mangaTitle}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                {t.history.chapterPage.replace("{chapter}", entry.chapterNumber).replace("{page}", String(entry.page + 1)).replace("{total}", String(entry.totalPages))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-dim)", fontSize: 11, flexShrink: 0 }}>
              <Clock size={12} />
              {formatTimeAgo(entry.timestamp, t.history)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number, h: Translations["history"]): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return h.justNow;
  if (mins < 60) return h.minutesAgo.replace("{n}", String(mins));
  const hours = Math.floor(mins / 60);
  if (hours < 24) return h.hoursAgo.replace("{n}", String(hours));
  const days = Math.floor(hours / 24);
  if (days < 7) return h.daysAgo.replace("{n}", String(days));
  return new Date(timestamp).toLocaleDateString();
}
