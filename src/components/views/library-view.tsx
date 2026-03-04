"use client";

import { useMangaStore } from "@/stores/manga-store";
import MangaCard from "@/components/shared/manga-card";
import { MangaGrid, EmptyState } from "@/components/shared/ui";

export default function LibraryView() {
  const library = useMangaStore((s) => s.library);
  const openMangaDetail = useMangaStore((s) => s.openMangaDetail);
  const setView = useMangaStore((s) => s.setView);

  if (library.length === 0) {
    return (
      <div className="animate-fadeIn" style={{ padding: "24px 32px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 24 }}>Library</h2>
        <EmptyState
          icon="📚"
          title="Your library is empty"
          description="Add manga to your library by clicking the bookmark icon on any title's detail page."
        />
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button className="btn-primary" onClick={() => setView("browse")}>
            Browse Manga
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn" style={{ padding: "24px 32px", maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Library</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {library.length} title{library.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>
      <MangaGrid>
        {library.map((manga) => (
          <MangaCard key={manga.id} manga={manga} onClick={() => openMangaDetail(manga)} />
        ))}
      </MangaGrid>
    </div>
  );
}
