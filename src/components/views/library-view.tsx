"use client";

import { useMangaStore } from "@/stores/manga-store";
import MangaCard from "@/components/shared/manga-card";
import { MangaGrid, EmptyState } from "@/components/shared/ui";
import { getTranslations } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export default function LibraryView() {
  const library = useMangaStore((s) => s.library);
  const openMangaDetail = useMangaStore((s) => s.openMangaDetail);
  const setView = useMangaStore((s) => s.setView);
  const settings = useMangaStore((s) => s.settings);
  const t = getTranslations(settings.uiLanguage as Language);

  if (library.length === 0) {
    return (
      <div className="animate-fadeIn" style={{ padding: "24px 32px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 24 }}>{t.library.title}</h2>
        <EmptyState
          icon="📚"
          title={t.library.empty}
          description={t.library.emptyDesc}
        />
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button className="btn-primary" onClick={() => setView("browse")}>
            {t.library.browseManga}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn" style={{ padding: "24px 32px", maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{t.library.title}</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {t.library.titlesSaved.replace("{n}", String(library.length))}
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
