"use client";

import { useEffect, useState } from "react";
import { useMangaStore } from "@/stores/manga-store";
import { EmptyState } from "@/components/shared/ui";
import { Download, Trash2, FolderOpen } from "lucide-react";

export default function DownloadsView() {
  const downloads = useMangaStore((s) => s.downloads);
  const loadDownloads = useMangaStore((s) => s.loadDownloads);
  const library = useMangaStore((s) => s.library);
  const openMangaById = useMangaStore((s) => s.openMangaById);

  useEffect(() => {
    loadDownloads();
  }, [loadDownloads]);

  const mangaIds = Object.keys(downloads);

  if (mangaIds.length === 0) {
    return (
      <div className="animate-fadeIn" style={{ padding: "24px 32px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 24 }}>Downloads</h2>
        <EmptyState
          icon="📥"
          title="No downloads yet"
          description="Download chapters for offline reading from any manga's detail page."
        />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn" style={{ padding: "24px 32px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Downloads</h2>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
          {mangaIds.length} manga with downloaded chapters
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mangaIds.map((mangaId) => {
          const chapters = downloads[mangaId];
          const libEntry = library.find((m) => m.id === mangaId);
          return (
            <DownloadEntry
              key={mangaId}
              mangaId={mangaId}
              title={libEntry?.title || mangaId}
              chapters={chapters}
              onClick={() => openMangaById(mangaId)}
            />
          );
        })}
      </div>
    </div>
  );
}

function DownloadEntry({ mangaId, title, chapters, onClick }: {
  mangaId: string;
  title: string;
  chapters: string[];
  onClick: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const handleDelete = async (chapterNum: string) => {
    await window.electronAPI?.deleteChapter(mangaId, chapterNum);
    useMangaStore.getState().loadDownloads();
  };

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
          padding: "14px 16px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
          color: "var(--text-primary)",
        }}
      >
        <Download size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            {chapters.length} chapter{chapters.length !== 1 ? "s" : ""} downloaded
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="btn-ghost"
          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
        >
          <FolderOpen size={13} /> View
        </button>
      </button>

      {expanded && (
        <div style={{
          padding: "0 16px 14px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          paddingTop: 12,
        }}>
          {chapters.sort((a, b) => parseFloat(a) - parseFloat(b)).map((ch) => (
            <div
              key={ch}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-tertiary)",
                fontSize: 12,
                color: "var(--text-secondary)",
              }}
            >
              Ch. {ch}
              <button
                onClick={() => handleDelete(ch)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-dim)",
                  padding: 2,
                  display: "flex",
                }}
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
