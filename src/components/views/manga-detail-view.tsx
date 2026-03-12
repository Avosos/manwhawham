"use client";

import { useState, useEffect, useRef } from "react";
import { useMangaStore } from "@/stores/manga-store";
import { Spinner } from "@/components/shared/ui";
import {
  ArrowLeft,
  BookmarkPlus,
  BookmarkCheck,
  Play,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Users,
} from "lucide-react";
import { getTranslations } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export default function MangaDetailView() {
  const selectedManga = useMangaStore((s) => s.selectedManga);
  const chapters = useMangaStore((s) => s.selectedMangaChapters);
  const detailLoading = useMangaStore((s) => s.detailLoading);
  const goBack = useMangaStore((s) => s.goBack);
  const addToLibrary = useMangaStore((s) => s.addToLibrary);
  const removeFromLibrary = useMangaStore((s) => s.removeFromLibrary);
  const isInLibrary = useMangaStore((s) => s.isInLibrary);
  const openReader = useMangaStore((s) => s.openReader);
  const downloads = useMangaStore((s) => s.downloads);
  const settings = useMangaStore((s) => s.settings);
  const t = getTranslations(settings.uiLanguage as Language);

  const [chaptersExpanded, setChaptersExpanded] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const attempted = useRef(false);

  const manga = selectedManga;
  const inLib = manga ? isInLibrary(manga.id) : false;
  const dlChapters = manga ? downloads[manga.id] || [] : [];

  useEffect(() => {
    if (!manga?.coverUrl || attempted.current) return;
    attempted.current = true;
    const img = new Image();
    img.onload = () => setImgSrc(manga.coverUrl);
    img.onerror = () => {
      window.electronAPI?.proxyImage(manga.coverUrl!).then((data) => {
        if (data) setImgSrc(data);
      });
    };
    img.src = manga.coverUrl!;

    return () => { attempted.current = false; };
  }, [manga?.coverUrl]);

  if (!manga) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <Spinner size={32} />
      </div>
    );
  }

  const sortedChapters = [...chapters].sort((a, b) => {
    const aNum = parseFloat(a.chapter || "0");
    const bNum = parseFloat(b.chapter || "0");
    return sortAsc ? aNum - bNum : bNum - aNum;
  });

  const handleReadFirst = () => {
    if (chapters.length === 0) return;
    // Find first chapter
    const sorted = [...chapters].sort((a, b) => parseFloat(a.chapter || "0") - parseFloat(b.chapter || "0"));
    const idx = chapters.indexOf(sorted[0]);
    openReader(manga.id, manga.title, manga.coverUrl, chapters, idx);
  };

  const handleReadChapter = (chapterIndex: number) => {
    openReader(manga.id, manga.title, manga.coverUrl, chapters, chapterIndex);
  };

  const handleDownloadChapter = async (chapterIdx: number) => {
    const api = window.electronAPI;
    if (!api) return;
    const ch = chapters[chapterIdx];
    if (!ch) return;
    try {
      const pageData = await api.getPages(ch.id);
      const quality = useMangaStore.getState().settings.imageQuality;
      const pages = pageData.quality[quality] || pageData.quality.data || [];
      await api.saveChapter(manga.id, ch.chapter || "0", pages);
      useMangaStore.getState().loadDownloads();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const statusColors: Record<string, string> = {
    ongoing: "var(--success)",
    completed: "var(--info)",
    hiatus: "var(--warning)",
    cancelled: "var(--error)",
  };

  return (
    <div className="animate-fadeIn" style={{ overflow: "auto", height: "100%" }}>
      {/* Hero */}
      <div style={{
        position: "relative",
        padding: "32px 32px 24px",
        background: "linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-primary) 100%)",
      }}>
        {/* Back button */}
        <button onClick={goBack} className="btn-ghost" style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={16} />
          {t.detail.back}
        </button>

        <div style={{ display: "flex", gap: 28 }}>
          {/* Cover */}
          <div style={{
            width: 220,
            flexShrink: 0,
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          }}>
            <div style={{ paddingBottom: "142%", position: "relative", background: "var(--bg-tertiary)" }}>
              {imgSrc && (
                <img src={imgSrc} alt={manga.title} style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }} />
              )}
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.2 }}>
              {manga.title}
            </h1>

            {manga.altTitles.length > 0 && (
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                {manga.altTitles.slice(0, 3).join(" · ")}
              </p>
            )}

            {/* Metadata row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {manga.status && (
                <span className="badge" style={{ background: `${statusColors[manga.status]}20`, color: statusColors[manga.status] }}>
                  {manga.status}
                </span>
              )}
              {manga.year && (
                <span className="badge">{manga.year}</span>
              )}
              {manga.demographic && (
                <span className="badge">{manga.demographic}</span>
              )}
              {manga.contentRating && manga.contentRating !== "safe" && (
                <span className="badge" style={{ background: "rgba(248,113,113,0.15)", color: "var(--error)" }}>
                  {manga.contentRating}
                </span>
              )}
            </div>

            {/* Author/Artist */}
            <div style={{ display: "flex", gap: 16, marginBottom: 14, fontSize: 13 }}>
              {manga.author && (
                <span style={{ color: "var(--text-secondary)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>{t.detail.author}</strong> {manga.author}
                </span>
              )}
              {manga.artist && manga.artist !== manga.author && (
                <span style={{ color: "var(--text-secondary)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>{t.detail.artist}</strong> {manga.artist}
                </span>
              )}
            </div>

            {/* Tags */}
            {manga.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {manga.tags.map((tag) => (
                  <span
                    key={tag.id}
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 999,
                      background: "var(--bg-surface)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button className="btn-primary" onClick={handleReadFirst} disabled={chapters.length === 0} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Play size={15} />
                {chapters.length > 0 ? t.detail.startReading : t.detail.noChapters}
              </button>
              <button
                className="btn-secondary"
                onClick={() => inLib ? removeFromLibrary(manga.id) : addToLibrary(manga)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: inLib ? "var(--accent)" : undefined,
                  borderColor: inLib ? "var(--accent)" : undefined,
                }}
              >
                {inLib ? <BookmarkCheck size={15} /> : <BookmarkPlus size={15} />}
                {inLib ? t.detail.inLibrary : t.detail.addToLibrary}
              </button>
              <button
                className="btn-ghost"
                onClick={() => window.electronAPI?.openExternal(`https://mangadex.org/title/${manga.id}`)}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <ExternalLink size={14} />
                {t.detail.mangadex}
              </button>
            </div>

            {/* Description */}
            {manga.description && (
              <div style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxHeight: 120,
                overflow: "hidden",
                WebkitMaskImage: "linear-gradient(180deg, #000 60%, transparent 100%)",
                maskImage: "linear-gradient(180deg, #000 60%, transparent 100%)",
              }}>
                {manga.description}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div style={{ padding: "0 32px 32px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          borderBottom: "1px solid var(--border-subtle)",
          marginBottom: 8,
        }}>
          <button
            onClick={() => setChaptersExpanded(!chaptersExpanded)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-primary)",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {chaptersExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            {t.detail.chapters.replace("{n}", String(chapters.length))}
          </button>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="btn-ghost"
            style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
          >
            {sortAsc ? t.detail.ascending : t.detail.descending}
            {sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {detailLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <Spinner size={28} />
          </div>
        ) : chaptersExpanded && (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sortedChapters.map((ch) => {
              const chIdx = chapters.indexOf(ch);
              const isDownloaded = dlChapters.includes(ch.chapter || "0");
              return (
                <div
                  key={ch.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    transition: "background 0.1s",
                    cursor: "pointer",
                  }}
                  onClick={() => !ch.externalUrl && handleReadChapter(chIdx)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                      {t.detail.chapter.replace("{n}", ch.chapter || "?")}
                      {ch.title && (
                        <span style={{ fontWeight: 400, color: "var(--text-secondary)", marginLeft: 8 }}>
                          {ch.title}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Users size={10} />
                        {ch.scanlationGroup}
                      </span>
                      {ch.volume && <span>{t.detail.volume.replace("{n}", ch.volume)}</span>}
                      <span>{new Date(ch.publishAt).toLocaleDateString()}</span>
                      {ch.pages > 0 && <span>{t.detail.pages.replace("{n}", String(ch.pages))}</span>}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    {isDownloaded && (
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "var(--success)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: "rgba(74,222,128,0.1)",
                      }}>
                        {t.detail.downloaded}
                      </span>
                    )}
                    {ch.externalUrl ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); window.electronAPI?.openExternal(ch.externalUrl!); }}
                        className="btn-ghost"
                        style={{ padding: 6 }}
                      >
                        <ExternalLink size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownloadChapter(chIdx); }}
                        className="btn-ghost"
                        style={{ padding: 6 }}
                        title={t.detail.downloadChapter}
                      >
                        <Download size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
