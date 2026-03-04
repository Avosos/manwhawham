"use client";

import { useMangaStore } from "@/stores/manga-store";
import MangaCard from "@/components/shared/manga-card";
import { SectionHeader, MangaGrid, LoadingGrid } from "@/components/shared/ui";
import { TrendingUp, Clock, Search } from "lucide-react";

export default function HomeView() {
  const popularManga = useMangaStore((s) => s.popularManga);
  const latestManga = useMangaStore((s) => s.latestManga);
  const browseLoading = useMangaStore((s) => s.browseLoading);
  const openMangaDetail = useMangaStore((s) => s.openMangaDetail);
  const setView = useMangaStore((s) => s.setView);
  const history = useMangaStore((s) => s.history);

  return (
    <div className="animate-fadeIn" style={{ padding: "24px 32px", maxWidth: 1400, margin: "0 auto" }}>
      {/* Hero Banner */}
      <div style={{
        background: "var(--accent-gradient)",
        borderRadius: "var(--radius-lg)",
        padding: "32px 40px",
        marginBottom: 32,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
            Welcome to ManwhaWham
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", maxWidth: 500, lineHeight: 1.5 }}>
            Your personal manga & manhwa reader. Browse thousands of titles from MangaDex,
            build your library, and read in style.
          </p>
          <button
            className="titlebar-no-drag"
            onClick={() => setView("browse")}
            style={{
              marginTop: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
          >
            <Search size={15} />
            Start Browsing
          </button>
        </div>
        {/* Decorative circles */}
        <div style={{
          position: "absolute",
          right: -30,
          top: -30,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }} />
        <div style={{
          position: "absolute",
          right: 80,
          bottom: -40,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }} />
      </div>

      {/* Continue Reading */}
      {history.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <SectionHeader
            title="Continue Reading"
            subtitle="Pick up where you left off"
          />
          <div style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            paddingBottom: 8,
          }}>
            {history.slice(0, 8).map((entry) => (
              <ContinueCard
                key={entry.mangaId}
                title={entry.mangaTitle}
                chapter={entry.chapterNumber}
                coverUrl={entry.coverUrl}
                onClick={() => {
                  const store = useMangaStore.getState();
                  store.openMangaById(entry.mangaId);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Popular */}
      <div style={{ marginBottom: 32 }}>
        <SectionHeader
          title="Popular"
          subtitle="Most followed titles"
          action={
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent)", fontSize: 12, fontWeight: 600 }}>
              <TrendingUp size={14} />
              Trending
            </div>
          }
        />
        {browseLoading && popularManga.length === 0 ? (
          <LoadingGrid count={10} />
        ) : (
          <MangaGrid>
            {popularManga.slice(0, 10).map((manga) => (
              <MangaCard key={manga.id} manga={manga} onClick={() => openMangaDetail(manga)} />
            ))}
          </MangaGrid>
        )}
      </div>

      {/* Latest Updates */}
      <div style={{ marginBottom: 32 }}>
        <SectionHeader
          title="Latest Updates"
          subtitle="Recently updated titles"
          action={
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--info)", fontSize: 12, fontWeight: 600 }}>
              <Clock size={14} />
              Fresh
            </div>
          }
        />
        {latestManga.length === 0 ? (
          <LoadingGrid count={10} />
        ) : (
          <MangaGrid>
            {latestManga.slice(0, 10).map((manga) => (
              <MangaCard key={manga.id} manga={manga} onClick={() => openMangaDetail(manga)} />
            ))}
          </MangaGrid>
        )}
      </div>
    </div>
  );
}

function ContinueCard({ title, chapter, coverUrl, onClick }: {
  title: string;
  chapter: string;
  coverUrl: string | null;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        minWidth: 260,
        padding: 10,
        borderRadius: "var(--radius-md)",
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s ease",
        flexShrink: 0,
        color: "var(--text-primary)",
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
        width: 44,
        height: 62,
        borderRadius: 6,
        background: "var(--bg-tertiary)",
        flexShrink: 0,
        overflow: "hidden",
      }}>
        {coverUrl && (
          <img src={coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
      <div style={{ overflow: "hidden" }}>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
          Chapter {chapter}
        </div>
      </div>
    </button>
  );
}
