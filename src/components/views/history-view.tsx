"use client";

import { useMangaStore } from "@/stores/manga-store";
import { EmptyState } from "@/components/shared/ui";
import { Clock, Trash2 } from "lucide-react";
import { useState } from "react";

export default function HistoryView() {
  const history = useMangaStore((s) => s.history);
  const clearHistory = useMangaStore((s) => s.clearHistory);
  const openMangaById = useMangaStore((s) => s.openMangaById);
  const [confirmClear, setConfirmClear] = useState(false);

  if (history.length === 0) {
    return (
      <div className="animate-fadeIn" style={{ padding: "24px 32px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 24 }}>History</h2>
        <EmptyState
          icon="🕐"
          title="No reading history"
          description="Your reading history will appear here as you read chapters."
        />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn" style={{ padding: "24px 32px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>History</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {history.length} entries
          </p>
        </div>
        {confirmClear ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={() => setConfirmClear(false)}>Cancel</button>
            <button
              className="btn-secondary"
              onClick={() => { clearHistory(); setConfirmClear(false); }}
              style={{ color: "var(--error)", borderColor: "var(--error)" }}
            >
              Clear All
            </button>
          </div>
        ) : (
          <button className="btn-ghost" onClick={() => setConfirmClear(true)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Trash2 size={14} />
            Clear
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
                Chapter {entry.chapterNumber} · Page {entry.page + 1}/{entry.totalPages}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-dim)", fontSize: 11, flexShrink: 0 }}>
              <Clock size={12} />
              {formatTimeAgo(entry.timestamp)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
